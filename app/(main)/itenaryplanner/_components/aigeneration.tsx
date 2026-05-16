"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, MapPin, Calendar, Wallet, Users, Heart, Loader2, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { GeneratedItinerary } from "./generateditinerary"
import { SafetyAlertModal } from "./safetyalertmodal"
import { EmergencyContactModal } from "./emergencycontactmodal"

const INTERESTS = [
    "Adventure", "Nature", "Food & Cuisine", "Culture & Heritage",
    "Relaxation", "Shopping", "Photography", "Nightlife", "Wildlife", "Spirituality"
]

export interface ItineraryData {
    tripName: string
    destination: string
    summary: string
    totalBudget: string
    destinationType: string
    days: DayPlan[]
    packingList: string[]
    importantNotes: string[]
    emergencyNumbers: Record<string, string>
}

export interface DayPlan {
    day: number
    theme: string
    activities: Activity[]
    meals: { breakfast: string; lunch: string; dinner: string }
    accommodation: string
    tips: string
}

export interface Activity {
    time: string
    name: string
    location: string
    description: string
    duration: string
    cost: string
    category: string
}

export interface SafetyData {
    riskLevel: string
    riskSummary: string
    alerts: SafetyAlert[]
    safetyTips: string[]
    bestTimeToVisit: string
    localEmergencyInfo: string
}

export interface SafetyAlert {
    type: string
    severity: string
    title: string
    description: string
    icon: string
}

