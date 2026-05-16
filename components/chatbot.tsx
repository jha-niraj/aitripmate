"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Send, X, Bot, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "./ui/input"
import { toast } from "sonner"

interface ChatbotProps {
    destination?: string
}

interface Message {
    text: string
    isUser: boolean
    timestamp: number
}

interface HistoryEntry {
    role: "user" | "assistant"
    content: string
}

const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000

export function Chatbot({ destination }: ChatbotProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [inputValue, setInputValue] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [hasWarning, setHasWarning] = useState(false)
    const [streamingText, setStreamingText] = useState("")
    const messageEndRef = useRef<HTMLDivElement>(null)
    const abortRef = useRef<AbortController | null>(null)

    const initializeChat = useCallback(() => {
        const welcomeMessage: Message = {
            text: destination
                ? `Hi! How can I help you plan your stay in ${destination}?`
                : "Hi! I'm your AI Trip Mate. How can I help you plan your next adventure in India?",
            isUser: false,
            timestamp: Date.now(),
        }
        setMessages([welcomeMessage])
    }, [destination])

    useEffect(() => {
        const storedData = localStorage.getItem("tripMateChatMessages")
        if (storedData) {
            try {
                const parsedData: Message[] = JSON.parse(storedData)
                const lastTime = Math.max(...parsedData.map((m) => m.timestamp))
                if (Date.now() - lastTime > FIVE_DAYS_MS) {
                    localStorage.removeItem("tripMateChatMessages")
                    initializeChat()
                } else {
                    setMessages(parsedData)
                }
            } catch {
                initializeChat()
            }
        } else {
            initializeChat()
        }
    }, [destination, initializeChat])

    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem("tripMateChatMessages", JSON.stringify(messages))
        }
    }, [messages])

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "unset"
        return () => { document.body.style.overflow = "unset" }
    }, [isOpen])

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, isTyping, streamingText])

    const buildHistory = (): HistoryEntry[] => {
        return messages
            .filter((m) => m.text !== messages[0]?.text || m.isUser)
            .slice(-10)
            .map((m) => ({ role: m.isUser ? "user" : "assistant", content: m.text }))
    }

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return

        const userMessage: Message = {
            text: inputValue,
            isUser: true,
            timestamp: Date.now(),
        }

        setMessages((prev) => [...prev, userMessage])
        const currentInput = inputValue
        setInputValue("")
        setIsLoading(true)
        setIsTyping(true)
        setStreamingText("")

        const controller = new AbortController()
        abortRef.current = controller

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: currentInput,
                    destination,
                    history: buildHistory(),
                }),
                signal: controller.signal,
            })

            if (!response.ok) {
                throw new Error("Failed to get response")
            }

            const isWarning = response.headers.get("X-Content-Warning") === "true"
            if (isWarning) {
                setHasWarning(true)
            }

            const reader = response.body?.getReader()
            const decoder = new TextDecoder()

            if (!reader) throw new Error("No response body")

            setIsTyping(false)
            let fullText = ""

            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                const chunk = decoder.decode(value, { stream: true })
                fullText += chunk
                setStreamingText(fullText)
            }

            const botMessage: Message = {
                text: fullText,
                isUser: false,
                timestamp: Date.now(),
            }
            setMessages((prev) => [...prev, botMessage])
            setStreamingText("")
        } catch (err) {
            if (err instanceof Error && err.name === "AbortError") return
            toast.error("Failed to send message. Please try again.")
            const errorMessage: Message = {
                text: "Something went wrong with our chat service. Please try again.",
                isUser: false,
                timestamp: Date.now(),
            }
            setMessages((prev) => [...prev, errorMessage])
            setStreamingText("")
        } finally {
            setIsLoading(false)
            setIsTyping(false)
        }
    }

    const handleClose = () => {
        abortRef.current?.abort()
        setIsOpen(false)
    }

    return (
        <>
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
                <Button
                    className={`rounded-full shadow-lg px-6 py-6 ${isOpen ? "bg-[#FF6F61] hover:bg-[#e5645a]" : "bg-[#00A699] hover:bg-[#008b80]"}`}
                    onClick={() => (isOpen ? handleClose() : setIsOpen(true))}
                    size="lg"
                >
                    {isOpen ? (
                        <X size={24} className="mr-2" />
                    ) : (
                        <>
                            <Bot size={24} className="mr-2" />
                            <span className="font-medium">AI Trip Assistant</span>
                        </>
                    )}
                </Button>
            </div>
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
                        <div className="bg-[#00A699] text-white p-4 rounded-t-xl flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-xl flex items-center">
                                    <Bot className="mr-2" /> AI Trip Mate
                                </h3>
                                <p className="text-sm opacity-80">Your intelligent travel companion for India</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={handleClose} className="text-white hover:bg-[#008b80]">
                                <X size={24} />
                            </Button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.map((message, index) => (
                                <div key={index} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                                    {!message.isUser && (
                                        <div className="w-8 h-8 rounded-full bg-[#00A699] flex items-center justify-center text-white mr-2 shrink-0">
                                            <Bot size={16} />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[80%] rounded-lg p-3 whitespace-pre-wrap ${
                                            message.isUser
                                                ? "bg-[#00A699] text-white rounded-br-none"
                                                : "bg-gray-100 text-gray-800 rounded-bl-none"
                                        }`}
                                    >
                                        {message.text}
                                    </div>
                                    {message.isUser && (
                                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center ml-2 shrink-0">
                                            <span className="text-xs font-medium">You</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {streamingText && (
                                <div className="flex justify-start">
                                    <div className="w-8 h-8 rounded-full bg-[#00A699] flex items-center justify-center text-white mr-2 shrink-0">
                                        <Bot size={16} />
                                    </div>
                                    <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 text-gray-800 rounded-bl-none whitespace-pre-wrap">
                                        {streamingText}
                                        <span className="inline-block w-1 h-4 bg-gray-400 ml-0.5 animate-pulse align-middle" />
                                    </div>
                                </div>
                            )}
                            {isTyping && !streamingText && (
                                <div className="flex justify-start">
                                    <div className="w-8 h-8 rounded-full bg-[#00A699] flex items-center justify-center text-white mr-2 shrink-0">
                                        <Bot size={16} />
                                    </div>
                                    <div className="bg-gray-100 rounded-lg p-3 rounded-bl-none">
                                        <div className="flex space-x-1 items-center h-5">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "200ms" }} />
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "400ms" }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messageEndRef} />
                        </div>
                        <div className="border-t p-4">
                            {hasWarning && (
                                <div className="mb-2 p-2 bg-yellow-50 text-yellow-800 text-xs rounded-lg">
                                    Please maintain respectful communication. Further inappropriate language may restrict access.
                                </div>
                            )}
                            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                                <Input
                                    type="text"
                                    placeholder="Ask me anything about your trip to India..."
                                    className="flex-1 bg-transparent border-none focus:outline-none shadow-none"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
                                    disabled={isLoading}
                                />
                                <Button
                                    className="rounded-full bg-[#00A699] hover:bg-[#008b80] h-10 w-10 p-0 ml-2"
                                    onClick={handleSendMessage}
                                    disabled={isLoading}
                                >
                                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                </Button>
                            </div>
                            <p className="text-xs text-center text-gray-500 mt-2">
                                Powered by advanced AI to help you plan the perfect Indian adventure
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
