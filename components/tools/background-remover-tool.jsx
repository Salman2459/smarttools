"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Upload, Download, Sparkles, Zap, Maximize2, Minimize2,
    RefreshCcw, Minus, Plus, X, AlertCircle, Move, Check,
    ChevronRight, Loader2
} from "lucide-react"

const BACKGROUNDS = [
    { id: 'transparent', name: 'None', preview: null },
    { id: 'white', name: 'White', color: '#FFFFFF' },
    { id: 'black', name: 'Black', color: '#000000' },
    { id: 'slate', name: 'Slate', color: '#1e293b' },
    { id: 'orange', name: 'Orange', gradient: ['#fb923c', '#f97316'] },
    { id: 'amber', name: 'Amber', gradient: ['#fcd34d', '#d97706'] },
    { id: 'sky', name: 'Ocean', gradient: ['#7dd3fc', '#0ea5e9'] },
    { id: 'emerald', name: 'Forest', gradient: ['#6ee7b7', '#059669'] },
    { id: 'custom-color', name: 'Custom', color: null },
]

const STOCK_BG = [
    { id: 'nature1', url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80' },
    { id: 'nature2', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80' },
    { id: 'city1', url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80' },
    { id: 'office', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80' },
    { id: 'abstract', url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80' },
]

function getPreviewStyle(bg, customColor, customBgImageUrl) {
    if (!bg) return {}
    if (bg.id === 'transparent') return {
        backgroundImage: 'linear-gradient(45deg,#e2e8f0 25%,transparent 25%),linear-gradient(-45deg,#e2e8f0 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#e2e8f0 75%),linear-gradient(-45deg,transparent 75%,#e2e8f0 75%)',
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0,0 10px,10px -10px,-10px 0',
        backgroundColor: '#fff',
    }
    if (bg.id === 'custom-color') return { backgroundColor: customColor }
    if (bg.id === 'custom-image' && customBgImageUrl) return { backgroundImage: `url(${customBgImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    if (bg.id?.startsWith('stock-')) {
        const s = STOCK_BG.find(s => `stock-${s.id}` === bg.id)
        if (s) return { backgroundImage: `url(${s.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    }
    if (bg.gradient) {
        return { background: `linear-gradient(135deg,${bg.gradient[0]},${bg.gradient[1]})` }
    }
    return { backgroundColor: bg.color || '#fff' }
}

export function BackgroundRemoverTool() {
    const [original, setOriginal] = useState(null)
    const [processed, setProcessed] = useState(null)
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [progressText, setProgressText] = useState('')
    const [error, setError] = useState('')
    const [isDrop, setIsDrop] = useState(false)
    const [activeBg, setActiveBg] = useState(BACKGROUNDS[0])
    const [customColor, setCustomColor] = useState('#6366f1')
    const [customBgImage, setCustomBgImage] = useState(null)
    const [imgPos, setImgPos] = useState({ x: 0, y: 0 })
    const [imgScale, setImgScale] = useState(1)
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [tab, setTab] = useState('colors') // 'colors' | 'photos'
    const fileInputRef = useRef(null)
    const bgFileInputRef = useRef(null)
    const processedBlobRef = useRef(null)

    const loadImage = (file) => {
        if (!file?.type.startsWith('image/')) return
        const reader = new FileReader()
        reader.onload = (e) => {
            setOriginal(e.target.result)
            setProcessed(null)
            setError('')
            setProgress(0)
            setImgPos({ x: 0, y: 0 })
            setImgScale(1)
        }
        reader.readAsDataURL(file)
    }

    const removeBackground = async () => {
        if (!original) return
        setLoading(true); setProgress(5); setError(''); setProgressText('Preparing image...')
        try {
            const res = await fetch(original)
            const blob = await res.blob()
            setProgress(20); setProgressText('Initializing AI engine...')

            const { removeBackground: removeBg } = await import('@imgly/background-removal')
            const opts = {
                publicPath: `https://staticimgly.com/@imgly/background-removal-data/1.7.0/dist/`,
                model: 'small',
                device: 'gpu',
                debug: false,
                progress: (key, current, total) => {
                    if (total > 0) {
                        const pct = Math.round((current / total) * 75) + 20
                        setProgress(pct)
                        const label = key.split('/').pop().split('.')[0]
                        setProgressText(`Processing: ${label}...`)
                    }
                },
            }
            let result
            try {
                result = await removeBg(blob, opts)
            } catch (sessionErr) {
                if (opts.device === 'gpu' && (sessionErr?.message?.includes('session') || sessionErr?.message?.includes('OrtGetInputOutputMetadata'))) {
                    setProgressText('Retrying with CPU...')
                    result = await removeBg(blob, { ...opts, device: 'cpu' })
                } else {
                    throw sessionErr
                }
            }

            setProgress(100); setProgressText('Done! ✓')
            processedBlobRef.current = result
            setProcessed(URL.createObjectURL(result))
        } catch (err) {
            console.error(err)
            const isSessionError = err?.message?.includes('OrtGetInputOutputMetadata') || err?.message?.includes('create session')
            setError(
                isSessionError
                    ? 'Background removal failed on this environment. Try a different browser or device, or use a smaller image.'
                    : (err.message || 'Background removal failed. Try a smaller image or refresh.')
            )
        } finally {
            setLoading(false)
            setTimeout(() => setProgress(0), 2000)
        }
    }

    const downloadImage = async () => {
        if (!processed) return
        try {
            const container = document.getElementById('result-viewport')
            const img = document.getElementById('result-image')
            if (!container || !img) return

            const cRect = container.getBoundingClientRect()
            const iRect = img.getBoundingClientRect()
            const srcImg = new Image()
            srcImg.crossOrigin = 'anonymous'
            await new Promise((res, rej) => { srcImg.onload = res; srcImg.onerror = rej; srcImg.src = processed })

            const sf = srcImg.width / iRect.width
            const canvas = document.createElement('canvas')
            canvas.width = cRect.width * sf
            canvas.height = cRect.height * sf
            const ctx = canvas.getContext('2d')

            // Draw background
            const bgStyle = getPreviewStyle(activeBg, customColor, customBgImage)
            if (activeBg.id !== 'transparent') {
                if (activeBg.gradient) {
                    const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
                    g.addColorStop(0, activeBg.gradient[0]); g.addColorStop(1, activeBg.gradient[1])
                    ctx.fillStyle = g
                } else if (activeBg.id === 'custom-color') {
                    ctx.fillStyle = customColor
                } else if ((activeBg.id === 'custom-image' && customBgImage) || activeBg.id?.startsWith('stock-')) {
                    const url = activeBg.id === 'custom-image' ? customBgImage : STOCK_BG.find(s => `stock-${s.id}` === activeBg.id)?.url
                    if (url) {
                        const bg = new Image(); bg.crossOrigin = 'anonymous'
                        await new Promise(r => { bg.onload = r; bg.src = url })
                        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)
                        ctx.fillStyle = 'transparent'
                    }
                } else {
                    ctx.fillStyle = activeBg.color || '#fff'
                }
                if (ctx.fillStyle !== 'transparent') ctx.fillRect(0, 0, canvas.width, canvas.height)
            }

            const x = (iRect.left - cRect.left) * sf
            const y = (iRect.top - cRect.top) * sf
            ctx.drawImage(srcImg, x, y, iRect.width * sf, iRect.height * sf)

            const link = document.createElement('a')
            link.download = 'removed-bg.png'
            link.href = canvas.toDataURL('image/png')
            link.click()
        } catch (e) { console.error('Download error:', e) }
    }

    const handleMouseMove = useCallback((e) => {
        if (!isDragging) return
        setImgPos({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
    }, [isDragging, dragStart])

    const bgStyle = getPreviewStyle(activeBg, customColor, customBgImage)

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors uppercase-none">
            {/* Professional Background Pattern */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40">
                <div className="absolute top-0 left-0 w-full h-full" style={{
                    backgroundImage: 'radial-gradient(#f68934 0.5px, transparent 0.5px)',
                    backgroundSize: '24px 24px'
                }} />
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-16 space-y-12">
                {/* ── HEADER ── */}
                <header className="text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full"
                    >
                        <Sparkles className="w-3 h-3 text-orange-500 animate-pulse" />
                        <span className="text-[10px] font-light uppercase tracking-[0.15em] text-orange-600 dark:text-orange-400">Professional AI Extraction</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                        className="text-2xl md:text-3xl font-light text-slate-900 dark:text-white tracking-tight leading-[1.2]"
                    >
                        Remove <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-500">Backgrounds</span>
                        <br className="hidden md:block" /> with AI Precision
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                        className="text-slate-500 dark:text-slate-400 font-light max-w-2xl mx-auto text-sm"
                    >
                        State-of-the-art object isolation technology. 100% secure, local processing.
                    </motion.p>
                </header>

                {/* ── UPLOAD ZONE ── */}
                {!original && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}
                        onDragOver={(e) => { e.preventDefault(); setIsDrop(true) }}
                        onDragLeave={() => setIsDrop(false)}
                        onDrop={(e) => { e.preventDefault(); setIsDrop(false); loadImage(e.dataTransfer.files[0]) }}
                        onClick={() => fileInputRef.current?.click()}
                        className={`
                            relative max-w-3xl mx-auto border-2 border-dashed rounded-[3rem] p-16 md:p-24
                            flex flex-col items-center justify-center gap-8 cursor-pointer
                            transition-all duration-500 group overflow-hidden
                            ${isDrop
                                ? 'border-orange-500 bg-orange-500/10 scale-[1.02]'
                                : 'border-slate-200 dark:border-slate-800 hover:border-orange-500/50 bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 shadow-xl shadow-slate-200/50 dark:shadow-none'}
                        `}
                    >
                        <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={e => loadImage(e.target.files?.[0])} />

                        <div className="relative">
                            <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full scale-[2.5] group-hover:scale-[3] transition-transform duration-1000" />
                            <div className="relative w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/40 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                <Upload className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <div className="text-center space-y-3">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Begin your project</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">Drag an image here or click to browse files</p>
                        </div>
                        <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
                            {['Auto-Extract', 'Privacy-Safe', 'Full Quality'].map(t => (
                                <span key={t} className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" /> {t}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* ── MAIN WORKSPACE ── */}
                {original && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
                                <span className="text-slate-900 dark:text-white font-black text-sm uppercase tracking-widest">
                                    {processed ? 'Extraction Complete' : loading ? 'AI Engine Processing...' : 'Asset Ready'}
                                </span>
                            </div>
                            <button
                                onClick={() => { setOriginal(null); setProcessed(null); setError(''); processedBlobRef.current = null }}
                                className="flex items-center gap-2 text-slate-500 hover:text-orange-500 text-[10px] font-black uppercase tracking-[0.2em] transition-all px-5 py-2.5 rounded-xl hover:bg-orange-500/5 border border-slate-200 dark:border-slate-800"
                            >
                                <RefreshCcw className="w-3.5 h-3.5" /> Start New
                            </button>
                        </div>

                        {/* Side-by-side panels */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            {/* ── LEFT: Original ── */}
                            <div className="bg-slate-900/80 border border-slate-800 rounded-[2rem] overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Original</span>
                                </div>
                                <div className="p-6 flex items-center justify-center min-h-[380px]">
                                    <img src={original} alt="Original" className="max-w-full max-h-[380px] object-contain rounded-xl" />
                                </div>
                            </div>

                            {/* ── RIGHT: Result ── */}
                            <div className="bg-slate-900/80 border border-slate-800 rounded-[2rem] overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Result</span>
                                    {processed && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => { setImgPos({ x: 0, y: 0 }); setImgScale(1) }}
                                                className="p-1.5 rounded-lg text-slate-500 hover:text-orange-500 hover:bg-orange-500/10 transition-all"
                                                title="Reset view"
                                            >
                                                <RefreshCcw className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => setIsFullscreen(true)}
                                                className="p-1.5 rounded-lg text-slate-500 hover:text-orange-500 hover:bg-orange-500/10 transition-all"
                                                title="Fullscreen preview"
                                            >
                                                <Maximize2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div
                                    id="result-viewport"
                                    className="relative flex items-center justify-center min-h-[380px] overflow-hidden"
                                    style={processed ? bgStyle : { backgroundColor: '#0f172a' }}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={() => setIsDragging(false)}
                                    onMouseLeave={() => setIsDragging(false)}
                                >
                                    {/* Loading overlay */}
                                    <AnimatePresence>
                                        {loading && (
                                            <motion.div
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                className="absolute inset-0 z-10 bg-slate-900/40 backdrop-blur-md flex flex-col items-center justify-center gap-6 p-10"
                                            >
                                                <div className="relative w-20 h-20">
                                                    <div className="absolute inset-0 border-4 border-orange-500/10 rounded-full" />
                                                    <div className="absolute inset-0 border-4 border-t-orange-500 rounded-full animate-spin" />
                                                    <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-orange-500 shadow-orange-500" />
                                                </div>
                                                <div className="w-full max-w-xs space-y-4 text-center">
                                                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                                        <motion.div
                                                            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                                                            animate={{ width: `${progress}%` }}
                                                            transition={{ ease: 'linear' }}
                                                        />
                                                    </div>
                                                    <p className="text-slate-900 dark:text-white font-black text-sm uppercase tracking-widest">{progressText}</p>
                                                    <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold tracking-tighter">{progress}% ANALYZED</p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {processed ? (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <img
                                                id="result-image"
                                                src={processed}
                                                alt="Result"
                                                className="max-w-[90%] max-h-[360px] object-contain select-none"
                                                style={{
                                                    transform: `translate(${imgPos.x}px, ${imgPos.y}px) scale(${imgScale})`,
                                                    cursor: isDragging ? 'grabbing' : 'grab',
                                                    filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))',
                                                    transition: isDragging ? 'none' : 'transform 0.2s ease',
                                                }}
                                                onMouseDown={(e) => {
                                                    setIsDragging(true)
                                                    setDragStart({ x: e.clientX - imgPos.x, y: e.clientY - imgPos.y })
                                                }}
                                                draggable={false}
                                            />
                                            {/* Zoom pill */}
                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-slate-900/90 border border-slate-700 backdrop-blur-md px-3 py-1.5 rounded-full shadow-2xl z-20">
                                                <button onClick={() => setImgScale(s => Math.max(0.3, +(s - 0.15).toFixed(2)))} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white rounded transition-colors"><Minus className="w-3.5 h-3.5" /></button>
                                                <span className="text-[10px] font-black text-slate-300 w-10 text-center">{Math.round(imgScale * 100)}%</span>
                                                <button onClick={() => setImgScale(s => Math.min(3, +(s + 0.15).toFixed(2)))} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white rounded transition-colors"><Plus className="w-3.5 h-3.5" /></button>
                                                <div className="w-px h-4 bg-slate-700 mx-1" />
                                                <Move className="w-3
 h-3 text-slate-600" />
                                            </div>
                                        </div>
                                    ) : !loading && (
                                        <div className="text-center space-y-4">
                                            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto">
                                                <Sparkles className="w-8 h-8 text-slate-600" />
                                            </div>
                                            <p className="text-slate-600 text-sm font-medium">Result will appear here</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ── BOTTOM: Action Bar (before processing) ── */}
                        {!processed && !loading && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center pt-2">
                                <button
                                    onClick={removeBackground}
                                    className="group relative h-16 px-14 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-black text-base rounded-2xl shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-500 hover:-translate-y-1 active:translate-y-0 overflow-hidden uppercase tracking-[0.2em]"
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span className="relative flex items-center gap-4">
                                        <Zap className="w-5 h-5 fill-current" />
                                        Process AI Extraction
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                    </span>
                                </button>
                            </motion.div>
                        )}

                        {/* ── BOTTOM: Creative Panel (after processing) ── */}
                        <AnimatePresence>
                            {processed && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className="bg-slate-900/80 border border-slate-800 rounded-[2rem] overflow-hidden"
                                >
                                    {/* Panel header */}
                                    <div className="px-8 py-5 border-b border-slate-800 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-slate-900 dark:text-white font-black text-lg">Creative Studio</h3>
                                            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mt-1">Refine your asset with custom backgrounds</p>
                                        </div>
                                        <button
                                            onClick={downloadImage}
                                            className="flex items-center gap-3 h-12 px-8 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs rounded-xl shadow-xl shadow-orange-500/20 transition-all hover:-translate-y-1 uppercase tracking-widest"
                                        >
                                            <Download className="w-4 h-4" /> Export High-Res
                                        </button>
                                    </div>

                                    <div className="p-8 space-y-8">
                                        {/* Tab selectors */}
                                        <div className="flex items-center gap-1 bg-slate-800/60 p-1 rounded-xl w-fit">
                                            {[['colors', 'Colors & Gradients'], ['photos', 'Stock Photos']].map(([id, label]) => (
                                                <button
                                                    key={id}
                                                    onClick={() => setTab(id)}
                                                    className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${tab === id ? 'bg-orange-600 text-white shadow-xl' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                                                >
                                                    {label}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Colors tab */}
                                        {tab === 'colors' && (
                                            <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
                                                {BACKGROUNDS.map(bg => {
                                                    const isActive = activeBg.id === bg.id
                                                    return (
                                                        <button
                                                            key={bg.id}
                                                            onClick={() => setActiveBg(bg)}
                                                            title={bg.name}
                                                            className={`group flex flex-col items-center gap-2 transition-all`}
                                                        >
                                                            <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${isActive ? 'border-orange-500 scale-110 shadow-xl shadow-orange-500/20' : 'border-slate-200 dark:border-slate-700 hover:border-orange-500/50 hover:scale-105'}`}
                                                                style={bg.id === 'transparent' ? {
                                                                    backgroundImage: 'linear-gradient(45deg,#334155 25%,transparent 25%),linear-gradient(-45deg,#334155 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#334155 75%),linear-gradient(-45deg,transparent 75%,#334155 75%)',
                                                                    backgroundSize: '8px 8px',
                                                                    backgroundPosition: '0 0,0 4px,4px -4px,-4px 0',
                                                                    backgroundColor: '#1e293b',
                                                                } : bg.id === 'custom-color' ? {
                                                                    background: `conic-gradient(red,yellow,lime,aqua,blue,magenta,red)`
                                                                } : bg.gradient ? {
                                                                    background: `linear-gradient(135deg,${bg.gradient[0]},${bg.gradient[1]})`
                                                                } : { backgroundColor: bg.color }}
                                                            >
                                                                {isActive && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                                                            </div>
                                                            <span className="text-[9px] text-slate-500 group-hover:text-slate-300 transition-colors font-medium">{bg.name}</span>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        )}

                                        {/* Custom color picker */}
                                        {tab === 'colors' && activeBg.id === 'custom-color' && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex items-center gap-4 p-5 bg-slate-800/50 rounded-2xl border border-slate-700">
                                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Custom Finish</label>
                                                <input type="color" value={customColor} onChange={e => setCustomColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent" />
                                                <span className="font-mono text-orange-600 dark:text-orange-400 font-black text-sm">{customColor.toUpperCase()}</span>
                                            </motion.div>
                                        )}

                                        {/* Photos tab */}
                                        {tab === 'photos' && (
                                            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                                                {STOCK_BG.map(s => {
                                                    const bgId = `stock-${s.id}`
                                                    const isActive = activeBg.id === bgId
                                                    return (
                                                        <button
                                                            key={s.id}
                                                            onClick={() => setActiveBg({ id: bgId, name: s.id })}
                                                            className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${isActive ? 'border-orange-500 scale-105 shadow-xl shadow-orange-500/20' : 'border-slate-200 dark:border-slate-700 hover:border-orange-500/50'}`}
                                                        >
                                                            <img src={s.url} alt={s.id} className="w-full h-full object-cover" />
                                                            {isActive && (
                                                                <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center backdrop-blur-[2px]">
                                                                    <Check className="w-6 h-6 text-white drop-shadow-lg" />
                                                                </div>
                                                            )}
                                                        </button>
                                                    )
                                                })}

                                                {/* Custom upload */}
                                                <label className={`relative aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105 ${activeBg.id === 'custom-image' ? 'border-orange-500 bg-orange-500/5' : 'border-slate-200 dark:border-slate-700 hover:border-orange-500/50'}`}
                                                    style={customBgImage && activeBg.id === 'custom-image' ? { backgroundImage: `url(${customBgImage})`, backgroundSize: 'cover' } : {}}>
                                                    <Upload className="w-5 h-5 text-slate-500" />
                                                    <span className="text-[9px] text-slate-500 font-bold uppercase">Upload</span>
                                                    <input ref={bgFileInputRef} type="file" hidden accept="image/*" onChange={e => {
                                                        const f = e.target.files?.[0]; if (!f) return
                                                        const r = new FileReader(); r.onload = ev => { setCustomBgImage(ev.target.result); setActiveBg({ id: 'custom-image', name: 'Custom' }) }; r.readAsDataURL(f)
                                                    }} />
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Error */}
                        {error && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                className="flex items-start gap-4 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl"
                            >
                                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-red-400 font-black text-sm uppercase tracking-tight">Processing failed</p>
                                    <p className="text-red-400/70 text-xs mt-1 font-medium">{error}</p>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* ── FEATURE GRID ── */}
                {!original && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
                    >
                        {[
                            { icon: '🧠', title: 'Deep Learning', text: 'U2-Net neural network' },
                            { icon: '🔒', title: '100% Private', text: 'Runs in your browser' },
                            { icon: '⚡', title: 'Fast & Free', text: 'No account needed' },
                            { icon: '🎨', title: 'HD Quality', text: 'Full resolution output' },
                        ].map((f, i) => (
                            <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 text-center space-y-2 hover:border-slate-700 transition-colors">
                                <div className="text-2xl">{f.icon}</div>
                                <p className="text-white font-black text-xs uppercase tracking-tight">{f.title}</p>
                                <p className="text-slate-500 text-xs">{f.text}</p>
                            </div>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* ── FULLSCREEN MODAL ── */}
            <AnimatePresence>
                {isFullscreen && processed && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center"
                        onClick={() => setIsFullscreen(false)}
                    >
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl" />

                        {/* Controls */}
                        <div className="absolute top-6 right-6 flex items-center gap-3 z-10">
                            <button
                                onClick={(e) => { e.stopPropagation(); downloadImage() }}
                                className="flex items-center gap-3 h-11 px-6 bg-orange-600 hover:bg-orange-500 text-white font-black text-xs rounded-xl shadow-xl shadow-orange-900/40 transition-all uppercase tracking-widest"
                            >
                                <Download className="w-4 h-4" /> Download Result
                            </button>
                            <button
                                onClick={() => setIsFullscreen(false)}
                                className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Top-left label */}
                        <div className="absolute top-6 left-6 flex items-center gap-3 z-10">
                            <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
                            <span className="text-white/80 text-[10px] font-black uppercase tracking-[0.3em] drop-shadow-md">Professional Preview</span>
                        </div>

                        {/* Image */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="relative z-10 rounded-3xl overflow-hidden max-w-5xl max-h-[80vh] w-[90vw] flex items-center justify-center"
                            style={{ ...bgStyle, minWidth: 300, minHeight: 300 }}
                        >
                            <img
                                src={processed}
                                alt="Fullscreen result"
                                className="max-w-full max-h-[80vh] object-contain"
                                style={{ filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.6))' }}
                            />
                        </motion.div>

                        {/* Hint */}
                        <p className="absolute bottom-6 text-slate-600 text-xs">Click anywhere outside to close · ESC to exit</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
