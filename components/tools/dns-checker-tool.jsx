"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitleMain } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Search, Settings2, Globe, CheckCircle2, XCircle,
    Loader2, Info, ChevronRight, MapPin, ExternalLink
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"

// 27 locations like dnschecker.org – each maps to a DoH resolver for reliable lookups
const DNS_NODES = [
    { id: 'us-sfo', location: 'San Francisco CA, United States', provider: 'OpenDNS', country: 'us', coords: [37.7749, -122.4194], resolver: 'opendns' },
    { id: 'us-mtv', location: 'Mountain View CA, United States', provider: 'Google', country: 'us', coords: [37.3861, -122.0839], resolver: 'google' },
    { id: 'us-berk', location: 'Berkeley, US', provider: 'Quad9', country: 'us', coords: [37.8715, -122.2730], resolver: 'quad9' },
    { id: 'us-sfo-q', location: 'San Francisco, US', provider: 'Quad9', country: 'us', coords: [37.7749, -122.4194], resolver: 'quad9' },
    { id: 'us-cl', location: 'United States', provider: 'CenturyLink', country: 'us', coords: [39.0, -98.0], resolver: 'cleanbrowsing' },
    { id: 'us-col', location: 'Columbia, United States', provider: 'Daniel Cid', country: 'us', coords: [34.0007, -81.0348], resolver: 'cloudflare' },
    { id: 'us-alph', location: 'Alpharetta, United States', provider: 'ZCORUM', country: 'us', coords: [34.0754, -84.2941], resolver: 'nextdns' },
    { id: 'ca-burn', location: 'Burnaby, Canada', provider: 'Fortinet Inc', country: 'ca', coords: [49.2488, -122.9805], resolver: 'adguard' },
    { id: 'ru-spb', location: 'St Petersburg, Russia', provider: 'YANDEX LLC', country: 'ru', coords: [59.9311, 30.3609], resolver: 'yandex' },
    { id: 'za-cull', location: 'Cullinan, South Africa', provider: 'Liquid Telecommunications Ltd', country: 'za', coords: [-25.6694, 28.5230], resolver: 'adguard' },
    { id: 'nl-ams', location: 'Amsterdam, Netherlands', provider: 'OpenTLD BV', country: 'nl', coords: [52.3676, 4.9041], resolver: 'opendns' },
    { id: 'fr-lille', location: 'Lille, France', provider: 'Completel SAS', country: 'fr', coords: [50.6292, 3.0573], resolver: 'adguard' },
    { id: 'es-pat', location: 'Paterna de Rivera, Spain', provider: 'ServiHosting Networks S.L.', country: 'es', coords: [36.5222, -5.8679], resolver: 'adguard' },
    { id: 'at-inn', location: 'Innsbruck, Austria', provider: 'nemox.net', country: 'at', coords: [47.2692, 11.4041], resolver: 'level3' },
    { id: 'gb-salf', location: 'Salford, United Kingdom', provider: 'Wavenet Limited', country: 'gb', coords: [53.4875, -2.2901], resolver: 'adguard' },
    { id: 'de-leip', location: 'Leipzig, Germany', provider: 'Universitaet Leipzig', country: 'de', coords: [51.3397, 12.3731], resolver: 'level3' },
    { id: 'mx-mex', location: 'Mexico City, Mexico', provider: 'Universidad LatinoAmericana S.C.', country: 'mx', coords: [19.4326, -99.1332], resolver: 'controlli' },
    { id: 'br-scs', location: 'Santa Cruz do Sul, Brazil', provider: 'Claro S.A', country: 'br', coords: [-29.715, -52.428], resolver: 'controlli' },
    { id: 'au-res', location: 'Research, Australia', provider: 'Cloudflare Inc', country: 'au', coords: [-37.7003, 145.1878], resolver: 'cloudflare' },
    { id: 'au-mel', location: 'Melbourne, Australia', provider: 'Pacific Internet', country: 'au', coords: [-37.8136, 144.9631], resolver: 'nextdns' },
    { id: 'sg-sing', location: 'Singapore', provider: 'DigitalOcean LLC', country: 'sg', coords: [1.3521, 103.8198], resolver: 'cloudflare' },
    { id: 'kr-seo', location: 'Seoul, South Korea', provider: 'SK Telecom', country: 'kr', coords: [37.5665, 126.9780], resolver: 'alibaba' },
    { id: 'cn-hang', location: 'Hangzhou, China', provider: 'Aliyun Computing Co. Ltd', country: 'cn', coords: [30.2741, 120.1551], resolver: 'alibaba' },
    { id: 'tr-ant', location: 'Antalya, Turkey', provider: 'Teknet Yazlim', country: 'tr', coords: [36.8969, 30.7133], resolver: 'quad9' },
    { id: 'in-coi', location: 'Coimbatore, India', provider: 'Skylink Fibernet Private Limited', country: 'in', coords: [11.0168, 76.9558], resolver: 'nextdns' },
    { id: 'pk-isl', location: 'Islamabad, Pakistan', provider: 'CMPak Limited', country: 'pk', coords: [33.6844, 73.0479], resolver: 'cloudflare' },
    { id: 'ie-dub', location: 'Dublin, Ireland', provider: 'Indigo', country: 'ie', coords: [53.3498, -6.2603], resolver: 'mullvad' },
]

