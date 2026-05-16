"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, MapPin, Upload, RefreshCw, Loader2, Sparkles, X, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import Image from "next/image"

type Step = "idle" | "preview" | "analyzing" | "result"

export function WhereAmIContent() {
    const [step, setStep] = useState<Step>("idle")
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [imageBase64, setImageBase64] = useState<string | null>(null)
    const [imageMimeType, setImageMimeType] = useState<string>("image/jpeg")
    const [analysis, setAnalysis] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const cameraInputRef = useRef<HTMLInputElement>(null)

    const processFile = useCallback((file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file")
            return
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error("Image must be under 10 MB")
            return
        }

        setImageMimeType(file.type)
        const reader = new FileReader()
        reader.onload = (e) => {
            const result = e.target?.result as string
            setImagePreview(result)
            // Strip the data URL prefix to get raw base64
            const base64 = result.split(",")[1]
            setImageBase64(base64)
            setStep("preview")
        }
        reader.readAsDataURL(file)
    }, [])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) processFile(file)
        e.target.value = ""
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        const file = e.dataTransfer.files?.[0]
        if (file) processFile(file)
    }

    const handleAnalyze = async () => {
        if (!imageBase64) return
        setStep("analyzing")

        try {
            const response = await fetch("/api/vision/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ imageBase64, mimeType: imageMimeType }),
            })

            const data = await response.json()
            if (!response.ok) throw new Error(data.error || "Analysis failed")

            setAnalysis(data.analysis)
            setStep("result")
        } catch (err) {
            const error = err as Error
            toast.error(error.message || "Failed to analyze image")
            setStep("preview")
        }
    }

    const handleReset = () => {
        setStep("idle")
        setImagePreview(null)
        setImageBase64(null)
        setAnalysis(null)
    }

    const formatAnalysis = (text: string) => {
        return text.split("\n").map((line, i) => {
            if (line.startsWith("**") && line.endsWith("**")) {
                return <p key={i} className="font-bold text-white mt-4 mb-1">{line.replace(/\*\*/g, "")}</p>
            }
            if (line.match(/^\*\*(.+?)\*\*/)) {
                const formatted = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                return <p key={i} className="text-gray-200 mb-1" dangerouslySetInnerHTML={{ __html: formatted }} />
            }
            if (line.startsWith("- ") || line.startsWith("• ")) {
                return <p key={i} className="text-gray-300 ml-4 mb-1">• {line.slice(2)}</p>
            }
            if (line.trim() === "") return <div key={i} className="h-2" />
            return <p key={i} className="text-gray-200 mb-1">{line}</p>
        })
    }

    return (
        <div className="container mx-auto px-4 py-8 text-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-10"
            >
                <h1 className="text-4xl font-bold mb-3">Where Am I?</h1>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                    Take or upload a photo of any Indian landmark, destination, or scenery — our AI will identify it and give you travel insights.
                </p>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-6">
                <AnimatePresence mode="wait">
                    {/* IDLE — Upload area */}
                    {step === "idle" && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div
                                className="relative border-2 border-dashed border-gray-600 rounded-2xl p-12 text-center cursor-pointer hover:border-[#00A699] transition-colors bg-gray-900/50"
                                onClick={() => fileInputRef.current?.click()}
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                            >
                                <div className="flex flex-col items-center gap-4">
                                    <div className="h-20 w-20 rounded-full bg-gray-800 flex items-center justify-center">
                                        <ImageIcon className="h-10 w-10 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-medium text-gray-200">Drop an image here</p>
                                        <p className="text-gray-400 mt-1">or click to browse your files</p>
                                    </div>
                                    <p className="text-gray-500 text-sm">PNG, JPG, WEBP up to 10 MB</p>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>

                            <div className="flex gap-4 mt-4">
                                <Button
                                    className="flex-1 bg-[#00A699] hover:bg-[#008b80] py-6 text-base"
                                    onClick={() => cameraInputRef.current?.click()}
                                >
                                    <Camera className="mr-2 h-5 w-5" />
                                    Take a Photo
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1 py-6 text-base border-gray-600 text-gray-200 hover:bg-gray-800"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload className="mr-2 h-5 w-5" />
                                    Upload Image
                                </Button>
                                <input
                                    ref={cameraInputRef}
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* PREVIEW — Show image, confirm before analyzing */}
                    {step === "preview" && imagePreview && (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                        >
                            <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-video">
                                <Image
                                    src={imagePreview}
                                    alt="Captured image"
                                    fill
                                    className="object-contain"
                                    unoptimized
                                />
                                <button
                                    onClick={handleReset}
                                    className="absolute top-3 right-3 bg-black/60 rounded-full p-1.5 text-white hover:bg-black/80 transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="flex gap-4">
                                <Button
                                    variant="outline"
                                    className="flex-1 border-gray-600 text-gray-200 hover:bg-gray-800"
                                    onClick={handleReset}
                                >
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Choose Different
                                </Button>
                                <Button
                                    className="flex-1 bg-[#00A699] hover:bg-[#008b80] py-3"
                                    onClick={handleAnalyze}
                                >
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Analyze with AI
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* ANALYZING */}
                    {step === "analyzing" && (
                        <motion.div
                            key="analyzing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-20"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                className="inline-block mb-6"
                            >
                                <div className="h-20 w-20 rounded-full border-4 border-[#00A699] border-t-transparent" />
                            </motion.div>
                            <p className="text-xl font-medium text-gray-200">Analyzing your image...</p>
                            <p className="text-gray-400 mt-2">Our AI is identifying the location and gathering travel insights</p>
                        </motion.div>
                    )}

                    {/* RESULT */}
                    {step === "result" && analysis && imagePreview && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative rounded-2xl overflow-hidden aspect-video bg-gray-900">
                                    <Image
                                        src={imagePreview}
                                        alt="Analyzed image"
                                        fill
                                        className="object-contain"
                                        unoptimized
                                    />
                                </div>
                                <Card className="bg-[#00A699]/20 border-[#00A699]/40">
                                    <CardContent className="pt-5 flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-full bg-[#00A699] flex items-center justify-center shrink-0">
                                            <MapPin className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold text-lg">Location Identified</p>
                                            <p className="text-[#00A699] text-sm">AI Vision Analysis Complete</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card className="bg-gray-900/80 border-gray-700">
                                <CardContent className="pt-6 space-y-1">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Sparkles className="h-5 w-5 text-[#00A699]" />
                                        <h3 className="font-semibold text-white text-lg">AI Travel Insights</h3>
                                    </div>
                                    <div className="leading-relaxed">
                                        {formatAnalysis(analysis)}
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex gap-4">
                                <Button
                                    className="flex-1 bg-[#00A699] hover:bg-[#008b80]"
                                    onClick={handleReset}
                                >
                                    <Camera className="mr-2 h-4 w-4" />
                                    Analyze Another Photo
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-gray-600 text-gray-200 hover:bg-gray-800"
                                    onClick={() => {
                                        if (imagePreview) {
                                            setStep("preview")
                                        }
                                    }}
                                >
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Re-analyze
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* How it works */}
                {step === "idle" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-12 bg-gray-900/60 p-8 rounded-2xl border border-gray-800"
                    >
                        <h2 className="text-xl font-bold mb-6 text-white">How It Works</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { icon: <Camera className="h-6 w-6" />, title: "Capture or Upload", desc: "Take a photo of any landmark, temple, mountain, beach, or building around you." },
                                { icon: <Loader2 className="h-6 w-6" />, title: "AI Vision Analysis", desc: "GPT-4o Vision analyzes your image and identifies the location with high accuracy." },
                                { icon: <MapPin className="h-6 w-6" />, title: "Get Travel Insights", desc: "Receive location details, travel tips, best time to visit, and nearby attractions." },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="h-10 w-10 rounded-full bg-[#00A699]/20 border border-[#00A699]/40 flex items-center justify-center text-[#00A699] shrink-0">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white mb-1">{item.title}</p>
                                        <p className="text-gray-400 text-sm">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
