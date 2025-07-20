import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI client with your API key from environment variables
const genAI = new GoogleGenerativeAI("AIzaSyCWyvoh03WxPhP8zy_zbm98nMeUbFaTdXU");

// Helper function to handle API calls with retries and exponential backoff
async function generateContentWithRetry(model, prompt, maxRetries = 3) {
  let attempt = 0;
  let delay = 1000; // Start with a 1-second delay

  while (attempt < maxRetries) {
    try {
      // Attempt to generate content
      const result = await model.generateContent(prompt);
      // If successful, return the result immediately
      return result;
    } catch (error) {
      attempt++;
      
      // Check if the error is a rate limit or quota error (status 429)
      if (error.status === 429 && attempt < maxRetries) {
        // Extract retry delay from error if available
        let retryDelay = delay;
        
        // Check if Google provided a specific retry delay
        if (error.errorDetails && Array.isArray(error.errorDetails)) {
          const retryInfo = error.errorDetails.find(detail => 
            detail['@type'] === 'type.googleapis.com/google.rpc.RetryInfo'
          );
          if (retryInfo && retryInfo.retryDelay) {
            // Convert "27s" to milliseconds
            const seconds = parseInt(retryInfo.retryDelay.replace('s', ''));
            retryDelay = Math.max(seconds * 1000, delay);
          }
        }
        
        console.log(`Quota/Rate limit exceeded. Retrying in ${retryDelay / 1000}s... (Attempt ${attempt}/${maxRetries})`);
        
        // Wait for the calculated delay
        await new Promise(res => setTimeout(res, retryDelay));
        
        // Increase the delay for the next attempt (exponential backoff)
        delay = Math.min(delay * 2, 60000); // Cap at 60 seconds
      } else {
        // If it's another type of error or we've exhausted retries, throw the error
        console.error("Failed to generate content after multiple retries.", error);
        throw error;
      }
    }
  }
  
  // This should never be reached, but just in case
  throw new Error("Maximum retries exceeded");
}

export async function POST(req) {
  try {
    // Check if API key is configured
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Google Generative AI API key is not configured." }), 
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { inputText, humanizationLevel, writingStyle, tone } = await req.json();

    if (!inputText) {
      return new Response(
        JSON.stringify({ error: "Input text is required." }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Access the generative model with the current recommended model name
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

    // Construct a detailed prompt for the AI
    const prompt = `
      Rewrite the following text to make it sound more human-like. 
      The original text is AI-generated. Your task is to transform it while preserving the core meaning.
      
      **Humanization Level:** ${humanizationLevel}% (A higher percentage means a more significant rewrite to sound less like AI).
      **Desired Writing Style:** ${writingStyle}.
      **Desired Tone:** ${tone}.

      **Original Text:**
      "${inputText}"

      **Rewritten (Humanized) Text:**
    `;

    // Generate content using the retry logic
    const result = await generateContentWithRetry(model, prompt);
    
    const response = await result.response;
    const humanizedText = response.text();

    return new Response(JSON.stringify({ humanizedText }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    // Log the final error after retries have failed
    console.error("Error in Gemini API call after retries:", error);
    
    // Check if the error has a status code and return it, otherwise default to 500
    const status = error.status || 500;
    let errorMessage = "Failed to humanize text.";
    
    if (error.status === 429) {
      // Check if it's a quota issue vs rate limit
      const errorString = error.toString();
      if (errorString.includes("quota") || errorString.includes("exceeded your current quota")) {
        errorMessage = "You have exceeded your Google Generative AI quota limits. Please check your plan and billing details, or try again later.";
      } else {
        errorMessage = "Rate limit exceeded. Please try again later.";
      }
    } else if (error.status === 400 && error.message?.includes("API key not valid")) {
      errorMessage = "Invalid API key. Please check your Google Generative AI API key configuration.";
    }

    return new Response(JSON.stringify({ error: errorMessage }), { 
      status,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}