const DNS_TYPES = ['A', 'AAAA', 'MX', 'CNAME', 'TXT', 'NS', 'SOA', 'PTR']

function MapPinIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" stroke="none">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
    )
}

// Equirectangular world map: pin position (lng, lat) -> left % and top %
function coordsToPercent(lng, lat) {
    const left = ((lng + 180) / 360) * 100
    const top = ((90 - lat) / 180) * 100
    return { left, top }
}

function WorldMap({ markers }) {
    return (
        <div className="relative w-full aspect-[2/1] bg-muted/50 dark:bg-muted/20 rounded-xl overflow-hidden border border-border">
            {/* Real world map (equirectangular) - pins use same projection */}
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/83/Equirectangular_projection_SW.jpg"
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-40 dark:opacity-30"
                draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/20 to-transparent pointer-events-none" aria-hidden />

            <AnimatePresence>
                {markers && Object.entries(markers).map(([id, result]) => {
                    const node = DNS_NODES.find(n => n.id === id)
                    if (!node) return null
                    const [lat, lng] = node.coords
                    const { left, top } = coordsToPercent(lng, lat)

                    return (
                        <motion.div
                            key={id}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute w-5 h-5 -ml-2.5 -mt-5 z-20 group"
                            style={{ left: `${left}%`, top: `${top}%` }}
                        >
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-1 bg-black/20 rounded-full blur-[1px]" />
                            <div className="relative flex flex-col items-center">
                                <MapPinIcon
                                    className={`w-5 h-5 ${result.status === 'success'
                                        ? 'text-emerald-500 dark:text-emerald-400'
                                        : result.status === 'error'
                                            ? 'text-destructive'
                                            : 'text-muted-foreground'
                                        }`}
                                />
                                {result.status === 'success' && (
                                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-background rounded-full border-2 border-emerald-500 dark:border-emerald-400 flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full" />
                                    </div>
                                )}
                            </div>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block transition-all z-30 pointer-events-none">
                                <div className="bg-popover text-popover-foreground px-3 py-1.5 rounded-lg shadow-xl border border-border whitespace-nowrap text-[10px] font-medium">
                                    <div>{node.location}</div>
                                    <div className="text-muted-foreground">{node.provider}</div>
                                </div>
                                <div className="w-2 h-2 bg-popover border-r border-b border-border rotate-45 mx-auto -mt-1" />
                            </div>
                        </motion.div>
                    )
                })}
            </AnimatePresence>

            <div className="absolute bottom-4 left-6 flex flex-wrap gap-4 text-[10px] font-medium text-muted-foreground bg-background/90 dark:bg-background/80 backdrop-blur-md px-4 py-2 rounded-xl border border-border">
                <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" /> Server Location
                </div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                </div>
                <div className="flex items-center gap-2 text-destructive">
                    <XCircle className="w-3.5 h-3.5" /> Not Resolved
                </div>
            </div>
        </div>
    )
}

