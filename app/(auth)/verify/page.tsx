"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Loader2, Mail, ShieldCheck } from "lucide-react"
import Link from "next/link"

function VerifyForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get("email") || ""

    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [isVerifying, setIsVerifying] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [resendCooldown, setResendCooldown] = useState(0)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    useEffect(() => {
        if (!email) {
            router.push("/signup")
        }
    }, [email, router])

    useEffect(() => {
        if (resendCooldown > 0) {
            const t = setTimeout(() => setResendCooldown(c => c - 1), 1000)
            return () => clearTimeout(t)
        }
    }, [resendCooldown])

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return
        const next = [...otp]
        next[index] = value.slice(-1)
        setOtp(next)
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
        if (pasted.length === 6) {
            setOtp(pasted.split(""))
            inputRefs.current[5]?.focus()
        }
    }

    const handleVerify = async () => {
        const otpString = otp.join("")
        if (otpString.length !== 6) {
            toast.error("Please enter all 6 digits")
            return
        }

        setIsVerifying(true)
        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp: otpString }),
            })

            const data = await res.json()

            if (!res.ok) {
                toast.error(data.message || "Verification failed")
                return
            }

            // Retrieve the temporarily stored password and sign in directly
            const storedPassword = sessionStorage.getItem(`atm_pwd_${email}`)

            if (storedPassword) {
                const result = await signIn("credentials", {
                    email,
                    password: storedPassword,
                    redirect: false,
                })
                sessionStorage.removeItem(`atm_pwd_${email}`)

                if (result?.ok) {
                    toast.success("Email verified! Welcome to AI TripMate 🎉")
                    router.push("/dashboard")
                } else {
                    toast.success("Email verified! Please sign in.")
                    router.push("/signin")
                }
            } else {
                toast.success("Email verified! Please sign in.")
                router.push("/signin")
            }
        } catch {
            toast.error("Something went wrong. Please try again.")
        } finally {
            setIsVerifying(false)
        }
    }

    const handleResend = async () => {
        if (resendCooldown > 0) return
        setIsResending(true)
        try {
            const res = await fetch("/api/auth/resend-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })
            const data = await res.json()
            if (!res.ok) {
                toast.error(data.message || "Failed to resend OTP")
            } else {
                toast.success("New OTP sent to your email")
                setOtp(["", "", "", "", "", ""])
                inputRefs.current[0]?.focus()
                setResendCooldown(60)
            }
        } catch {
            toast.error("Failed to resend OTP")
        } finally {
            setIsResending(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-3 text-center">
                    <div className="flex justify-center">
                        <div className="rounded-full bg-[#e6f7f6] p-4">
                            <ShieldCheck className="h-10 w-10 text-[#00A699]" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
                    <CardDescription className="text-gray-500">
                        We sent a 6-digit code to
                        <span className="block font-medium text-gray-800 mt-1 flex items-center justify-center gap-1">
                            <Mail className="h-4 w-4" />
                            {email}
                        </span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex justify-center gap-2" onPaste={handlePaste}>
                        {otp.map((digit, i) => (
                            <Input
                                key={i}
                                ref={el => { inputRefs.current[i] = el }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={e => handleOtpChange(i, e.target.value)}
                                onKeyDown={e => handleKeyDown(i, e)}
                                className="h-14 w-12 text-center text-xl font-bold border-2 focus:border-[#00A699] focus:ring-[#00A699]"
                                disabled={isVerifying}
                            />
                        ))}
                    </div>

                    <Button
                        onClick={handleVerify}
                        disabled={isVerifying || otp.join("").length !== 6}
                        className="w-full bg-[#00A699] hover:bg-[#008b80] py-6 text-base"
                    >
                        {isVerifying ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Verifying...
                            </>
                        ) : "Verify & Continue"}
                    </Button>

                    <div className="text-center space-y-2">
                        <p className="text-sm text-gray-500">Didn&apos;t receive the code?</p>
                        <Button
                            variant="ghost"
                            onClick={handleResend}
                            disabled={isResending || resendCooldown > 0}
                            className="text-[#00A699] hover:text-[#008b80]"
                        >
                            {isResending ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</>
                            ) : resendCooldown > 0 ? (
                                `Resend in ${resendCooldown}s`
                            ) : "Resend OTP"}
                        </Button>
                    </div>

                    <div className="text-center">
                        <Link href="/signup" className="text-sm text-gray-400 hover:text-gray-600">
                            ← Back to sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default function VerifyPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#00A699]" />
            </div>
        }>
            <VerifyForm />
        </Suspense>
    )
}
