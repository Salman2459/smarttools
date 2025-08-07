"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardTitleMain } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Zap, Download, Loader2, Settings, Copy, RotateCcw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export function AiHumanizerTool() {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [humanizationLevel, setHumanizationLevel] = useState([70])
  const [writingStyle, setWritingStyle] = useState("natural")
  const [tone, setTone] = useState("neutral")

  const handleProcess = async () => {
    setIsProcessing(true);
    setOutputText(""); // Clear previous output

    try {
      const response = await fetch('/api/humanize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputText,
          humanizationLevel: humanizationLevel[0],
          writingStyle,
          tone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An unknown error occurred.");
      }

      const data = await response.json();
      setOutputText(data.humanizedText);

    } catch (error) {
      console.error("Failed to humanize text:", error);
      alert(`An error occurred: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };


  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText)
    alert("Text copied to clipboard!")
  }

  const clearAll = () => {
    setInputText("")
    setOutputText("")
  }

  const getHumanizationLevel = () => {
    if (humanizationLevel[0] >= 80) return "Maximum"
    if (humanizationLevel[0] >= 60) return "High"
    if (humanizationLevel[0] >= 40) return "Medium"
    return "Light"
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Tool Header */}
      <Card className="border-0 bg-gradient-to-br from-orange-50/50 to-orange-100/30 dark:from-orange-950/20 dark:to-orange-900/10 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center shadow-lg border border-orange-200/50 dark:border-orange-800/50">
              <Zap className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2 mb-2">
                <CardTitleMain className="text-2xl bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                  AI Text Humanizer
                </CardTitleMain>
                <Badge
                  variant="outline"
                  className="bg-orange-50 dark:bg-orange-950/50 border-orange-200 dark:border-orange-800"
                >
                  AI Tools
                </Badge>
              </div>
              <CardDescription className="text-base">
                Transform AI-generated text into natural, human-like content
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
            <CardHeader className="border-b border-muted/20">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="w-5 h-5 text-orange-600" />
                Humanization Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Level: {humanizationLevel[0]}%</Label>
                  <Badge variant="outline" className="text-xs">
                    {getHumanizationLevel()}
                  </Badge>
                </div>
                <Slider
                  value={humanizationLevel}
                  onValueChange={setHumanizationLevel}
                  max={100}
                  min={20}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Subtle</span>
                  <span>Maximum</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Writing Style</Label>
                <Select value={writingStyle} onValueChange={setWritingStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="natural">Natural</SelectItem>
                    <SelectItem value="conversational">Conversational</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Input and Output */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input */}
            <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
              <CardHeader className="border-b border-muted/20">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-600" />
                  AI-Generated Text
                </CardTitle>
                <CardDescription>Paste your AI-generated text here</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Textarea
                    placeholder="Enter the AI-generated text you want to humanize..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="min-h-[300px] resize-none border-orange-200 dark:border-orange-800/50 focus:border-orange-400 dark:focus:border-orange-600"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{inputText.length} characters</span>
                    <span>Maximum: 10,000 characters</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Output */}
            <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
              <CardHeader className="border-b border-muted/20">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Download className="w-5 h-5 text-green-600" />
                  Humanized Text
                </CardTitle>
                <CardDescription>Your humanized text will appear here</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Textarea
                    placeholder="Humanized text will appear here after processing..."
                    value={outputText}
                    readOnly
                    className="min-h-[300px] resize-none bg-muted/30 border-green-200 dark:border-green-800/50"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">{outputText.length} characters</span>
                    {outputText && (
                      <Button onClick={copyToClipboard} variant="outline" size="sm" className="text-xs bg-transparent">
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleProcess}
                  disabled={isProcessing || !inputText.trim()}
                  className="flex-1 h-12 text-base bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      <span className="animate-pulse">Humanizing text...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Humanize Text
                    </>
                  )}
                </Button>
                <Button
                  onClick={clearAll}
                  variant="outline"
                  className="h-12 px-6 bg-transparent"
                  disabled={!inputText && !outputText}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}