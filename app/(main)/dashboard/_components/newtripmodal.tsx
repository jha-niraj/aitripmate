"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    X, MapPin, Calendar, Users, Wallet, Tag,
    ChevronRight, ChevronLeft, Check, Loader2, Search, Sparkles, Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import Link from "next/link"
import Image from "next/image"

export interface CreatedTrip {
    id: string
    destination: string
    date: string
    image?: string | null
    days?: number | null
    budget?: string | null
    travelType?: string | null
    interests?: string[]
    confirmed: boolean
    itinerary?: null
    createdAt: string
}

interface Props {
    userId: string
    onClose: () => void
    onCreated: (trip: CreatedTrip) => void
}

const DESTINATIONS = [
    { name: "Goa", tag: "Beaches", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&q=80" },
    { name: "Manali", tag: "Mountains", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&q=80" },
    { name: "Jaipur", tag: "Culture", image: "https://images.unsplash.com/photo-1477587458883-47145ed6979c?w=400&q=80" },
    { name: "Kerala", tag: "Nature", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&q=80" },
    { name: "Delhi", tag: "Heritage", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&q=80" },
    { name: "Mumbai", tag: "City Life", image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&q=80" },
    { name: "Shimla", tag: "Hills", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80" },
    { name: "Varanasi", tag: "Spiritual", image: "https://images.unsplash.com/photo-1561361058-c24e03a50b28?w=400&q=80" },
    { name: "Udaipur", tag: "Royal", image: "https://images.unsplash.com/photo-1542973219-6f93f8e2a776?w=400&q=80" },
    { name: "Agra", tag: "Heritage", image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=400&q=80" },
    { name: "Leh-Ladakh", tag: "Adventure", image: "https://images.unsplash.com/photo-1589793907316-f94025b46850?w=400&q=80" },
    { name: "Rishikesh", tag: "Wellness", image: "https://images.unsplash.com/photo-1585016495481-81541b20e46a?w=400&q=80" },
]

const DESTINATION_IMAGES: Record<string, string> = {
    "Goa": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
    "Manali": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80",
    "Jaipur": "https://images.unsplash.com/photo-1477587458883-47145ed6979c?w=800&q=80",
    "Rajasthan": "https://images.unsplash.com/photo-1477587458883-47145ed6979c?w=800&q=80",
    "Kerala": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80",
    "Delhi": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80",
    "Mumbai": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80",
    "Shimla": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    "Varanasi": "https://images.unsplash.com/photo-1561361058-c24e03a50b28?w=800&q=80",
    "Udaipur": "https://images.unsplash.com/photo-1542973219-6f93f8e2a776?w=800&q=80",
    "Agra": "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
    "Leh-Ladakh": "https://images.unsplash.com/photo-1589793907316-f94025b46850?w=800&q=80",
    "Rishikesh": "https://images.unsplash.com/photo-1585016495481-81541b20e46a?w=800&q=80",
    "Darjeeling": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
}

const TRAVEL_TYPES = [
    { value: "solo", label: "Solo", emoji: "🧳" },
    { value: "couple", label: "Couple", emoji: "💑" },
    { value: "family", label: "Family", emoji: "👨‍👩‍👧‍👦" },
    { value: "group", label: "Group", emoji: "👥" },
]

const BUDGETS = [
    { value: "budget", label: "Budget", sublabel: "₹1k–5k/day", emoji: "💸" },
    { value: "mid-range", label: "Mid-Range", sublabel: "₹5k–15k/day", emoji: "💳" },
    { value: "luxury", label: "Luxury", sublabel: "₹15k+/day", emoji: "💎" },
]

const INTERESTS = [
    "Adventure", "Culture", "Beaches", "Mountains", "Food & Cuisine",
    "Wildlife", "Photography", "Shopping", "Wellness", "Nightlife",
    "History", "Local Experiences",
]

function getDestinationImage(name: string): string {
    if (DESTINATION_IMAGES[name]) return DESTINATION_IMAGES[name]
    for (const [key, img] of Object.entries(DESTINATION_IMAGES)) {
        if (name.toLowerCase().includes(key.toLowerCase())) return img
    }
    return "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80"
}

export function NewTripModal({ userId, onClose, onCreated }: Props) {
    const [step, setStep] = useState(1)
    const [destination, setDestination] = useState("")
    const [customDestination, setCustomDestination] = useState("")
    const [startDate, setStartDate] = useState("")
    const [days, setDays] = useState("3")
    const [travelType, setTravelType] = useState("")
    const [budget, setBudget] = useState("")
    const [selectedInterests, setSelectedInterests] = useState<string[]>([])
    const [saving, setSaving] = useState(false)
    const [createdTrip, setCreatedTrip] = useState<CreatedTrip | null>(null)
    const [search, setSearch] = useState("")

    const finalDestination = destination === "__custom__" ? customDestination : destination
    const filteredDests = DESTINATIONS.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) || d.tag.toLowerCase().includes(search.toLowerCase())
    )

    const toggleInterest = (interest: string) => {
        setSelectedInterests(prev =>
            prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
        )
    }

    const handleCreate = async () => {
        if (!finalDestination || !startDate || !days) {
            toast.error("Please fill in destination and start date")
            return
        }
        setSaving(true)
        try {
            const image = getDestinationImage(finalDestination)
            const res = await fetch("/api/profile/trips", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    destination: finalDestination,
                    date: startDate,
                    image,
                    days: parseInt(days),
                    budget: budget || null,
                    travelType: travelType || null,
                    interests: selectedInterests,
                }),
            })
            if (!res.ok) throw new Error("Failed to create trip")
            const data = await res.json()
            const trip: CreatedTrip = {
                ...data.trip,
                date: new Date(data.trip.date).toISOString(),
                createdAt: new Date(data.trip.createdAt).toISOString(),
            }
            setCreatedTrip(trip)
            onCreated(trip)
            setStep(3)
        } catch {
            toast.error("Failed to create trip. Please try again.")
        } finally {
            setSaving(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
            <motion.div
                initial={{ scale: 0.92, opacity: 0, y: 24 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.92, opacity: 0, y: 24 }}
                transition={{ type: "spring", damping: 22, stiffness: 300 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-[#00A699] to-[#008b80] p-5 text-white flex items-center justify-between flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-bold">Plan a New Trip</h2>
                        <p className="text-white/75 text-sm mt-0.5">
                            {step === 1 ? "Where do you want to go?" : step === 2 ? "Fill in your travel details" : "Your trip is ready!"}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Step indicator */}
                {step < 3 && (
                    <div className="flex items-center px-6 py-3 border-b bg-gray-50 flex-shrink-0">
                        {[1, 2].map((s, i) => (
                            <div key={s} className="flex items-center">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                                    s < step
                                        ? "bg-[#00A699] text-white"
                                        : s === step
                                        ? "bg-[#00A699] text-white ring-4 ring-[#00A699]/20"
                                        : "bg-gray-200 text-gray-500"
                                }`}>
                                    {s < step ? <Check className="h-3.5 w-3.5" /> : s}
                                </div>
                                <span className={`ml-2 text-sm font-medium ${s === step ? "text-[#00A699]" : "text-gray-400"}`}>
                                    {s === 1 ? "Destination" : "Details"}
                                </span>
                                {i < 1 && <div className="w-8 h-0.5 mx-3 bg-gray-200" />}
                            </div>
                        ))}
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                transition={{ duration: 0.2 }}
                                className="p-6"
                            >
                                {/* Search */}
                                <div className="relative mb-4">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search destinations..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>

                                {/* Destination grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                                    {filteredDests.map((dest) => (
                                        <motion.button
                                            key={dest.name}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => {
                                                setDestination(dest.name)
                                                setCustomDestination("")
                                            }}
                                            className={`relative rounded-xl overflow-hidden h-28 text-left border-2 transition-all ${
                                                destination === dest.name
                                                    ? "border-[#00A699] ring-2 ring-[#00A699]/25"
                                                    : "border-transparent hover:border-gray-300"
                                            }`}
                                        >
                                            <Image
                                                src={dest.image}
                                                alt={dest.name}
                                                fill
                                                className="object-cover"
                                                sizes="200px"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                                            {destination === dest.name && (
                                                <div className="absolute top-2 right-2 bg-[#00A699] rounded-full p-0.5">
                                                    <Check className="h-3 w-3 text-white" />
                                                </div>
                                            )}
                                            <div className="absolute bottom-0 left-0 p-2.5">
                                                <div className="text-white text-sm font-semibold leading-tight">{dest.name}</div>
                                                <div className="text-white/70 text-xs">{dest.tag}</div>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>

                                {/* Custom destination */}
                                <div className="border-t pt-4">
                                    <Label className="text-sm text-gray-500 mb-2 block flex items-center gap-1.5">
                                        <MapPin className="h-3.5 w-3.5" />
                                        Or enter any destination
                                    </Label>
                                    <Input
                                        placeholder="e.g. Coorg, Andaman, Mysore, Ooty..."
                                        value={customDestination}
                                        onChange={(e) => {
                                            setCustomDestination(e.target.value)
                                            setDestination(e.target.value ? "__custom__" : "")
                                        }}
                                        className={
                                            destination === "__custom__" && customDestination
                                                ? "border-[#00A699] ring-1 ring-[#00A699]/30"
                                                : ""
                                        }
                                    />
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                transition={{ duration: 0.2 }}
                                className="p-6 space-y-6"
                            >
                                {/* Destination tag */}
                                <div className="flex items-center gap-2 bg-[#e6f7f6] rounded-lg px-4 py-2.5">
                                    <MapPin className="h-4 w-4 text-[#00A699] flex-shrink-0" />
                                    <span className="font-semibold text-[#00A699]">{finalDestination}</span>
                                </div>

                                {/* Dates */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="start-date" className="flex items-center gap-1.5 mb-2 text-sm">
                                            <Calendar className="h-3.5 w-3.5 text-[#00A699]" />
                                            Start Date <span className="text-red-400">*</span>
                                        </Label>
                                        <Input
                                            id="start-date"
                                            type="date"
                                            value={startDate}
                                            min={new Date().toISOString().split("T")[0]}
                                            onChange={(e) => setStartDate(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="days" className="flex items-center gap-1.5 mb-2 text-sm">
                                            <Clock className="h-3.5 w-3.5 text-[#00A699]" />
                                            Number of Days <span className="text-red-400">*</span>
                                        </Label>
                                        <Input
                                            id="days"
                                            type="number"
                                            min="1"
                                            max="30"
                                            value={days}
                                            onChange={(e) => setDays(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Travel Type */}
                                <div>
                                    <Label className="flex items-center gap-1.5 mb-3 text-sm">
                                        <Users className="h-3.5 w-3.5 text-[#00A699]" />
                                        Who&apos;s Traveling?
                                    </Label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {TRAVEL_TYPES.map((type) => (
                                            <button
                                                key={type.value}
                                                type="button"
                                                onClick={() => setTravelType(prev => prev === type.value ? "" : type.value)}
                                                className={`p-3 rounded-xl border-2 text-center transition-all ${
                                                    travelType === type.value
                                                        ? "border-[#00A699] bg-[#e6f7f6]"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                            >
                                                <div className="text-2xl mb-1">{type.emoji}</div>
                                                <div className="text-xs font-medium">{type.label}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Budget */}
                                <div>
                                    <Label className="flex items-center gap-1.5 mb-3 text-sm">
                                        <Wallet className="h-3.5 w-3.5 text-[#00A699]" />
                                        Budget Range
                                    </Label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {BUDGETS.map((b) => (
                                            <button
                                                key={b.value}
                                                type="button"
                                                onClick={() => setBudget(prev => prev === b.value ? "" : b.value)}
                                                className={`p-3 rounded-xl border-2 text-center transition-all ${
                                                    budget === b.value
                                                        ? "border-[#00A699] bg-[#e6f7f6]"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                            >
                                                <div className="text-xl mb-1">{b.emoji}</div>
                                                <div className="text-xs font-semibold">{b.label}</div>
                                                <div className="text-xs text-gray-400 mt-0.5">{b.sublabel}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Interests */}
                                <div>
                                    <Label className="flex items-center gap-1.5 mb-3 text-sm">
                                        <Tag className="h-3.5 w-3.5 text-[#00A699]" />
                                        Interests <span className="text-gray-400 font-normal">(optional)</span>
                                    </Label>
                                    <div className="flex flex-wrap gap-2">
                                        {INTERESTS.map((interest) => (
                                            <button
                                                key={interest}
                                                type="button"
                                                onClick={() => toggleInterest(interest)}
                                                className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                                                    selectedInterests.includes(interest)
                                                        ? "bg-[#00A699] text-white border-[#00A699]"
                                                        : "border-gray-200 text-gray-600 hover:border-[#00A699] hover:text-[#00A699]"
                                                }`}
                                            >
                                                {interest}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && createdTrip && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className="p-8 text-center"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", damping: 14, delay: 0.1 }}
                                    className="w-20 h-20 bg-gradient-to-br from-[#00A699] to-[#008b80] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                                >
                                    <Check className="h-10 w-10 text-white" />
                                </motion.div>
                                <h3 className="text-2xl font-bold mb-2">Trip Created! 🎉</h3>
                                <p className="text-gray-500 mb-2">
                                    Your trip to{" "}
                                    <span className="font-semibold text-[#00A699]">{createdTrip.destination}</span>{" "}
                                    has been added to your dashboard.
                                </p>
                                <p className="text-sm text-gray-400 mb-8">
                                    Now generate an AI itinerary or plan manually in the Itinerary Planner.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Link href="/itenaryplanner">
                                        <Button className="bg-[#00A699] hover:bg-[#008b80] w-full sm:w-auto">
                                            <Sparkles className="h-4 w-4 mr-2" />
                                            Generate AI Itinerary
                                        </Button>
                                    </Link>
                                    <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                                        Back to Dashboard
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                {step < 3 && (
                    <div className="border-t px-6 py-4 flex justify-between items-center flex-shrink-0 bg-gray-50">
                        {step > 1 ? (
                            <Button variant="outline" onClick={() => setStep(step - 1)} disabled={saving}>
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Back
                            </Button>
                        ) : (
                            <Button variant="ghost" onClick={onClose} className="text-gray-400">
                                Cancel
                            </Button>
                        )}
                        {step === 1 ? (
                            <Button
                                className="bg-[#00A699] hover:bg-[#008b80]"
                                onClick={() => setStep(2)}
                                disabled={!finalDestination}
                            >
                                Continue
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        ) : (
                            <Button
                                className="bg-[#00A699] hover:bg-[#008b80] min-w-[120px]"
                                onClick={handleCreate}
                                disabled={saving || !startDate || !days}
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Creating...
                                    </>
                                ) : (
                                    "Create Trip"
                                )}
                            </Button>
                        )}
                    </div>
                )}
            </motion.div>
        </motion.div>
    )
}