export function DnsCheckerTool() {
    const [domain, setDomain] = useState("")
    const [recordType, setRecordType] = useState("A")
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState({})
    const [cdFlag, setCdFlag] = useState(true)
    const [refresh, setRefresh] = useState(120)
    const [isAutoRefresh, setIsAutoRefresh] = useState(false)
    const [searchError, setSearchError] = useState(null)
    const [showFailed, setShowFailed] = useState(false)

    const cleanDomainInput = (input) => {
        if (!input || typeof input !== 'string') return ''
        let cleaned = input.trim().toLowerCase()
        cleaned = cleaned.replace(/^(https?|ftp):\/\//, '')
        cleaned = cleaned.replace(/^www\./, '')
        cleaned = cleaned.split('/')[0]
        cleaned = cleaned.split('?')[0]
        cleaned = cleaned.split(':')[0]
        return cleaned
    }

    const handleSearch = useCallback(async (e) => {
        if (e) e.preventDefault()
        const cleanedDomain = cleanDomainInput(domain)
        if (!cleanedDomain) {
            setSearchError('Enter a domain or hostname (e.g. example.com)')
            return
        }

        setSearchError(null)
        setLoading(true)
        const initialResults = {}
        DNS_NODES.forEach(node => {
            initialResults[node.id] = { status: 'pending', data: null, errorMessage: null }
        })
        setResults(initialResults)

        const uniqueResolvers = [...new Set(DNS_NODES.map(n => n.resolver))]
        const resultByResolver = {}

        const settled = await Promise.allSettled(
            uniqueResolvers.map(async (resolverId) => {
                const url = `/api/dns-lookup?name=${encodeURIComponent(cleanedDomain)}&type=${recordType}&resolver=${encodeURIComponent(resolverId)}`
                let res
                try {
                    res = await fetch(url)
                } catch (err) {
                    return { resolverId, status: 'error', data: null, errorMessage: 'Network error' }
                }
                let data
                try {
                    data = await res.json()
                } catch {
                    return { resolverId, status: 'error', data: null, errorMessage: 'Invalid response' }
                }

                const hasAnswer = Array.isArray(data.Answer) && data.Answer.length > 0
                const success = res.ok && data.Status === 0 && hasAnswer

                if (success) {
                    const displayData = data.Answer.map(a => a.data).filter(Boolean).join(', ')
                    return { resolverId, status: 'success', data: displayData, errorMessage: null }
                }
                const errorMessage = data.Comment || data.Message || (hasAnswer ? null : 'No record') || 'Lookup failed'
                return { resolverId, status: 'error', data: null, errorMessage }
            })
        )

        settled.forEach((outcome) => {
            if (outcome.status === 'fulfilled' && outcome.value) {
                const { resolverId, status, data, errorMessage } = outcome.value
                resultByResolver[resolverId] = { status, data, errorMessage }
            }
        })

        const nextResults = {}
        DNS_NODES.forEach(node => {
            const r = resultByResolver[node.resolver]
            nextResults[node.id] = r
                ? { status: r.status, data: r.data, errorMessage: r.errorMessage }
                : { status: 'pending', data: null, errorMessage: null }
        })
        setResults(nextResults)
        setLoading(false)
        setIsAutoRefresh(true)
    }, [domain, recordType])

    useEffect(() => {
        let timer
        if (isAutoRefresh && !loading && domain) {
            timer = setTimeout(() => handleSearch(), refresh * 1000)
        }
        return () => clearTimeout(timer)
    }, [isAutoRefresh, loading, refresh, domain, handleSearch])

    const hasSearched = Object.keys(results).length > 0
    const successCount = Object.values(results).filter(r => r?.status === 'success').length
    const totalCount = DNS_NODES.length

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Tool header */}
            <Card className="border-0 bg-gradient-to-br from-slate-50/50 to-slate-100/30 dark:from-slate-950/20 dark:to-slate-900/10 shadow-lg">
                <CardHeader className="text-center">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-900/20 flex items-center justify-center shadow-lg border border-slate-200/50 dark:border-slate-800/50">
                            <Globe className="w-8 h-8 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div className="text-left">
                            <div className="flex items-center gap-2 mb-2">
                                <CardTitleMain className="text-2xl bg-gradient-to-r from-slate-600 to-slate-800 dark:from-slate-300 dark:to-slate-100 bg-clip-text text-transparent">
                                    DNS Checker
                                </CardTitleMain>
                                <Badge variant="outline" className="bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800">
                                    Network
                                </Badge>
                            </div>
                            <CardDescription className="text-base text-muted-foreground">
                                Check DNS propagation and resolve records from multiple global servers.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: controls & server list — wider column for more space */}
                <div className="lg:col-span-5 space-y-4">
                    <Card className="border border-border bg-card">
                        <CardHeader className="pb-3">
                            <h2 className="text-lg font-semibold text-foreground">DNS Check</h2>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <form onSubmit={handleSearch} className="space-y-3">
                                <div className="space-y-1.5">
                                    <label htmlFor="dns-domain-input" className="text-xs font-medium text-muted-foreground">
                                        Domain or IP address
                                    </label>
                                    <Input
                                        id="dns-domain-input"
                                        placeholder="Enter domain or IP (e.g. example.com or 8.8.8.8)"
                                        value={domain}
                                        onChange={(e) => { setDomain(e.target.value); setSearchError(null) }}
                                        className="flex-1 h-10 bg-muted/50 dark:bg-muted/20 border-border focus-visible:ring-ring rounded-lg"
                                        aria-label="Domain or IP address"
                                    />
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <Select value={recordType} onValueChange={setRecordType}>
                                            <SelectTrigger className="w-full sm:w-24 h-10 border-border rounded-lg">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {DNS_TYPES.map(t => (
                                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="h-10 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                                        >
                                            {loading ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Search className="w-4 h-4" />
                                            )}
                                            <span className="ml-2 hidden sm:inline">Search</span>
                                        </Button>
                                    </div>
                                    {searchError && (
                                        <p className="text-sm text-destructive" role="alert">{searchError}</p>
                                    )}
                                </div>
                            </form>

                            <div className="flex items-center justify-between border-t border-border pt-4">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="cd-flag"
                                        checked={cdFlag}
                                        onCheckedChange={setCdFlag}
                                        className="border-slate-300 dark:border-slate-600"
                                    />
                                    <label htmlFor="cd-flag" className="text-xs font-medium text-muted-foreground uppercase tracking-tight cursor-pointer">
                                        CD Flag
                                    </label>
                                </div>
                                <div className="flex items-center gap-1.5 bg-muted/50 dark:bg-muted/20 px-2 py-1 rounded-lg border border-border">
                                    <span className="text-[10px] font-medium text-muted-foreground uppercase">Refresh:</span>
                                    <Input
                                        type="number"
                                        min={5}
                                        max={120}
                                        value={refresh}
                                        onChange={(e) => setRefresh(Math.max(5, Math.min(120, parseInt(e.target.value, 10) || 20)))}
                                        className="w-12 h-6 p-1 text-center text-xs border-border bg-background rounded"
                                    />
                                    <span className="text-[10px] font-medium text-muted-foreground uppercase">sec</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Show failed checkbox — only relevant after a search */}
                    {Object.keys(results).length > 0 && (
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="show-failed"
                                checked={showFailed}
                                onCheckedChange={(checked) => setShowFailed(!!checked)}
                                className="border-slate-300 dark:border-slate-600"
                            />
                            <label htmlFor="show-failed" className="text-sm font-medium text-muted-foreground cursor-pointer">
                                Show failed lookups
                            </label>
                        </div>
                    )}

                    <Card className="border border-border bg-card overflow-hidden w-full">
                        <div className="max-h-[70vh] overflow-y-auto overflow-x-hidden custom-scrollbar divide-y divide-border">
                            {(Object.keys(results).length === 0 ? DNS_NODES : DNS_NODES.filter(node => {
                                const status = results[node.id]?.status
                                return status === 'success' || status === 'pending' || (showFailed && status === 'error')
                            })).map(node => {
                                const valueStr = results[node.id]?.status === 'success' ? results[node.id].data : null
                                const values = valueStr ? valueStr.split(/\s*,\s*/).filter(Boolean) : []
                                return (
                                    <div
                                        key={node.id}
                                        className="grid grid-cols-[auto_1fr_auto] gap-x-2 px-2.5 py-2 group hover:bg-muted/30 dark:hover:bg-muted/20 transition-colors border-l-4 border-transparent hover:border-primary/50 w-full overflow-hidden"
                                    >
                                        {/* Col 1: Flag */}
                                        <div className="flex items-start pt-0.5 flex-shrink-0">
                                            <div className="rounded overflow-hidden w-5 h-3.5 border border-border">
                                                <img
                                                    src={`https://flagcdn.com/w40/${node.country}.png`}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>

                                        {/* Col 2: Location + Provider + Values */}
                                        <div className="min-w-0 overflow-hidden">
                                            <div className="text-[11px] font-medium text-foreground leading-tight truncate group-hover:text-primary" title={node.location}>
                                                {node.location}
                                            </div>
                                            <div className="flex items-center gap-0.5 mt-0.5">
                                                <span className="text-[9px] text-muted-foreground truncate" title={node.provider}>
                                                    {node.provider}
                                                </span>
                                                <Info className="w-2.5 h-2.5 text-muted-foreground/60 flex-shrink-0" aria-hidden />
                                            </div>
                                            <div className="mt-1 rounded bg-muted/30 dark:bg-muted/20 px-1.5 py-1 overflow-hidden">
                                                {results[node.id]?.status === 'success' ? (
                                                    <div className="flex flex-col gap-0.5">
                                                        {values.map((val, i) => (
                                                            <div key={i} className="flex items-center gap-1 min-w-0">
                                                                <span className="text-[10px] font-mono text-primary truncate" title={val}>
                                                                    {val}
                                                                </span>
                                                                <ExternalLink className="w-2.5 h-2.5 text-muted-foreground flex-shrink-0" aria-hidden />
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : results[node.id]?.status === 'error' ? (
                                                    <span className="text-[10px] text-muted-foreground" title={results[node.id].errorMessage}>—</span>
                                                ) : (
                                                    <span className="text-[10px] text-muted-foreground/50 font-mono">—</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Col 3: Status dot */}
                                        <div className="flex items-start justify-center pt-0.5 flex-shrink-0">
                                            {results[node.id]?.status === 'success' ? (
                                                <div className="w-4 h-4 rounded-full border-2 border-emerald-500 dark:border-emerald-400 flex items-center justify-center bg-background">
                                                    <div className="w-1.5 h-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full" />
                                                </div>
                                            ) : results[node.id]?.status === 'error' ? (
                                                <div className="w-4 h-4 rounded-full border-2 border-destructive flex items-center justify-center bg-background">
                                                    <div className="w-1.5 h-1.5 bg-destructive rounded-full" />
                                                </div>
                                            ) : (
                                                <div className="w-4 h-4 rounded-full border-2 border-muted flex items-center justify-center bg-background">
                                                    <ChevronRight className="w-2.5 h-2.5 text-muted-foreground/50" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </Card>
                </div>

                {/* Right: description & map */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="space-y-3">
                        <h2 className="text-xl font-bold text-foreground">Check DNS propagation</h2>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-3xl">
                            After changing DNS records, switching hosts, or launching a new site, verify that records have propagated.
                            This tool queries {totalCount} DNS servers worldwide and shows the resolved {recordType} record (or “no record”) per location.
                        </p>
                        {hasSearched && (
                            <p className="text-sm text-muted-foreground">
                                {successCount} of {totalCount} servers returned a result for <strong className="text-foreground">{domain || '—'}</strong> ({recordType}).
                            </p>
                        )}
                    </div>

                    <Card className="border border-border bg-card overflow-hidden">
                        <CardHeader className="py-4 border-b border-border">
                            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide">Propagation map</h3>
                        </CardHeader>
                        <CardContent className="p-6">
                            <WorldMap markers={results} />
                        </CardContent>
                    </Card>

                    <Card className="border border-border bg-primary/10 dark:bg-primary/5 overflow-hidden">
                        <CardContent className="p-6 flex items-center gap-6 relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Globe className="w-24 h-24 text-primary" />
                            </div>
                            <div className="relative z-10">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80 mb-1">Global verification</p>
                                <h4 className="text-lg font-bold text-foreground">Monitor changes worldwide</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Results are from independent DNS resolvers; use this to confirm propagation after DNS changes.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: hsl(var(--muted)); }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: hsl(var(--muted-foreground) / 0.3); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: hsl(var(--muted-foreground) / 0.5); }
                .custom-scrollbar-horizontal { -webkit-overflow-scrolling: touch; }
                .custom-scrollbar-horizontal::-webkit-scrollbar { height: 4px; }
                .custom-scrollbar-horizontal::-webkit-scrollbar-track { background: hsl(var(--muted)); border-radius: 4px; }
                .custom-scrollbar-horizontal::-webkit-scrollbar-thumb { background: hsl(var(--muted-foreground) / 0.35); border-radius: 4px; }
                .custom-scrollbar-horizontal::-webkit-scrollbar-thumb:hover { background: hsl(var(--muted-foreground) / 0.5); }
            `}</style>
        </div>
    )
}
