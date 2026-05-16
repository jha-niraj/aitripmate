"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    ChevronDown, ChevronUp, MapPin, Clock, Wallet, AlertCircle,
    Utensils, Hotel, Lightbulb, Package, CheckCircle2, Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { ItineraryData, Activity } from "./aigeneration"

interface Props {
    itinerary: ItineraryData
    onConfirm: () => void
    isConfirming: boolean
    isConfirmed: boolean
}

const categoryColors: Record<string, string> = {
    sightseeing: "bg-blue-100 text-blue-700",
    food: "bg-yellow-100 text-yellow-700",
    transport: "bg-purple-100 text-purple-700",
    accommodation: "bg-green-100 text-green-700",
    activity: "bg-orange-100 text-orange-700",
    shopping: "bg-pink-100 text-pink-700",
}

const categoryIcons: Record<string, string> = {
    sightseeing: "🏛️",
    food: "🍽️",
    transport: "🚗",
    accommodation: "🏨",
    activity: "🎯",
    shopping: "🛍️",
}

function ActivityCard({ activity }: { activity: Activity }) {
    return (
        <div className="flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="text-2xl">{categoryIcons[activity.category] || "📌"}</div>
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                        <p className="font-medium text-gray-900">{activity.name}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3" />{activity.location}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="outline" className={`text-xs ${categoryColors[activity.category] || "bg-gray-100 text-gray-700"}`}>
                            {activity.category}
                        </Badge>
                    </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{activity.time}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{activity.duration}</span>
                    <span className="flex items-center gap-1"><Wallet className="h-3 w-3" />{activity.cost}</span>
                </div>
            </div>
        </div>
    )
}

export function GeneratedItinerary({ itinerary, onConfirm, isConfirming, isConfirmed }: Props) {
    const [expandedDays, setExpandedDays] = useState<number[]>([1])
    const [showPackingList, setShowPackingList] = useState(false)

    const toggleDay = (day: number) => {
        setExpandedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        )
    }

    return (
        <div className="space-y-6">
            <Card className="border-2 border-green-200 bg-green-50">
                <CardHeader>
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div>
                            <CardTitle className="text-2xl text-[#00A699]">{itinerary.tripName}</CardTitle>
                            <p className="text-gray-600 mt-1 flex items-center gap-1">
                                <MapPin className="h-4 w-4" />{itinerary.destination}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Estimated Budget</p>
                            <p className="text-xl font-bold text-[#00A699]">{itinerary.totalBudget}</p>
                        </div>
                    </div>
                    <p className="text-gray-600 mt-3">{itinerary.summary}</p>
                </CardHeader>
            </Card>

            <div className="space-y-4">
                {itinerary.days.map((day) => (
                    <Card key={day.day} className="overflow-hidden">
                        <button
                            className="w-full text-left"
                            onClick={() => toggleDay(day.day)}
                        >
                            <CardHeader className="pb-3 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-[#00A699] text-white flex items-center justify-center font-bold text-sm shrink-0">
                                            D{day.day}
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">Day {day.day}: {day.theme}</CardTitle>
                                            <p className="text-sm text-gray-500">{day.activities.length} activities planned</p>
                                        </div>
                                    </div>
                                    {expandedDays.includes(day.day) ? (
                                        <ChevronUp className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-gray-400" />
                                    )}
                                </div>
                            </CardHeader>
                        </button>
                        <AnimatePresence>
                            {expandedDays.includes(day.day) && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <CardContent className="space-y-4 pt-0">
                                        <div className="space-y-3">
                                            {day.activities.map((activity, idx) => (
                                                <ActivityCard key={idx} activity={activity} />
                                            ))}
                                        </div>
                                        <Separator />
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="flex items-start gap-2">
                                                <Utensils className="h-4 w-4 text-[#00A699] mt-1 shrink-0" />
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Meals</p>
                                                    <p className="text-sm text-gray-700">🌅 {day.meals.breakfast}</p>
                                                    <p className="text-sm text-gray-700">☀️ {day.meals.lunch}</p>
                                                    <p className="text-sm text-gray-700">🌙 {day.meals.dinner}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <Hotel className="h-4 w-4 text-[#00A699] mt-1 shrink-0" />
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Stay</p>
                                                    <p className="text-sm text-gray-700">{day.accommodation}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <Lightbulb className="h-4 w-4 text-[#00A699] mt-1 shrink-0" />
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Tip</p>
                                                    <p className="text-sm text-gray-700">{day.tips}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Card>
                ))}
            </div>

            {itinerary.importantNotes.length > 0 && (
                <Card className="border-amber-200 bg-amber-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-amber-800">
                            <AlertCircle className="h-5 w-5" /> Important Notes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {itinerary.importantNotes.map((note, i) => (
                                <li key={i} className="flex items-start gap-2 text-amber-700">
                                    <span className="mt-1">•</span>
                                    <span className="text-sm">{note}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            <Card>
                <button className="w-full text-left" onClick={() => setShowPackingList(!showPackingList)}>
                    <CardHeader className="hover:bg-gray-50 transition-colors">
                        <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-[#00A699]" /> Packing List
                            </span>
                            {showPackingList ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </CardTitle>
                    </CardHeader>
                </button>
                <AnimatePresence>
                    {showPackingList && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                        >
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {itinerary.packingList.map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                            <CheckCircle2 className="h-4 w-4 text-[#00A699] shrink-0" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>

            {!isConfirmed ? (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                        onClick={onConfirm}
                        disabled={isConfirming}
                        className="w-full bg-[#00A699] hover:bg-[#008b80] text-white py-6 text-lg"
                    >
                        {isConfirming ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Checking safety alerts...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="mr-2 h-5 w-5" />
                                Confirm Trip & Check Safety
                            </>
                        )}
                    </Button>
                </motion.div>
            ) : (
                <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3 text-green-700">
                            <CheckCircle2 className="h-6 w-6" />
                            <div>
                                <p className="font-semibold">Trip Confirmed!</p>
                                <p className="text-sm">Your itinerary has been saved. Have a safe and wonderful trip!</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
