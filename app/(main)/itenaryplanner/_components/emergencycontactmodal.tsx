"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Phone, User, Shield, Loader2, SkipForward, CheckCircle, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

interface Props {
    tripId: string
    onConfirmed: () => void
    onSkip: () => void
}

export function EmergencyContactModal({ tripId, onConfirmed, onSkip }: Props) {
    const { data: session } = useSession()
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [saving, setSaving] = useState(false)
    const [loadingContact, setLoadingContact] = useState(true)
    const [existingContact, setExistingContact] = useState<{ name: string; phone: string } | null>(null)
    const [editMode, setEditMode] = useState(false)

    useEffect(() => {
        const fetchExistingContact = async () => {
            if (!session?.user?.email) {
                setLoadingContact(false)
                return
            }
            try {
                const response = await fetch(`/api/profile?email=${encodeURIComponent(session.user.email)}`)
                if (response.ok) {
                    const data = await response.json()
                    const { emergencyContactName, emergencyContactPhone } = data.user
                    if (emergencyContactName && emergencyContactPhone) {
                        setExistingContact({ name: emergencyContactName, phone: emergencyContactPhone })
                        setName(emergencyContactName)
                        setPhone(emergencyContactPhone)
                    } else {
                        setEditMode(true)
                    }
                } else {
                    setEditMode(true)
                }
            } catch {
                setEditMode(true)
            } finally {
                setLoadingContact(false)
            }
        }
        fetchExistingContact()
    }, [session])

    const confirmTrip = async (contactName?: string, contactPhone?: string) => {
        setSaving(true)
        try {
            const body: Record<string, string> = { tripId }
            if (contactName) body.emergencyContactName = contactName
            if (contactPhone) body.emergencyContactPhone = contactPhone

            const response = await fetch("/api/itinerary/confirm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || "Failed to confirm")
            }

            toast.success("Trip confirmed! Have a safe journey!")
            onConfirmed()
        } catch (err) {
            const error = err as Error
            toast.error(error.message || "Failed to confirm trip")
        } finally {
            setSaving(false)
        }
    }

    const handleUseExisting = () => confirmTrip()

    const handleSaveNew = async () => {
        if (!name.trim() || !phone.trim()) {
            toast.error("Please enter both name and phone number")
            return
        }
        if (!/^\+?[\d\s-]{10,15}$/.test(phone.trim())) {
            toast.error("Please enter a valid phone number")
            return
        }
        await confirmTrip(name.trim(), phone.trim())
    }

    const handleSkip = async () => {
        try {
            await fetch("/api/itinerary/confirm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tripId }),
            })
        } catch {
            // ignore
        }
        onSkip()
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 20 }}
                className="w-full max-w-md"
            >
                <Card className="border-2 border-[#00A699]/30 shadow-2xl">
                    <CardHeader className="bg-[#00A699]/10 rounded-t-lg">
                        <div className="flex items-center gap-3">
                            <Shield className="h-6 w-6 text-[#00A699]" />
                            <div>
                                <CardTitle>Emergency Contact</CardTitle>
                                <CardDescription>
                                    {existingContact && !editMode
                                        ? "Your saved contact will be used for this trip"
                                        : "Add a contact before confirming your trip"}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {loadingContact ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-[#00A699]" />
                            </div>
                        ) : existingContact && !editMode ? (
                            <div className="space-y-4">
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                        <p className="font-medium text-green-800">Saved Emergency Contact</p>
                                    </div>
                                    <div className="space-y-1 pl-7">
                                        <div className="flex items-center gap-2 text-green-700">
                                            <User className="h-4 w-4" />
                                            <span className="font-medium">{existingContact.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-green-700">
                                            <Phone className="h-4 w-4" />
                                            <span>{existingContact.phone}</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500">
                                    This contact will receive SOS alerts if you need help during your trip.
                                </p>
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => {
                                            setEditMode(true)
                                        }}
                                        disabled={saving}
                                    >
                                        <Edit2 className="h-4 w-4 mr-2" />
                                        Update Contact
                                    </Button>
                                    <Button
                                        className="flex-1 bg-[#00A699] hover:bg-[#008b80]"
                                        onClick={handleUseExisting}
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        ) : (
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                        )}
                                        Confirm Trip
                                    </Button>
                                </div>
                                <Button
                                    variant="ghost"
                                    className="w-full text-gray-400 hover:text-gray-600"
                                    onClick={handleSkip}
                                    disabled={saving}
                                >
                                    Skip for now
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {existingContact && editMode && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                        <p className="text-sm text-blue-700">
                                            Updating your emergency contact. This will also update your profile.
                                        </p>
                                    </div>
                                )}
                                <p className="text-sm text-gray-600">
                                    In case of emergency during your trip, who should we contact? This is also used for our SOS feature.
                                </p>
                                <div className="space-y-2">
                                    <Label htmlFor="ec-name" className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-[#00A699]" />
                                        Contact Name
                                    </Label>
                                    <Input
                                        id="ec-name"
                                        placeholder="e.g. Mom, Dad, John"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ec-phone" className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-[#00A699]" />
                                        Phone Number (with country code)
                                    </Label>
                                    <Input
                                        id="ec-phone"
                                        placeholder="e.g. +91 98765 43210"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    {existingContact ? (
                                        <Button
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => setEditMode(false)}
                                            disabled={saving}
                                        >
                                            Cancel
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            className="flex-1"
                                            onClick={handleSkip}
                                            disabled={saving}
                                        >
                                            <SkipForward className="h-4 w-4 mr-2" />
                                            Skip for now
                                        </Button>
                                    )}
                                    <Button
                                        className="flex-1 bg-[#00A699] hover:bg-[#008b80]"
                                        onClick={handleSaveNew}
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        ) : (
                                            <Shield className="h-4 w-4 mr-2" />
                                        )}
                                        Save & Confirm
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    )
}
