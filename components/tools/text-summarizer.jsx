"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { FileText, Settings, Loader2, RotateCcw, Clipboard, Copy } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import tr from "textrank"

// A simple placeholder for a summarization function.
// For a real-world application, you would replace this with a more sophisticated
// summarization library or an API call to a backend service.
const summarizeText = (text, maxLength) => {
  const sentences = text.split(/(?<=[.?!])\s+/);
  if (sentences.length <= maxLength) {
    return text;
  }
  return sentences.slice(0, maxLength).join(' ');
};


export function TextSummarizerTool() {
  const [inputText, setInputText] = useState("")
  const [summary, setSummary] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [summaryLength, setSummaryLength] = useState([3]) // Default to 3 sentences
  const [originalWordCount, setOriginalWordCount] = useState(0)
  const [summaryWordCount, setSummaryWordCount] = useState(0)
  

const handleSummarize = async () => {
  if (!inputText.trim()) return;
  setIsProcessing(true);

  const article = String(inputText);
  const textRank = new tr.TextRank(article);

  await textRank.summarize(); // important: generates ranked sentences

  const rankedSentences = textRank.getRankedSentences(); // returns sentences with scores
  const originalWords = article.trim().split(/\s+/).length;
  setOriginalWordCount(originalWords);

  const topSentences = rankedSentences
    .slice(0, summaryLength[0])
    .map(item => item.sentence)
    .join(' ');

  setSummary(topSentences);

  const summaryWords = topSentences.trim().split(/\s+/).length;
  setSummaryWordCount(summaryWords);

  setIsProcessing(false);
};


  const handleClear = () => {
    setInputText("")
    setSummary("")
    setOriginalWordCount(0)
    setSummaryWordCount(0)
    setSummaryLength([3])
  }

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Optional: Add a toast notification for user feedback
  };

  const reductionPercentage = originalWordCount > 0
    ? (((originalWordCount - summaryWordCount) / originalWordCount) * 100).toFixed(1)
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Tool Header */}
      <Card className="border-0 bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/20 dark:to-blue-900/10 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center shadow-lg border border-blue-200/50 dark:border-blue-800/50">
              <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Text Summarizer
                </CardTitle>
                <Badge
                  variant="outline"
                  className="bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800"
                >
                  Text Tools
                </Badge>
              </div>
              <CardDescription className="text-base">
                Condense long articles or text into a brief summary
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-start">
        {/* Left Content Area */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Input Area */}
          <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg flex-1">
            <CardHeader className="border-b border-muted/20">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clipboard className="w-5 h-5 text-blue-600" />
                Your Text
              </CardTitle>
              <CardDescription>Paste the text you want to summarize</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your text here..."
                className="h-64 text-base resize-none border-2 border-dashed border-blue-200 dark:border-blue-800/50 focus:border-blue-400 dark:focus:border-blue-600"
              />
               <div className="text-xs text-muted-foreground mt-2 text-right">
                {inputText.trim().split(/\s+/).filter(Boolean).length} words
               </div>
            </CardContent>
          </Card>

          {/* Summary Output */}
          {summary && (
            <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg animate-in slide-in-from-bottom-4 duration-500">
              <CardHeader className="border-b border-muted/20">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Copy className="w-5 h-5 text-green-600" />
                    Generated Summary
                  </CardTitle>
                  <Button onClick={() => handleCopyToClipboard(summary)} size="sm" variant="ghost">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-base leading-relaxed">{summary}</p>
                <div className="mt-4 flex items-center justify-end gap-4 text-xs text-muted-foreground border-t pt-4">
                  <span>Original: {originalWordCount} words</span>
                  <span>Summary: {summaryWordCount} words</span>
                  <span className="font-bold text-green-600">
                    ↓ {reductionPercentage}% Reduction
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Settings Panel */}
        <div className="flex flex-col">
          <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg h-full">
            <CardHeader className="border-b border-muted/20">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                Summarizer Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <Label className="text-sm font-medium">Summary Length</Label>
                <p className="text-sm text-muted-foreground">
                  Summary will be approximately <span className="text-blue-500 font-bold">{summaryLength[0]}</span> sentences long.
                </p>
                <Slider
                  value={summaryLength}
                  onValueChange={setSummaryLength}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Shorter</span>
                  <span>Longer</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleSummarize}
              disabled={isProcessing || !inputText.trim()}
              className="flex-1 h-12 text-base bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  <span className="animate-pulse">Summarizing...</span>
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5 mr-2" />
                  Summarize Text
                </>
              )}
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              className="h-12 px-6 bg-transparent"
              disabled={!inputText && !summary}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}