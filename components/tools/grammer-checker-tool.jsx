"use client"

import { useState } from "react"
import axios from "axios"; // Using axios for clean API requests
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardTitleMain } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { SpellCheck, PenSquare, Loader2, RotateCcw, AlertCircle, Info } from "lucide-react"
import { toolsData } from "@/lib/tools-data";
import Head from "next/head";

export function GrammarCheckerTool({ toolId }) {
  const [inputText, setInputText] = useState("")
  const [errors, setErrors] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)
  const toolData = toolsData.find((tool) => tool.id === toolId)

  const handleGrammarCheck = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setHasChecked(true);
    setErrors([]); // Clear previous errors

    try {
      // Using the free, public LanguageTool API.
      // For production apps, consider a paid plan or hosting your own instance.
      const response = await axios.post(
        'https://api.languagetool.org/v2/check',
        `text=${encodeURIComponent(inputText)}&language=en-US`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      setErrors(response.data.matches);

    } catch (error) {
      console.error("Failed to check grammar:", error);
      // You could set a specific error state here to show a message in the UI
      setErrors([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputText("")
    setErrors([])
    setHasChecked(false)
  }

  // Helper function to render the text with highlighted errors
  const getHighlightedText = (text, errors) => {
    let lastIndex = 0;
    const parts = [];

    // Sort errors by their position in the text to process them correctly
    const sortedErrors = [...errors].sort((a, b) => a.offset - b.offset);

    sortedErrors.forEach((error, index) => {
      // Add the plain text part before the error
      if (error.offset > lastIndex) {
        parts.push(<span key={`text-${lastIndex}`}>{text.substring(lastIndex, error.offset)}</span>);
      }

      // Add the highlighted error text
      const errorText = text.substring(error.offset, error.offset + error.length);
      const categoryColor = error.rule.category.id === 'TYPOGRAPHY' ? 'bg-blue-100 dark:bg-blue-900/40' : 'bg-yellow-100 dark:bg-yellow-900/40';
      parts.push(
        <span key={`error-${index}`} className={`p-0.5 rounded-sm ${categoryColor}`}>
          {errorText}
        </span>
      );

      lastIndex = error.offset + error.length;
    });

    // Add any remaining text after the last error
    if (lastIndex < text.length) {
      parts.push(<span key={`text-${lastIndex}`}>{text.substring(lastIndex)}</span>);
    }

    return parts;
  }

  const errorCount = errors.length;

  return (
    <>
      <head>
        <meta name="description" content={toolData.metaDescription} />
      </head>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Tool Header */}
        <Card className="border-0 bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/20 dark:to-blue-900/10 shadow-lg">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center shadow-lg border border-blue-200/50 dark:border-blue-800/50">
                <SpellCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitleMain className="text-2xl bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    Grammar & Spell Checker
                  </CardTitleMain>
                  <Badge
                    variant="outline"
                    className="bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800"
                  >
                    Text Tools
                  </Badge>
                </div>
                <CardDescription className="text-base">
                  Improve your writing by correcting grammar and spelling mistakes.
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
                  <PenSquare className="w-5 h-5 text-blue-600" />
                  Your Text
                </CardTitle>
                <CardDescription>Paste your text and we'll highlight the mistakes.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste your text here... For example: 'This are an example of bad grammer.'"
                  className="h-64 text-base resize-none border-2 border-dashed border-blue-200 dark:border-blue-800/50 focus:border-blue-400 dark:focus:border-blue-600"
                />
                <div className="text-xs text-muted-foreground mt-2 text-right">
                  {inputText.trim().split(/\s+/).filter(Boolean).length} words
                </div>
              </CardContent>
            </Card>

            {/* Errors Output */}
            {hasChecked && !isLoading && (
              <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg animate-in slide-in-from-bottom-4 duration-500">
                <CardHeader className="border-b border-muted/20">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className={`w-5 h-5 ${errorCount > 0 ? 'text-yellow-500' : 'text-green-500'}`} />
                      Analysis Results
                    </CardTitle>
                    <Badge variant={errorCount > 0 ? "destructive" : "default"} className={errorCount === 0 ? "bg-green-600 hover:bg-green-700" : ""}>
                      {errorCount} {errorCount === 1 ? 'Mistake' : 'Mistakes'} Found
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {errorCount > 0 ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-md bg-muted/50 text-base leading-relaxed border border-muted/20">
                        {getHighlightedText(inputText, errors)}
                      </div>
                      {errors.map((error, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-card text-sm border-yellow-200/50 dark:border-yellow-900/50">
                          <p className="font-semibold text-yellow-600 dark:text-yellow-400">{error.message}</p>
                          <p className="text-muted-foreground mt-1">
                            <span className="line-through text-red-500/80">
                              {error.context.text.substring(error.context.offset, error.context.offset + error.context.length)}
                            </span>
                            {' → '}
                            <span className="text-green-600 dark:text-green-400 font-medium">
                              {error.replacements.slice(0, 3).map(r => r.value).join(', ')}
                            </span>
                          </p>
                          <Badge variant="outline" className="mt-2 text-xs">{error.rule.category.name}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <SpellCheck className="w-12 h-12 mx-auto text-green-500" />
                      <p className="mt-4 text-lg font-semibold text-green-600">No Mistakes Found!</p>
                      <p className="text-muted-foreground mt-1">Your text looks great.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Info Panel */}
          <div className="flex flex-col">
            <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg h-full">
              <CardHeader className="border-b border-muted/20">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4 text-sm text-muted-foreground">
                <p>
                  This tool uses the <a href="https://languagetool.org/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">LanguageTool</a> API to find potential errors.
                </p>
                <p>
                  It can detect issues with spelling, grammar, punctuation, and style.
                </p>
                <p className="font-bold">Color Key:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li><span className="p-1 rounded-sm bg-yellow-100 dark:bg-yellow-900/40">Yellow</span> highlights indicate grammar or spelling mistakes.</li>
                  <li><span className="p-1 rounded-sm bg-blue-100 dark:bg-blue-900/40">Blue</span> highlights indicate typography or punctuation suggestions.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleGrammarCheck}
                disabled={isLoading || !inputText.trim()}
                className="flex-1 h-12 text-base bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    <span className="animate-pulse">Checking...</span>
                  </>
                ) : (
                  <>
                    <SpellCheck className="w-5 h-5 mr-2" />
                    Check Grammar
                  </>
                )}
              </Button>
              <Button
                onClick={handleClear}
                variant="outline"
                className="h-12 px-6 bg-transparent"
                disabled={!inputText && !hasChecked}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}