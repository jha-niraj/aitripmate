"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, Phone, MessageCircle, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import Link from "next/link"

interface EmergencyContact {
    name: string
    phone: string
}

interface SOSButtonProps {
    destination?: string
}

export function SOSButton({ destination }: SOSButtonProps) {
    const { data: session } = useSession()
    const [showModal, setShowModal] = useState(false)
    const [contact, setContact] = useState<EmergencyContact | null>(null)
    const [loadingContact, setLoadingContact] = useState(false)

    useEffect(() => {
        if (session?.user?.id && showModal) {
            setLoadingContact(true)
            fetch(`/api/profile?email=${session.user.email}`)
                .then(r => r.json())
                .then(data => {
                    if (data.user?.emergencyContactName && data.user?.emergencyContactPhone) {
                        setContact({
                            name: data.user.emergencyContactName,
                            phone: data.user.emergencyContactPhone,
                        })
                    }
                })
                .catch(() => {})
                .finally(() => setLoadingContact(false))
        }
    }, [session, showModal])

    if (!session) return null

    const locationText = destination
        ? `I may be in an emergency situation near ${destination}, India.`
        : "I may be in an emergency situation while traveling in India."

    const emergencyMessage = `🆘 EMERGENCY ALERT from ${session.user?.name || "Traveler"}\n\n${locationText}\n\nPlease contact me immediately.\n\nSent via AI TripMate`
    const encodedMessage = encodeURIComponent(emergencyMessage)

    const getWhatsAppLink = (phone: string) => {
        const cleanPhone = phone.replace(/[\s\-()]/g, "").replace(/^\+/, "")
        return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
    }

    const getSMSLink = (phone: string) => {
        return `sms:${phone}?body=${encodedMessage}`
    }

    return (
        <>
            <motion.div
                className="fixed bottom-24 right-6 z-40"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.5 }}
            >
                <motion.button
                    className="relative h-14 w-14 rounded-full bg-red-600 text-white shadow-lg flex items-center justify-center"
                    onClick={() => setShowModal(true)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                        boxShadow: ["0 0 0 0 rgba(220,38,38,0.7)", "0 0 0 15px rgba(220,38,38,0)", "0 0 0 0 rgba(220,38,38,0)"],
                    }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    <AlertCircle className="h-7 w-7" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-400 rounded-full animate-ping" />
                </motion.button>
                <p className="text-xs text-center text-red-600 font-bold mt-1">SOS</p>
            </motion.div>

            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 20 }}
                            className="w-full max-w-md"
                        >
                            <Card className="border-2 border-red-300 shadow-2xl">
                                <CardHeader className="bg-red-50 rounded-t-lg">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-red-700 flex items-center gap-2">
                                            <AlertCircle className="h-5 w-5" />
                                            Emergency SOS
                                        </CardTitle>
                                        <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-6">
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                        <p className="text-sm text-red-700 font-medium">Emergency message that will be sent:</p>
                                        <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">{emergencyMessage}</p>
                                    </div>

                                    {loadingContact ? (
                                        <p className="text-sm text-gray-500 text-center">Loading contact info...</p>
                                    ) : contact ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                                <User className="h-4 w-4 text-gray-500" />
                                                <div>
                                                    <p className="text-sm font-medium">{contact.name}</p>
                                                    <p className="text-xs text-gray-500">{contact.phone}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <a
                                                    href={getWhatsAppLink(contact.phone)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-lg py-3 text-sm font-medium transition-colors"
                                                >
                                                    <MessageCircle className="h-4 w-4" />
                                                    WhatsApp
                                                </a>
                                                <a
                                                    href={getSMSLink(contact.phone)}
                                                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 text-sm font-medium transition-colors"
                                                >
                                                    <Phone className="h-4 w-4" />
                                                    SMS
                                                </a>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center space-y-3">
                                            <p className="text-sm text-gray-600">No emergency contact found.</p>
                                            <Link href="/profile">
                                                <Button className="bg-[#00A699] hover:bg-[#008b80] text-white" onClick={() => setShowModal(false)}>
                                                    Add Emergency Contact in Profile
                                                </Button>
                                            </Link>
                                        </div>
                                    )}

                                    <div className="border-t pt-3">
                                        <p className="text-xs text-gray-500 text-center">
                                            National Emergency: 112 | Tourist Helpline: 1800-111-363 | Ambulance: 108
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
