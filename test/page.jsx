"use client";

import React, { useState, useRef } from 'react';
import { Upload, Download, X, Loader2, Sparkles, Zap } from 'lucide-react';

export default function AIBackgroundRemover() {
    const [originalImage, setOriginalImage] = useState(null);
    const [processedImage, setProcessedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressText, setProgressText] = useState('');
    const [error, setError] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);
    const processedBlobRef = useRef(null);
    const [selectedBackground, setSelectedBackground] = useState('transparent');
    const [customBgImage, setCustomBgImage] = useState(null);
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
    const [isDraggingImage, setIsDraggingImage] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [imageScale, setImageScale] = useState(1);
    const [customColor, setCustomColor] = useState('#FFFFFF');

    const backgrounds = [
        { id: 'transparent', name: 'Transparent', value: 'transparent', pattern: 'checkerboard' },
        { id: 'white', name: 'White', value: '#FFFFFF', pattern: 'solid' },
        { id: 'black', name: 'Black', value: '#000000', pattern: 'solid' },
        { id: 'gray', name: 'Gray', value: '#F3F4F6', pattern: 'solid' },
        { id: 'blue', name: 'Blue', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', pattern: 'gradient' },
        { id: 'green', name: 'Green', value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', pattern: 'gradient' },
        { id: 'orange', name: 'Orange', value: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)', pattern: 'gradient' },
        { id: 'pink', name: 'Pink', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', pattern: 'gradient' },
        { id: 'custom-color', name: 'Custom Color', value: 'custom', pattern: 'solid' },
    ];

    const backgroundImages = [
        { id: 'nature1', name: 'Nature 1', url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80' },
        { id: 'nature2', name: 'Nature 2', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80' },
        { id: 'city1', name: 'City 1', url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80' },
        { id: 'city2', name: 'City 2', url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80' },
        { id: 'abstract1', name: 'Abstract 1', url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80' },
        { id: 'bokeh1', name: 'Bokeh 1', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80' },
        { id: 'bokeh2', name: 'Bokeh 2', url: 'https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=800&q=80' },
    ];

    const handleImageUpload = (file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setOriginalImage(event.target.result);
                setProcessedImage(null);
                setError('');
                setProgress(0);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileInput = (e) => {
        const file = e.target.files?.[0];
        if (file) handleImageUpload(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleImageUpload(file);
    };

    const removeBackground = async () => {
        if (!originalImage) return;

        setLoading(true);
        setProgress(0);
        setError('');
        setProgressText('Initializing...');

        try {
            const response = await fetch(originalImage);
            const blob = await response.blob();

            setProgress(20);
            setProgressText('Loading AI model...');

            const { removeBackground: removeBg } = await import('@imgly/background-removal');

            const result = await removeBg(blob, {
                progress: (key, current, total) => {
                    const percent = Math.round((current / total) * 80) + 20;
                    setProgress(percent);
                    setProgressText(`Processing: ${key}...`);
                },
            });

            setProgress(100);
            setProgressText('Complete! ✓');

            processedBlobRef.current = result;
            const url = URL.createObjectURL(result);
            setProcessedImage(url);

        } catch (err) {
            console.error('Error:', err);
            setError('Background remove karne mein error aagaya. Please try again!');
        } finally {
            setLoading(false);
            setTimeout(() => setProgress(0), 2000);
        }
    };

    const downloadImage = async () => {
        if (!processedImage) return;

        try {
            const displayContainer = document.querySelector('.processed-image-container');
            const displayedImg = document.querySelector('.draggable-image');

            if (!displayContainer || !displayedImg) return;

            const containerRect = displayContainer.getBoundingClientRect();
            const imgRect = displayedImg.getBoundingClientRect();

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const img = new Image();
            img.crossOrigin = 'anonymous';

            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = processedImage;
            });

            const displayWidth = imgRect.width;
            const displayHeight = imgRect.height;
            const scaleFactor = img.width / displayWidth;
            const canvasWidth = Math.round(containerRect.width * scaleFactor);
            const canvasHeight = Math.round(containerRect.height * scaleFactor);

            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            const relativeX = imgRect.left - containerRect.left;
            const relativeY = imgRect.top - containerRect.top;

            const canvasX = relativeX * scaleFactor;
            const canvasY = relativeY * scaleFactor;
            const canvasImgWidth = displayWidth * scaleFactor;
            const canvasImgHeight = displayHeight * scaleFactor;

            if (selectedBackground === 'transparent') {
                ctx.drawImage(img, canvasX, canvasY, canvasImgWidth, canvasImgHeight);
            } else if (selectedBackground === 'custom' && customBgImage) {
                const bgImg = new Image();
                bgImg.crossOrigin = 'anonymous';
                await new Promise((resolve, reject) => {
                    bgImg.onload = resolve;
                    bgImg.onerror = reject;
                    bgImg.src = customBgImage;
                });
                ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, canvasX, canvasY, canvasImgWidth, canvasImgHeight);
            } else if (selectedBackground === 'custom-color') {
                ctx.fillStyle = customColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, canvasX, canvasY, canvasImgWidth, canvasImgHeight);
            } else if (selectedBackground.startsWith('bgImage-')) {
                const bgData = backgroundImages.find(bg => bg.id === selectedBackground.replace('bgImage-', ''));
                if (bgData) {
                    const bgImg = new Image();
                    bgImg.crossOrigin = 'anonymous';
                    await new Promise((resolve, reject) => {
                        bgImg.onload = resolve;
                        bgImg.onerror = reject;
                        bgImg.src = bgData.url;
                    });
                    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, canvasX, canvasY, canvasImgWidth, canvasImgHeight);
                }
            } else {
                const bg = backgrounds.find(b => b.id === selectedBackground);
                if (bg && bg.value.startsWith('linear-gradient')) {
                    const colors = bg.value.match(/#[0-9a-fA-F]{6}/g);
                    if (colors && colors.length >= 2) {
                        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                        gradient.addColorStop(0, colors[0]);
                        gradient.addColorStop(1, colors[1]);
                        ctx.fillStyle = gradient;
                    } else {
                        ctx.fillStyle = '#FFFFFF';
                    }
                } else if (bg) {
                    ctx.fillStyle = bg.value;
                } else {
                    ctx.fillStyle = '#FFFFFF';
                }
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, canvasX, canvasY, canvasImgWidth, canvasImgHeight);
            }

            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'background-removed.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 'image/png');

        } catch (error) {
            console.error('Download error:', error);
            if (processedBlobRef.current) {
                const url = URL.createObjectURL(processedBlobRef.current);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'background-removed.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }
        }
    };

    const reset = () => {
        setOriginalImage(null);
        setProcessedImage(null);
        setError('');
        setProgress(0);
        setSelectedBackground('transparent');
        setCustomBgImage(null);
        setImagePosition({ x: 0, y: 0 });
        setImageScale(1);
        processedBlobRef.current = null;
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleImageMouseDown = (e) => {
        if (!processedImage) return;
        setIsDraggingImage(true);
        setDragStart({
            x: e.clientX - imagePosition.x,
            y: e.clientY - imagePosition.y
        });
    };

    const handleImageMouseMove = (e) => {
        if (!isDraggingImage) return;
        setImagePosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleImageMouseUp = () => {
        setIsDraggingImage(false);
    };

    const handleZoomIn = () => {
        setImageScale(prev => Math.min(prev + 0.1, 3));
    };

    const handleZoomOut = () => {
        setImageScale(prev => Math.max(prev - 0.1, 0.5));
    };

    const handleResetPosition = () => {
        setImagePosition({ x: 0, y: 0 });
        setImageScale(1);
    };

    const handleCustomBgUpload = (file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setCustomBgImage(event.target.result);
                setSelectedBackground('custom');
            };
            reader.readAsDataURL(file);
        }
    };

    const getBackgroundStyle = () => {
        if (selectedBackground === 'custom' && customBgImage) {
            return {
                backgroundImage: `url(${customBgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            };
        } else if (selectedBackground === 'custom-color') {
            return {
                background: customColor,
            };
        } else if (selectedBackground === 'transparent') {
            return {
                background: `linear-gradient(45deg, #e5e7eb 25%, transparent 25%), 
                            linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), 
                            linear-gradient(45deg, transparent 75%, #e5e7eb 75%), 
                            linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)`,
                backgroundSize: '30px 30px',
                backgroundPosition: '0 0, 0 15px, 15px -15px, -15px 0px',
            };
        } else if (selectedBackground.startsWith('bgImage-')) {
            const bgImg = backgroundImages.find(bg => bg.id === selectedBackground.replace('bgImage-', ''));
            return {
                backgroundImage: `url(${bgImg?.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            };
        } else {
            const bg = backgrounds.find(b => b.id === selectedBackground);
            return {
                background: bg?.value || '#f9fafb',
            };
        }
    };

    return (
        <div className="min-h-screen bg-white">


            <div className="max-w-7xl mx-auto px-6 py-16 text-center">
                <div className="mb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full mb-6">
                        <Sparkles className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-medium text-orange-700 uppercase tracking-wide">
                            AI-POWERED · PROFESSIONAL QUALITY
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                        Remove Background with
                        <br />
                        <span className="text-orange-500">AI-Powered</span> Technology
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
                        Professional background removal powered by advanced neural networks—perfect for products, portraits, and any object with clarity and precision.
                    </p>

                    {!originalImage && (
                        <div className="flex justify-center mb-12">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg text-lg"
                            >
                                UPLOAD IMAGE
                            </button>
                        </div>
                    )}
                </div>

                {!originalImage && (
                    <div className="max-w-2xl mx-auto mb-12">
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left">
                            <p className="text-sm text-amber-900">
                                <strong>⚡ First Time Use:</strong> AI model will download (~50MB) on first use. After that, it works offline!
                            </p>
                        </div>
                    </div>
                )}

                {!originalImage && (
                    <div className="max-w-4xl mx-auto">
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-3 border-dashed rounded-3xl p-20 cursor-pointer transition-all ${isDragging
                                ? 'border-orange-500 bg-orange-50'
                                : 'border-gray-300 bg-gray-50 hover:border-orange-400 hover:bg-orange-50'
                                }`}
                        >
                            <Upload className="w-16 h-16 mx-auto mb-6 text-orange-500" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                Drop your image here
                            </h3>
                            <p className="text-gray-600 text-lg mb-6">
                                or click to browse • Supports PNG, JPG, JPEG
                            </p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileInput}
                                className="hidden"
                            />
                        </div>
                    </div>
                )}

                {error && (
                    <div className="max-w-4xl mx-auto mb-8">
                        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl">
                            <p className="font-semibold">{error}</p>
                        </div>
                    </div>
                )}

                {originalImage && (
                    <div className="max-w-7xl mx-auto mt-12">
                        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {processedImage ? 'Results' : 'Preview'}
                                </h3>
                                <button
                                    onClick={reset}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-all font-medium"
                                >
                                    <X className="w-5 h-5" />
                                    Reset
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">
                                        Original Image
                                    </h4>
                                    <div className="bg-gray-50 rounded-2xl p-6 min-h-[400px] flex items-center justify-center overflow-hidden border border-gray-200">
                                        <img
                                            src={originalImage}
                                            alt="Original"
                                            className="max-w-full max-h-[500px] object-contain rounded-lg"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">
                                        {processedImage ? 'Background Removed' : 'Processing...'}
                                    </h4>
                                    <div
                                        className="rounded-2xl p-6 min-h-[400px] flex items-center justify-center overflow-hidden border border-gray-200 relative processed-image-container"
                                        style={processedImage ? getBackgroundStyle() : { background: '#f9fafb' }}
                                        onMouseMove={handleImageMouseMove}
                                        onMouseUp={handleImageMouseUp}
                                        onMouseLeave={handleImageMouseUp}
                                    >
                                        {processedImage ? (
                                            <img
                                                src={processedImage}
                                                alt="Processed"
                                                className="max-w-full max-h-[500px] object-contain rounded-lg draggable-image"
                                                style={{
                                                    transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imageScale})`,
                                                    cursor: isDraggingImage ? 'grabbing' : 'grab',
                                                    transition: isDraggingImage ? 'none' : 'transform 0.2s'
                                                }}
                                                onMouseDown={handleImageMouseDown}
                                                draggable={false}
                                            />
                                        ) : (
                                            <div className="text-center">
                                                <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4 animate-pulse" />
                                                <p className="text-gray-500 font-medium">
                                                    Ready to process
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    {processedImage && (
                                        <div className="flex items-center justify-center gap-2 mt-3">
                                            <button
                                                onClick={handleZoomOut}
                                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium"
                                            >
                                                −
                                            </button>
                                            <span className="text-sm text-gray-600 font-medium">
                                                {Math.round(imageScale * 100)}%
                                            </span>
                                            <button
                                                onClick={handleZoomIn}
                                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium"
                                            >
                                                +
                                            </button>
                                            <button
                                                onClick={handleResetPosition}
                                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium ml-2"
                                            >
                                                Reset View
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {loading && (
                                <div className="mb-8">
                                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-center mt-3 text-sm text-gray-600 font-medium">
                                        {progressText} - {progress}%
                                    </p>
                                </div>
                            )}

                            {processedImage && (
                                <div className="mb-8">
                                    <h4 className="text-sm font-bold text-gray-700 mb-4">Choose Background:</h4>

                                    <div className="flex flex-wrap gap-3 mb-4">
                                        {backgrounds.map((bg) => (
                                            <button
                                                key={bg.id}
                                                onClick={() => setSelectedBackground(bg.id)}
                                                className={`px-4 py-2 rounded-full font-medium transition-all ${selectedBackground === bg.id
                                                    ? 'bg-orange-500 text-white shadow-lg'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                    }`}
                                            >
                                                {bg.name}
                                            </button>
                                        ))}
                                    </div>

                                    {selectedBackground === 'custom-color' && (
                                        <div className="flex items-center gap-3 mb-4 p-4 bg-gray-50 rounded-xl">
                                            <label className="text-sm font-medium text-gray-700">Pick Color:</label>
                                            <input
                                                type="color"
                                                value={customColor}
                                                onChange={(e) => setCustomColor(e.target.value)}
                                                className="w-16 h-10 rounded-lg cursor-pointer border-2 border-gray-300"
                                            />
                                            <span className="text-sm text-gray-600 font-mono">{customColor}</span>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-4 md:grid-cols-8 gap-3 mb-4">
                                        {backgroundImages.map((bgImg) => (
                                            <button
                                                key={bgImg.id}
                                                onClick={() => setSelectedBackground(`bgImage-${bgImg.id}`)}
                                                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedBackground === `bgImage-${bgImg.id}`
                                                    ? 'border-orange-500 shadow-lg scale-105'
                                                    : 'border-gray-300 hover:border-orange-300'
                                                    }`}
                                            >
                                                <img
                                                    src={bgImg.url}
                                                    alt={bgImg.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <label className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-all font-medium cursor-pointer">
                                            <Upload className="w-4 h-4" />
                                            Upload Custom Background
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleCustomBgUpload(e.target.files?.[0])}
                                                className="hidden"
                                            />
                                        </label>
                                        {customBgImage && (
                                            <span className="text-sm text-green-600 font-medium">✓ Custom background uploaded</span>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-4 justify-center">
                                {!processedImage && (
                                    <button
                                        onClick={removeBackground}
                                        disabled={loading}
                                        className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                PROCESSING...
                                            </>
                                        ) : (
                                            <>
                                                <Zap className="w-5 h-5" />
                                                REMOVE BACKGROUND
                                            </>
                                        )}
                                    </button>
                                )}

                                {processedImage && (
                                    <button
                                        onClick={downloadImage}
                                        className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg text-lg"
                                    >
                                        <Download className="w-5 h-5" />
                                        DOWNLOAD PNG
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Powered by Advanced AI
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Neural network technology for professional-grade background removal
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">🧠</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Deep Learning</h3>
                            <p className="text-gray-600">U2-Net neural network for precise segmentation</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">👤</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Perfect for Humans</h3>
                            <p className="text-gray-600">Hair, edges, and details perfectly preserved</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">📦</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Any Object</h3>
                            <p className="text-gray-600">Products, animals, objects—all handled perfectly</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">🔒</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">100% Private</h3>
                            <p className="text-gray-600">Client-side processing—no server uploads</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}