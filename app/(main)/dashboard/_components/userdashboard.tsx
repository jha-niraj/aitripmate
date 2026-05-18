"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
    Calendar, Compass, ChevronRight,
    Heart, Bell, PlusCircle, Plane, Loader2,
    Trophy, CheckCircle2, Sparkles, Luggage, Hotel, MapPin
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FadeIn, FadeInUp, SlideInLeft, SlideInRight, StaggerContainer, StaggerItem } from "@/components/motionwrapper"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { format } from "date-fns"
import { NewTripModal, type CreatedTrip } from "./newtripmodal"

interface DashboardTrip {
    id: string
    destination: string
    date: string
    image?: string | null
    days?: number | null
    budget?: string | null
    travelType?: string | null
    interests?: string[]
    itinerary?: unknown
    confirmed: boolean
    createdAt: string
}

interface ItineraryDays {
    days: { activities?: unknown[] }[]
}

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

const RECOMMENDATIONS = [
    { id: "1", destination: "Kerala", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80", description: "Backwaters, tea gardens & wildlife" },
    { id: "2", destination: "Rajasthan", image: "https://images.unsplash.com/photo-1477587458883-47145ed6979c?w=800&q=80", description: "Palaces, forts & desert culture" },
]

function getTripImage(trip: DashboardTrip): string {
    if (trip.image) return trip.image
    for (const [key, img] of Object.entries(DESTINATION_IMAGES)) {
        if (trip.destination.toLowerCase().includes(key.toLowerCase())) return img
    }
    return "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80"
}

function getTripStatus(trip: DashboardTrip): { label: string; className: string } {
    const isPast = new Date(trip.date) < new Date()
    if (trip.confirmed && isPast) return { label: "Completed", className: "bg-gray-100 text-gray-700" }
    if (trip.confirmed) return { label: "Confirmed", className: "bg-green-100 text-green-800" }
    if (trip.itinerary) return { label: "Planning", className: "bg-blue-100 text-blue-800" }
    return { label: "Draft", className: "bg-amber-100 text-amber-800" }
}

function getTripProgress(trip: DashboardTrip): number {
    const isPast = new Date(trip.date) < new Date()
    if (trip.confirmed && isPast) return 100
    if (trip.confirmed) return 85
    if (trip.itinerary) return 55
    return 15
}

function countActivities(itinerary: unknown): number {
    if (!itinerary || typeof itinerary !== "object") return 0
    const data = itinerary as ItineraryDays
    if (!Array.isArray(data.days)) return 0
    return data.days.reduce((sum, day) => sum + (day.activities?.length || 0), 0)
}

function travelTypeLabel(type?: string | null): string | null {
    if (!type) return null
    const map: Record<string, string> = {
        solo: "🧳 Solo", couple: "💑 Couple", family: "👨‍👩‍👧‍👦 Family", group: "👥 Group",
    }
    return map[type] || type
}

export function UserDashboard() {
    const { data: session } = useSession()
    const [trips, setTrips] = useState<DashboardTrip[]>([])
    const [userId, setUserId] = useState("")
    const [loading, setLoading] = useState(true)
    const [showNewTrip, setShowNewTrip] = useState(false)

    const fetchData = useCallback(async () => {
        if (!session?.user?.email) { setLoading(false); return }
        try {
            const profileRes = await fetch(`/api/profile?email=${encodeURIComponent(session.user.email)}`)
            if (!profileRes.ok) throw new Error()
            const profileData = await profileRes.json()
            const uid: string = profileData.user.id
            setUserId(uid)

            const tripsRes = await fetch(`/api/profile/trips?userId=${uid}`)
            if (!tripsRes.ok) throw new Error()
            const tripsData = await tripsRes.json()
            setTrips(tripsData.trips || [])
        } catch {
            toast.error("Failed to load dashboard")
        } finally {
            setLoading(false)
        }
    }, [session])

    useEffect(() => { fetchData() }, [fetchData])

    const handleTripCreated = (trip: CreatedTrip) => {
        const newTrip: DashboardTrip = {
            ...trip,
            itinerary: null,
            interests: trip.interests || [],
        }
        setTrips(prev => [newTrip, ...prev])
    }

    const tripsWithItinerary = trips.filter(t => t.itinerary)
    const confirmedTrips = trips.filter(t => t.confirmed)
    const completedTrips = trips.filter(t => t.confirmed && new Date(t.date) < new Date())

    const stats = [
        { title: "Total Trips", value: trips.length, icon: <Plane className="h-5 w-5" />, color: "bg-blue-500" },
        { title: "With Itinerary", value: tripsWithItinerary.length, icon: <Compass className="h-5 w-5" />, color: "bg-green-500" },
        { title: "Confirmed", value: confirmedTrips.length, icon: <CheckCircle2 className="h-5 w-5" />, color: "bg-[#00A699]" },
        { title: "Completed", value: completedTrips.length, icon: <Trophy className="h-5 w-5" />, color: "bg-amber-500" },
    ]

    return (
        <section className="w-full mx-auto px-4">
            <div className="max-w-7xl mx-auto py-12">
                {/* Welcome Banner */}
                <FadeIn className="mb-8">
                    <div className="bg-gradient-to-r from-[#00A699] to-[#008b80] rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6 md:p-8">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center">
                                    <Avatar className="h-12 w-12 mr-4 border-2 border-white shadow">
                                        <AvatarImage src={session?.user?.image as string} alt={session?.user?.name || ""} />
                                        <AvatarFallback>{session?.user?.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h1 className="text-xl md:text-2xl font-bold text-white">
                                            Welcome back, {session?.user?.name}!
                                        </h1>
                                        <p className="text-white/75 text-sm mt-0.5">Ready to plan your next adventure?</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            className="bg-white text-[#00A699] hover:bg-gray-100 font-semibold shadow"
                                            onClick={() => setShowNewTrip(true)}
                                        >
                                            <PlusCircle className="mr-2 h-4 w-4" />
                                            New Trip
                                        </Button>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="outline"
                                            className="bg-transparent text-white border-white hover:bg-white hover:text-[#00A699]"
                                        >
                                            <Bell className="mr-2 h-4 w-4" />
                                            Notifications
                                        </Button>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeIn>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            className="bg-white rounded-xl shadow-md overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08, duration: 0.3 }}
                            whileHover={{ y: -4 }}
                        >
                            <div className="flex items-center p-4 gap-3">
                                <div className={`${stat.color} p-3 rounded-full text-white flex-shrink-0`}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs">{stat.title}</p>
                                    <p className="text-2xl font-bold">
                                        {loading
                                            ? <Loader2 className="h-5 w-5 animate-spin text-gray-300 mt-1" />
                                            : stat.value
                                        }
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* My Trips */}
                    <SlideInLeft className="lg:col-span-2">
                        <Card className="shadow-md">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div>
                                    <CardTitle>My Trips</CardTitle>
                                    <CardDescription>Your travel plans and itineraries</CardDescription>
                                </div>
                                <Link href="/itenaryplanner">
                                    <Button variant="ghost" className="text-[#00A699] hover:text-[#008b80] text-sm">
                                        View All <ChevronRight className="ml-1 h-4 w-4" />
                                    </Button>
                                </Link>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="h-8 w-8 animate-spin text-[#00A699]" />
                                    </div>
                                ) : trips.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="mb-4 text-gray-200">
                                            <Plane className="h-16 w-16 mx-auto" />
                                        </div>
                                        <h3 className="text-lg font-semibold mb-1">No trips yet</h3>
                                        <p className="text-gray-500 text-sm mb-6">
                                            Start planning your first adventure!
                                        </p>
                                        <Button
                                            className="bg-[#00A699] hover:bg-[#008b80]"
                                            onClick={() => setShowNewTrip(true)}
                                        >
                                            <PlusCircle className="mr-2 h-4 w-4" />
                                            Plan Your First Trip
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {trips.slice(0, 3).map((trip, index) => {
                                            const status = getTripStatus(trip)
                                            const progress = getTripProgress(trip)
                                            const image = getTripImage(trip)
                                            const typeLabel = travelTypeLabel(trip.travelType)
                                            return (
                                                <motion.div
                                                    key={trip.id}
                                                    className="flex flex-col md:flex-row bg-gray-50 rounded-xl overflow-hidden border border-gray-100"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1, duration: 0.3 }}
                                                    whileHover={{ x: 4 }}
                                                >
                                                    <div className="w-full md:w-[160px] h-36 md:h-auto relative flex-shrink-0">
                                                        <Image
                                                            src={image}
                                                            alt={trip.destination}
                                                            fill
                                                            className="object-cover"
                                                            sizes="(max-width: 768px) 100vw, 160px"
                                                        />
                                                    </div>
                                                    <div className="p-4 flex-grow">
                                                        <div className="flex justify-between items-start gap-2">
                                                            <div>
                                                                <h3 className="text-base font-semibold">{trip.destination}</h3>
                                                                <div className="flex items-center text-gray-500 text-sm mt-0.5">
                                                                    <Calendar className="h-3.5 w-3.5 mr-1" />
                                                                    {format(new Date(trip.date), "MMM d, yyyy")}
                                                                    {trip.days ? ` · ${trip.days} day${trip.days > 1 ? "s" : ""}` : ""}
                                                                </div>
                                                                {typeLabel && (
                                                                    <div className="text-gray-400 text-xs mt-0.5">{typeLabel}</div>
                                                                )}
                                                            </div>
                                                            <Badge className={`text-xs flex-shrink-0 ${status.className}`}>
                                                                {status.label}
                                                            </Badge>
                                                        </div>
                                                        <div className="mt-3">
                                                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                                <span>Planning progress</span>
                                                                <span>{progress}%</span>
                                                            </div>
                                                            <Progress value={progress} className="h-1.5" />
                                                        </div>
                                                        <div className="flex justify-end mt-3 gap-2">
                                                            <Link href="/itenaryplanner">
                                                                <Button variant="outline" size="sm" className="text-xs h-8">
                                                                    Edit Plan
                                                                </Button>
                                                            </Link>
                                                            <Link href="/itenaryplanner">
                                                                <Button size="sm" className="bg-[#00A699] hover:bg-[#008b80] text-xs h-8">
                                                                    View Details
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )
                                        })}
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="flex justify-center border-t pt-4">
                                <Button
                                    variant="outline"
                                    className="w-full md:w-auto"
                                    onClick={() => setShowNewTrip(true)}
                                >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Plan a New Trip
                                </Button>
                            </CardFooter>
                        </Card>
                    </SlideInLeft>

                    {/* Right column */}
                    <SlideInRight className="space-y-6">
                        {/* Recommendations */}
                        <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle>Explore Destinations</CardTitle>
                                <CardDescription>Popular places to visit</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {RECOMMENDATIONS.map((rec, index) => (
                                        <motion.div
                                            key={rec.id}
                                            className="relative rounded-xl overflow-hidden h-36 cursor-pointer"
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1, duration: 0.3 }}
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <Image
                                                src={rec.image}
                                                alt={rec.destination}
                                                fill
                                                className="object-cover"
                                                sizes="400px"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                                            <div className="absolute bottom-0 left-0 p-3 text-white">
                                                <h3 className="font-semibold">{rec.destination}</h3>
                                                <p className="text-xs text-white/80">{rec.description}</p>
                                            </div>
                                            <button
                                                className="absolute top-2 right-2 h-7 w-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition-colors"
                                                onClick={() => setShowNewTrip(true)}
                                            >
                                                <Heart className="h-3.5 w-3.5 text-white" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Link href="/itenaryplanner" className="w-full">
                                    <Button variant="ghost" className="w-full text-[#00A699] hover:text-[#008b80]">
                                        <Sparkles className="h-4 w-4 mr-2" />
                                        Generate AI Itinerary
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>

                        {/* Travel Tips */}
                        <Card className="shadow-md">
                            <CardHeader className="bg-[#F4F4F9] rounded-t-xl">
                                <CardTitle className="flex items-center text-base">
                                    <Luggage className="mr-2 h-5 w-5 text-[#00A699]" />
                                    Travel Tips
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-2">
                                    {[
                                        "Book flights 6–8 weeks early for the best fares",
                                        "Always carry copies of your important documents",
                                        "Research local emergency numbers before you travel",
                                    ].map((tip, index) => (
                                        <motion.div
                                            key={index}
                                            className="flex items-start p-2 rounded-lg hover:bg-gray-50"
                                            initial={{ opacity: 0, x: 16 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1, duration: 0.3 }}
                                        >
                                            <div className="bg-[#e6f7f6] p-1.5 rounded-full text-[#00A699] mr-3 mt-0.5 flex-shrink-0">
                                                <Compass className="h-3.5 w-3.5" />
                                            </div>
                                            <p className="text-sm text-gray-600">{tip}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </SlideInRight>
                </div>

                {/* AI-Generated Itineraries */}
                {!loading && tripsWithItinerary.length > 0 && (
                    <FadeInUp className="mt-10">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold">AI-Generated Itineraries</h2>
                            <Link href="/itenaryplanner">
                                <Button variant="ghost" className="text-[#00A699] hover:text-[#008b80] text-sm">
                                    View All <ChevronRight className="ml-1 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {tripsWithItinerary.map((trip, index) => {
                                const activityCount = countActivities(trip.itinerary)
                                const image = getTripImage(trip)
                                return (
                                    <StaggerItem key={trip.id} index={index}>
                                        <motion.div
                                            whileHover={{ y: -6 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 12 }}
                                        >
                                            <Card className="overflow-hidden h-full flex flex-col shadow-md">
                                                <div className="relative h-36 flex-shrink-0">
                                                    <Image
                                                        src={image}
                                                        alt={trip.destination}
                                                        fill
                                                        className="object-cover"
                                                        sizes="400px"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                                    <div className="absolute bottom-3 left-3 text-white">
                                                        <h3 className="font-bold text-base leading-tight">{trip.destination}</h3>
                                                        <div className="flex items-center text-xs text-white/80 mt-0.5">
                                                            <Calendar className="h-3 w-3 mr-1" />
                                                            {format(new Date(trip.date), "MMM d, yyyy")}
                                                        </div>
                                                    </div>
                                                    {trip.confirmed && (
                                                        <div className="absolute top-2 right-2">
                                                            <Badge className="bg-green-500 text-white text-xs py-0.5">Confirmed</Badge>
                                                        </div>
                                                    )}
                                                </div>
                                                <CardContent className="p-4 flex-grow">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="bg-gray-100 px-3 py-2 rounded-lg flex-1 text-center">
                                                            <p className="text-xs text-gray-500">Days</p>
                                                            <p className="text-lg font-bold">{trip.days || "–"}</p>
                                                        </div>
                                                        <div className="bg-gray-100 px-3 py-2 rounded-lg flex-1 text-center">
                                                            <p className="text-xs text-gray-500">Activities</p>
                                                            <p className="text-lg font-bold">{activityCount}</p>
                                                        </div>
                                                        {trip.budget && (
                                                            <div className="bg-gray-100 px-3 py-2 rounded-lg flex-1 text-center">
                                                                <p className="text-xs text-gray-500">Budget</p>
                                                                <p className="text-xs font-semibold capitalize mt-1">{trip.budget}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Link href="/itenaryplanner" className="flex-1">
                                                            <Button variant="outline" size="sm" className="w-full h-8 text-xs">
                                                                Edit
                                                            </Button>
                                                        </Link>
                                                        <Link href="/itenaryplanner" className="flex-1">
                                                            <Button size="sm" className="w-full h-8 text-xs bg-[#00A699] hover:bg-[#008b80]">
                                                                View
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </StaggerItem>
                                )
                            })}

                            {/* Create new CTA */}
                            <StaggerItem index={tripsWithItinerary.length}>
                                <motion.div
                                    whileHover={{ y: -6 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 12 }}
                                    className="h-full"
                                >
                                    <Card className="border-dashed border-2 flex items-center justify-center h-full min-h-[220px] shadow-sm">
                                        <CardContent className="p-6 text-center">
                                            <div className="mb-3 text-gray-300">
                                                <Sparkles className="h-12 w-12 mx-auto" />
                                            </div>
                                            <h3 className="text-base font-semibold mb-1">Generate AI Itinerary</h3>
                                            <p className="text-gray-500 text-sm mb-4">Let AI plan your perfect trip</p>
                                            <Link href="/itenaryplanner">
                                                <Button className="bg-[#00A699] hover:bg-[#008b80]">Start Planning</Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </StaggerItem>
                        </StaggerContainer>
                    </FadeInUp>
                )}

                {/* Quick Actions — shown when user has no trips yet */}
                {!loading && trips.length === 0 && (
                    <FadeInUp className="mt-10">
                        <h2 className="text-xl font-bold mb-4">Get Started</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                {
                                    icon: <PlusCircle className="h-10 w-10 mx-auto mb-3 text-[#00A699]" />,
                                    title: "Create a Trip",
                                    desc: "Start planning your next adventure",
                                    action: () => setShowNewTrip(true),
                                    href: null,
                                },
                                {
                                    icon: <Sparkles className="h-10 w-10 mx-auto mb-3 text-[#00A699]" />,
                                    title: "AI Itinerary",
                                    desc: "Generate a full trip plan with AI",
                                    action: null,
                                    href: "/itenaryplanner",
                                },
                                {
                                    icon: <Hotel className="h-10 w-10 mx-auto mb-3 text-[#00A699]" />,
                                    title: "Browse Hotels",
                                    desc: "Find the perfect stay",
                                    action: null,
                                    href: "/hotels",
                                },
                            ].map((item, i) => {
                                const inner = (
                                    <Card className="border-dashed border-2 hover:border-[#00A699] hover:shadow-md transition-all cursor-pointer h-full">
                                        <CardContent className="p-6 text-center">
                                            {item.icon}
                                            <h3 className="font-semibold">{item.title}</h3>
                                            <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                                        </CardContent>
                                    </Card>
                                )
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        whileHover={{ y: -4 }}
                                        onClick={item.action || undefined}
                                    >
                                        {item.href ? <Link href={item.href}>{inner}</Link> : inner}
                                    </motion.div>
                                )
                            })}
                        </div>
                    </FadeInUp>
                )}

                {/* Footer: "Saved Itineraries" CTA for users with trips but no AI itinerary */}
                {!loading && trips.length > 0 && tripsWithItinerary.length === 0 && (
                    <FadeInUp className="mt-10">
                        <Card className="bg-gradient-to-r from-[#e6f7f6] to-[#f0fafa] border-[#00A699]/20 shadow-sm">
                            <CardContent className="p-6 flex flex-col md:flex-row items-center gap-4 justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-[#00A699]/10 p-3 rounded-full">
                                        <Sparkles className="h-7 w-7 text-[#00A699]" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Ready to plan in detail?</h3>
                                        <p className="text-gray-600 text-sm">
                                            Generate an AI-powered day-by-day itinerary for your trip to{" "}
                                            <span className="font-medium text-[#00A699]">{trips[0]?.destination}</span>
                                        </p>
                                    </div>
                                </div>
                                <Link href="/itenaryplanner" className="flex-shrink-0">
                                    <Button className="bg-[#00A699] hover:bg-[#008b80] shadow">
                                        <Sparkles className="h-4 w-4 mr-2" />
                                        Generate Itinerary
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </FadeInUp>
                )}

                {/* Show all trips count if more than 3 */}
                {!loading && trips.length > 3 && (
                    <FadeInUp className="mt-6 text-center">
                        <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                            <MapPin className="h-4 w-4 text-[#00A699]" />
                            You have <span className="font-semibold text-[#00A699]">{trips.length} trips</span> in total
                            <Link href="/itenaryplanner">
                                <Button variant="link" className="text-[#00A699] p-0 h-auto text-sm">
                                    — View all in Planner
                                </Button>
                            </Link>
                        </div>
                    </FadeInUp>
                )}
            </div>

            {/* New Trip Modal */}
            <AnimatePresence>
                {showNewTrip && userId && (
                    <NewTripModal
                        userId={userId}
                        onClose={() => setShowNewTrip(false)}
                        onCreated={handleTripCreated}
                    />
                )}
            </AnimatePresence>
        </section>
    )
}
