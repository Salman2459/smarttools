"use client"

import { useState, useEffect } from "react" // Import useEffect
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardTitleMain } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Volume2, Play, Pause, Download, Loader2, Settings, RotateCcw, VolumeX } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import Head from "next/head"
import { toolsData } from "@/lib/tools-data"

export function TextToSpeechTool({ toolId }) {
  const [inputText, setInputText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)
  const [voice, setVoice] = useState("default")
  const [rate, setRate] = useState([1])
  const [pitch, setPitch] = useState([1])
  const [volume, setVolume] = useState([0.8])
  const [currentUtterance, setCurrentUtterance] = useState(null)
  const [availableVoices, setAvailableVoices] = useState([])
  const toolData = toolsData.find((tool) => tool.id === toolId)

  // Move voice loading into useEffect to ensure it runs only on the client
  useEffect(() => {
    const loadVoices = () => {
      if ("speechSynthesis" in window) {
        const voices = window.speechSynthesis.getVoices()
        setAvailableVoices(voices)
        // Fallback for browsers that load voices asynchronously
        window.speechSynthesis.onvoiceschanged = () => {
          setAvailableVoices(window.speechSynthesis.getVoices())
        }
      }
    }
    loadVoices()
  }, [])


  const handleProcess = async () => {
    if (!inputText.trim()) return

    // Ensure this runs only on the client
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsProcessing(true)

      const utterance = new SpeechSynthesisUtterance(inputText)
      utterance.rate = rate[0]
      utterance.pitch = pitch[0]
      utterance.volume = volume[0]

      const voices = window.speechSynthesis.getVoices()
      if (voices.length > 0 && voice !== "default") {
        const selectedVoice = voices.find((v) => v.name === voice)
        if (selectedVoice) {
          utterance.voice = selectedVoice
        }
      }

      setCurrentUtterance(utterance)

      // The download functionality is also client-side
      const blob = new Blob([inputText], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      setAudioUrl(url)

      setIsProcessing(false)
    } else {
      // Handle the case where speech synthesis is not supported
      if (typeof window !== "undefined") {
        alert("Speech synthesis is not supported in your browser")
      }
      setIsProcessing(false)
    }
  }


  const handlePlay = () => {
    if (currentUtterance && "speechSynthesis" in window) {
      if (isPlaying) {
        window.speechSynthesis.pause()
        setIsPlaying(false)
      } else {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume()
        } else {
          window.speechSynthesis.speak(currentUtterance)
        }
        setIsPlaying(true)

        currentUtterance.onend = () => {
          setIsPlaying(false)
        }
      }
    }
  }

  const handleStop = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
    }
  }

  const handleDownload = () => {
    if (audioUrl) {
      const link = document.createElement("a")
      link.href = audioUrl
      link.download = "speech-text.txt"
      document.body.appendChild(link) // Required for Firefox
      link.click()
      document.body.removeChild(link) // Clean up
    }
  }

  const handleClear = () => {
    setInputText("")
    setAudioUrl(null)
    setCurrentUtterance(null)
    setIsPlaying(false)
    setVoice("default")
    setRate([1])
    setPitch([1])
    setVolume([0.8])

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }
  }

  // No longer need the second useState for voices

  return (

    <>
      <Head>
        <meta name="description" content={toolData.metaDescription} />
      </Head>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Tool Header */}
        <Card className="border-0 bg-gradient-to-br from-pink-50/50 to-pink-100/30 dark:from-pink-950/20 dark:to-pink-900/10 shadow-lg">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-pink-100 dark:bg-pink-900/20 flex items-center justify-center shadow-lg border border-pink-200/50 dark:border-pink-800/50">
                <Volume2 className="w-8 h-8 text-pink-600 dark:text-pink-400" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitleMain className="text-2xl bg-gradient-to-r from-pink-600 to-pink-800 bg-clip-text text-transparent">
                    Text to Speech
                  </CardTitleMain>
                  <Badge
                    variant="outline"
                    className="bg-pink-50 dark:bg-pink-950/50 border-pink-200 dark:border-pink-800"
                  >
                    Text Tools
                  </Badge>
                </div>
                <CardDescription className="text-base">
                  Convert text to natural-sounding speech with customizable voice settings
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Input Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
              <CardHeader className="border-b border-muted/20">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-pink-600" />
                  Text Input
                </CardTitle>
                <CardDescription>Enter the text you want to convert to speech</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Textarea
                    placeholder="Enter your text here..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="min-h-[200px] resize-none border-pink-200 dark:border-pink-800/50 focus:border-pink-400 dark:focus:border-pink-600"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{inputText.length} characters</span>
                    <span>Maximum: 5,000 characters</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Audio Controls */}
            {currentUtterance && (
              <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
                <CardHeader className="border-b border-muted/20">
                  <CardTitle className="flex items-center gap-2">
                    <Play className="w-5 h-5 text-green-600" />
                    Audio Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      onClick={handlePlay}
                      className={`h-12 px-6 ${isPlaying ? "bg-orange-600 hover:bg-orange-700" : "bg-green-600 hover:bg-green-700"}`}
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-5 h-5 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5 mr-2" />
                          Play
                        </>
                      )}
                    </Button>
                    <Button onClick={handleStop} variant="outline" className="h-12 px-6 bg-transparent">
                      <VolumeX className="w-5 h-5 mr-2" />
                      Stop
                    </Button>
                    <Button onClick={handleDownload} variant="outline" className="h-12 px-6 bg-transparent">
                      <Download className="w-5 h-5 mr-2" />
                      Download Text
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Settings Panel */}
          <div className="space-y-6">
            <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
              <CardHeader className="border-b border-muted/20">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5 text-pink-600" />
                  Voice Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Voice</Label>
                  <Select value={voice} onValueChange={setVoice}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default Voice</SelectItem>
                      {availableVoices.map((voice, index) => (
                        <SelectItem key={index} value={voice.name}>
                          {voice.name} ({voice.lang})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Speech Rate: {rate[0]}x</Label>
                  <Slider value={rate} onValueChange={setRate} max={2} min={0.1} step={0.1} className="w-full" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Slow</span>
                    <span>Fast</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Pitch: {pitch[0]}x</Label>
                  <Slider value={pitch} onValueChange={setPitch} max={2} min={0} step={0.1} className="w-full" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Volume: {Math.round(volume[0] * 100)}%</Label>
                  <Slider value={volume} onValueChange={setVolume} max={1} min={0} step={0.1} className="w-full" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Quiet</span>
                    <span>Loud</span>
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
                onClick={handleProcess}
                disabled={isProcessing || !inputText.trim()}
                className="flex-1 h-12 text-base bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    <span className="animate-pulse">Processing...</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-5 h-5 mr-2" />
                    Generate Speech
                  </>
                )}
              </Button>
              <Button
                onClick={handleClear}
                variant="outline"
                className="h-12 px-6 bg-transparent"
                disabled={!inputText && !currentUtterance}
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