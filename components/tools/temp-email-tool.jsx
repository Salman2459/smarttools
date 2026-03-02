"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitleMain } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Copy, RefreshCw, Loader2, Inbox, Clock, Trash2 } from "lucide-react"
import { toolsData } from "@/lib/tools-data"

const STORAGE_KEY = "smarttools_temp_email"
const TTL_MS = 24 * 60 * 60 * 1000 // 24 hours
const DOMAINS = ["1secmail.com", "1secmail.org", "1secmail.net"]
const POLL_INTERVAL_MS = 25000

function getStored() {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function setStored(data) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

function isExpired(createdAt) {
  return Date.now() - (createdAt || 0) > TTL_MS
}

function filterEmailsWithin24h(emails) {
  const cut = Date.now() - TTL_MS
  return (emails || []).filter((e) => {
    const t = e.receivedAt || (typeof e.date === "string" ? new Date(e.date).getTime() : e.date) || 0
    return t > cut
  })
}

export function TempEmailTool({ toolId }) {
  const toolData = toolsData.find((t) => t.id === toolId)
  const [email, setEmail] = useState("")
  const [login, setLogin] = useState("")
  const [domain, setDomain] = useState(DOMAINS[0])
  const [createdAt, setCreatedAt] = useState(null)
  const [emails, setEmails] = useState([])
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const initOrRefresh = useCallback(async () => {
    const stored = getStored()
    if (stored && !isExpired(stored.createdAt)) {
      setEmail(stored.email)
      setLogin(stored.login)
      setDomain(stored.domain || DOMAINS[0])
      setCreatedAt(stored.createdAt)
      setEmails(filterEmailsWithin24h(stored.emails || []))
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/temp-email?action=genRandomMailbox")
      const logins = await res.json()
      const newLogin = Array.isArray(logins) && logins[0] ? logins[0] : `user${Date.now().toString(36)}`
      const newDomain = DOMAINS[Math.floor(Math.random() * DOMAINS.length)]
      const newEmail = `${newLogin}@${newDomain}`
      const now = Date.now()
      const data = {
        email: newEmail,
        login: newLogin,
        domain: newDomain,
        createdAt: now,
        emails: [],
      }
      setStored(data)
      setEmail(newEmail)
      setLogin(newLogin)
      setDomain(newDomain)
      setCreatedAt(now)
      setEmails([])
      setSelectedEmail(null)
    } catch (err) {
      const fallback = `temp${Date.now().toString(36)}@${DOMAINS[0]}`
      const now = Date.now()
      const data = {
        email: fallback,
        login: fallback.split("@")[0],
        domain: DOMAINS[0],
        createdAt: now,
        emails: [],
      }
      setStored(data)
      setEmail(fallback)
      setLogin(data.login)
      setDomain(data.domain)
      setCreatedAt(now)
      setEmails([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    initOrRefresh()
  }, [initOrRefresh])

  const fetchMessages = useCallback(async () => {
    if (!login || !domain) return
    try {
      const res = await fetch(
        `/api/temp-email?action=getMessages&login=${encodeURIComponent(login)}&domain=${encodeURIComponent(domain)}`
      )
      const list = await res.json()
      if (!Array.isArray(list)) return
      const stored = getStored()
      const existing = (stored?.emails || []).filter((e) => e.id)
      const existingIds = new Set(existing.map((e) => String(e.id)))
      const newOnes = list.filter((m) => !existingIds.has(String(m.id)))
      for (const m of newOnes) {
        try {
          const r = await fetch(
            `/api/temp-email?action=readMessage&login=${encodeURIComponent(login)}&domain=${encodeURIComponent(domain)}&id=${m.id}`
          )
          const full = await r.json()
          existing.push({
            id: m.id,
            from: full.from || m.from || "",
            subject: full.subject || m.subject || "(No subject)",
            date: full.date || m.date || "",
            body: full.body || full.textBody || "",
            receivedAt: Date.now(),
          })
        } catch {}
      }
      const filtered = filterEmailsWithin24h(existing)
      const next = {
        ...stored,
        email: stored?.email,
        login: stored?.login,
        domain: stored?.domain,
        createdAt: stored?.createdAt,
        emails: filtered,
      }
      setStored(next)
      setEmails(filtered)
    } catch {}
  }, [login, domain])

  useEffect(() => {
    if (!login || !domain) return
    fetchMessages()
    const t = setInterval(fetchMessages, POLL_INTERVAL_MS)
    return () => clearInterval(t)
  }, [login, domain, fetchMessages])

  const handleCopy = () => {
    if (!email) return
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleRefresh = () => {
    setStored(null)
    initOrRefresh()
  }

  const expiresIn = createdAt
    ? Math.max(0, Math.floor((createdAt + TTL_MS - Date.now()) / 60000))
    : 0

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="border-0 bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 dark:from-emerald-950/20 dark:to-emerald-900/10 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-xl bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center shadow-lg border border-emerald-200/50 dark:border-emerald-800/50">
              <Mail className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2 mb-2">
                <CardTitleMain className="text-2xl bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-emerald-300 dark:to-emerald-100 bg-clip-text text-transparent">
                  Temp Email
                </CardTitleMain>
                <Badge variant="outline" className="bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800">
                  Other Tools
                </Badge>
              </div>
              <CardDescription className="text-base text-muted-foreground">
                Disposable email for 24 hours. Data saved in this browser; after 24h you get a new address.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="border border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-foreground">Your temporary email</h2>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className="gap-1.5"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                New address
              </Button>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Expires in {expiresIn} min
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <input
              readOnly
              value={email}
              className="flex-1 h-10 rounded-lg border border-border bg-muted/30 dark:bg-muted/20 px-3 text-sm font-mono text-foreground"
              aria-label="Temporary email address"
            />
            <Button type="button" variant="secondary" size="icon" onClick={handleCopy} className="shrink-0">
              {copied ? (
                <span className="text-xs text-emerald-600">Copied!</span>
            ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Emails and this address are stored in this device for 24 hours. After 24h, a new address is assigned when you return.
          </p>
        </CardContent>
      </Card>

      <Card className="border border-border bg-card overflow-hidden">
        <CardHeader className="py-4 border-b border-border flex flex-row items-center justify-between">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Inbox className="w-5 h-5 text-muted-foreground" />
            Inbox
            {emails.length > 0 && (
              <Badge variant="secondary" className="ml-1">{emails.length}</Badge>
            )}
          </h3>
          <Button variant="ghost" size="sm" onClick={fetchMessages} disabled={!login}>
            Refresh
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[420px] overflow-y-auto divide-y divide-border">
            {emails.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No emails yet. Share your temp address to receive mail here. Messages are saved in this browser for 24 hours.
              </div>
            ) : (
              emails.map((msg) => (
                <button
                  key={msg.id}
                  type="button"
                  className="w-full text-left p-4 hover:bg-muted/50 dark:hover:bg-muted/20 transition-colors"
                  onClick={() => setSelectedEmail(selectedEmail?.id === msg.id ? null : msg)}
                >
                  <div className="flex justify-between gap-2">
                    <span className="font-medium text-foreground truncate">{msg.subject}</span>
                    <span className="text-xs text-muted-foreground shrink-0">{msg.from}</span>
                  </div>
                  {msg.date && (
                    <span className="text-xs text-muted-foreground">{msg.date}</span>
                  )}
                </button>
              ))
            )}
          </div>
          {selectedEmail && (
            <div className="border-t border-border p-4 bg-muted/20 max-h-64 overflow-y-auto">
              <div className="flex justify-between gap-2 mb-2">
                <strong className="text-sm text-foreground">{selectedEmail.subject}</strong>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setSelectedEmail(null)}
                  aria-label="Close"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mb-2">From: {selectedEmail.from}</p>
              <p className="text-xs text-muted-foreground mb-2">Date: {selectedEmail.date}</p>
              <div className="text-sm text-foreground whitespace-pre-wrap break-words">
                {selectedEmail.body || "(No body)"}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
