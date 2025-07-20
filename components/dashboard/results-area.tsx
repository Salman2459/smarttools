import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from "lucide-react"

export function ResultsArea() {
  return (
    <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
      <CardHeader className="border-b border-muted/20">
        <CardTitle className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
            <Download className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          Results
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-center py-12 border-2 border-dashed border-muted/30 rounded-xl bg-gradient-to-br from-muted/20 to-muted/10">
          <Download className="w-12 h-12 mx-auto text-muted-foreground mb-4 animate-pulse-slow" />
          <p className="text-muted-foreground font-medium">Processed files will appear here for download</p>
          <p className="text-xs text-muted-foreground mt-2">
            Files are automatically deleted after 24 hours for your privacy
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