export function AIGeneration() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [destination, setDestination] = useState("")
    const [days, setDays] = useState("3")
    const [budget, setBudget] = useState("")
    const [travelType, setTravelType] = useState("")
    const [selectedInterests, setSelectedInterests] = useState<string[]>([])
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedItinerary, setGeneratedItinerary] = useState<ItineraryData | null>(null)
    const [tripId, setTripId] = useState<string | null>(null)

    const [showSafety, setShowSafety] = useState(false)
    const [safetyData, setSafetyData] = useState<SafetyData | null>(null)
    const [isCheckingSafety, setIsCheckingSafety] = useState(false)

    const [showEmergencyContact, setShowEmergencyContact] = useState(false)
    const [tripConfirmed, setTripConfirmed] = useState(false)

    const toggleInterest = (interest: string) => {
        setSelectedInterests(prev =>
            prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
        )
    }

    const handleGenerate = async () => {
        if (status === "unauthenticated" || !session) {
            toast.error("Please sign in to generate an itinerary")
            router.push("/signin")
            return
        }

        if (!destination.trim() || !budget || !travelType) {
            toast.error("Please fill in all required fields")
            return
        }

        setIsGenerating(true)
        setGeneratedItinerary(null)
        setTripConfirmed(false)

        try {
            const response = await fetch("/api/itinerary/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    destination: destination.trim(),
                    days: Number(days),
                    budget,
                    travelType,
                    interests: selectedInterests,
                }),
            })

            const data = await response.json()

            if (response.status === 401) {
                toast.error("Please sign in to generate an itinerary")
                router.push("/signin")
                return
            }

            if (!response.ok) {
                throw new Error(data.error || "Failed to generate itinerary")
            }

            setGeneratedItinerary(data.itinerary)
            setTripId(data.tripId)
            toast.success("Itinerary generated successfully!")
        } catch (err) {
            const error = err as Error
            toast.error(error.message || "Failed to generate itinerary")
        } finally {
            setIsGenerating(false)
        }
    }

    const handleConfirmTrip = async () => {
        if (!generatedItinerary || !tripId) return

        setIsCheckingSafety(true)
        try {
            const response = await fetch("/api/safety/check", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    destination: generatedItinerary.destination,
                    destinationType: generatedItinerary.destinationType,
                    tripId,
                }),
            })

            const data = await response.json()
            if (response.status === 401) { router.push("/signin"); return }
            if (!response.ok) throw new Error(data.error || "Safety check failed")

            setSafetyData(data.safety)
            setShowSafety(true)
        } catch (err) {
            const error = err as Error
            toast.error(error.message || "Safety check failed")
        } finally {
            setIsCheckingSafety(false)
        }
    }

    const handleContinueAfterSafety = () => {
        setShowSafety(false)
        setShowEmergencyContact(true)
    }

    const handleTripConfirmed = () => {
        setShowEmergencyContact(false)
        setTripConfirmed(true)
        toast.success("Trip confirmed! Have a safe journey!")
    }

    if (status === "unauthenticated") {
        return (
            <Card className="border-2 border-[#00A699]/20 text-center py-16">
                <CardContent className="space-y-4">
                    <div className="flex justify-center">
                        <div className="h-16 w-16 rounded-full bg-[#e6f7f6] flex items-center justify-center">
                            <LogIn className="h-8 w-8 text-[#00A699]" />
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold">Sign in to generate itineraries</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                        Create a free account to build AI-powered travel itineraries, check safety alerts, and confirm trips.
                    </p>
                    <div className="flex gap-3 justify-center pt-2">
                        <Button className="bg-[#00A699] hover:bg-[#008b80]" onClick={() => router.push("/signin")}>
                            Sign In
                        </Button>
                        <Button variant="outline" onClick={() => router.push("/signup")}>
                            Create Account
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-8">
            <Card className="border-2 border-[#00A699]/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <Sparkles className="h-6 w-6 text-[#00A699]" />
                        AI Trip Generator
                    </CardTitle>
                    <CardDescription>
                        Tell us about your dream trip and our AI will create a personalized day-by-day itinerary
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="destination" className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-[#00A699]" />
                                Destination *
                            </Label>
                            <Input
                                id="destination"
                                placeholder="e.g. Manali, Goa, Jaipur, Kerala..."
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="days" className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-[#00A699]" />
                                Number of Days *
                            </Label>
                            <Select value={days} onValueChange={setDays}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select days" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[1, 2, 3, 4, 5, 6, 7, 10, 14].map(d => (
                                        <SelectItem key={d} value={String(d)}>{d} {d === 1 ? "Day" : "Days"}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Wallet className="h-4 w-4 text-[#00A699]" />
                                Budget *
                            </Label>
                            <Select value={budget} onValueChange={setBudget}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select budget range" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Budget">Budget (under ₹2,000/day)</SelectItem>
                                    <SelectItem value="Mid-range">Mid-range (₹2,000–₹5,000/day)</SelectItem>
                                    <SelectItem value="Luxury">Luxury (above ₹5,000/day)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-[#00A699]" />
                                Travel Type *
                            </Label>
                            <Select value={travelType} onValueChange={setTravelType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Who are you traveling with?" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Solo">Solo Adventure</SelectItem>
                                    <SelectItem value="Couple">Couple Getaway</SelectItem>
                                    <SelectItem value="Friends">Friends Group</SelectItem>
                                    <SelectItem value="Family">Family Trip</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-[#00A699]" />
                            Interests (select all that apply)
                        </Label>
                        <div className="flex flex-wrap gap-2">
                            {INTERESTS.map(interest => (
                                <motion.div key={interest} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Badge
                                        variant={selectedInterests.includes(interest) ? "default" : "outline"}
                                        className={`cursor-pointer text-sm py-1 px-3 ${
                                            selectedInterests.includes(interest)
                                                ? "bg-[#00A699] text-white border-[#00A699]"
                                                : "hover:border-[#00A699] hover:text-[#00A699]"
                                        }`}
                                        onClick={() => toggleInterest(interest)}
                                    >
                                        {interest}
                                    </Badge>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            onClick={handleGenerate}
                            disabled={isGenerating || !destination.trim() || !budget || !travelType}
                            className="w-full bg-[#00A699] hover:bg-[#008b80] text-white py-6 text-lg"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Generating your perfect itinerary...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-5 w-5" />
                                    Generate AI Itinerary
                                </>
                            )}
                        </Button>
                    </motion.div>
                </CardContent>
            </Card>

            {generatedItinerary && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <GeneratedItinerary
                        itinerary={generatedItinerary}
                        onConfirm={handleConfirmTrip}
                        isConfirming={isCheckingSafety}
                        isConfirmed={tripConfirmed}
                    />
                </motion.div>
            )}

            {showSafety && safetyData && (
                <SafetyAlertModal
                    safetyData={safetyData}
                    destination={generatedItinerary?.destination || ""}
                    onContinue={handleContinueAfterSafety}
                    onModify={() => {
                        setShowSafety(false)
                        setGeneratedItinerary(null)
                        toast.info("Modify your trip details above and regenerate")
                    }}
                    onCancel={() => {
                        setShowSafety(false)
                        setGeneratedItinerary(null)
                        setTripId(null)
                        toast.info("Trip cancelled. Plan a different destination!")
                    }}
                />
            )}

            {showEmergencyContact && tripId && (
                <EmergencyContactModal
                    tripId={tripId}
                    onConfirmed={handleTripConfirmed}
                    onSkip={handleTripConfirmed}
                />
            )}

            {tripConfirmed && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed bottom-8 right-8 z-40"
                >
                </motion.div>
            )}
        </div>
    )
}
