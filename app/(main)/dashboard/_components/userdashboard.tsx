"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
    Calendar, MapPin, Hotel, Compass, Clock, ChevronRight,
    Star, Heart, Bookmark, Bell, PlusCircle, Plane, Luggage
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FadeIn, FadeInUp, SlideInLeft, SlideInRight, StaggerContainer, StaggerItem } from "@/components/motionwrapper"
import Image from "next/image"
import { useSession } from "next-auth/react"

const upcomingTrips = [
    {
        id: "1",
        destination: "Goa",
        image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
        startDate: "May 15, 2024",
        endDate: "May 20, 2024",
        status: "Confirmed",
        progress: 80,
    },
    {
        id: "2",
        destination: "Himachal Pradesh",
        image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80",
        startDate: "July 10, 2024",
        endDate: "July 18, 2024",
        status: "Planning",
        progress: 40,
    },
]

const savedHotels = [
    {
        id: "1",
        name: "Grand Goa Resort",
        location: "Calangute, Goa",
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
        price: "₹12,500",
        rating: 4.8,
    },
    {
        id: "2",
        name: "Himalayan Retreat",
        location: "Manali, Himachal Pradesh",
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
        price: "₹9,800",
        rating: 4.6,
    },
    {
        id: "3",
        name: "Royal Rajasthan Palace",
        location: "Jaipur, Rajasthan",
        image: "https://images.unsplash.com/photo-1607513746994-51f730a44832?w=800&q=80",
        price: "₹15,200",
        rating: 4.9,
    },
]

const savedItineraries = [
    {
        id: "1",
        name: "Goa Beach Vacation",
        days: 6,
        activities: 12,
        lastUpdated: "2 days ago",
    },
    {
        id: "2",
        name: "Himachal Adventure",
        days: 9,
        activities: 18,
        lastUpdated: "1 week ago",
    },
]

const recommendations = [
    {
        id: "1",
        destination: "Kerala",
        image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80",
        description: "Based on your interest in beaches and nature",
    },
    {
        id: "2",
        destination: "Rajasthan",
        image: "https://images.unsplash.com/photo-1477587458883-47145ed6979c?w=800&q=80",
        description: "Based on your interest in cultural experiences",
    },
]

export function UserDashboard() {
    const { data: session } = useSession();

    return (
        <section className="w-full mx-auto px-4">
        <div className="max-w-7xl mx-auto py-12">
            <FadeIn className="mb-8">
                <div className="bg-gradient-to-r from-[#00A699] to-[#008b80] rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <div className="flex items-center mb-4 md:mb-0">
                                <Avatar className="h-12 w-12 mr-4 border-2 border-white">
                                    <AvatarImage src={session?.user?.image as string} alt={session?.user?.name} />
                                    <AvatarFallback>{session?.user?.name}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h1 className="text-xl md:text-2xl font-bold text-white">Welcome back, {session?.user?.name}!</h1>
                                    <p className="text-white text-opacity-90">Ready to plan your next adventure?</p>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button className="bg-white text-[#00A699] hover:bg-gray-100">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {
                    [
                        { title: "Upcoming Trips", value: "2", icon: <Plane className="h-5 w-5" />, color: "bg-blue-500" },
                        { title: "Saved Hotels", value: "8", icon: <Hotel className="h-5 w-5" />, color: "bg-purple-500" },
                        { title: "Saved Itineraries", value: "4", icon: <Compass className="h-5 w-5" />, color: "bg-green-500" },
                        { title: "Travel Wishlist", value: "12", icon: <Heart className="h-5 w-5" />, color: "bg-red-500" },
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            className="bg-white rounded-lg shadow-md overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                            whileHover={{ y: -5 }}
                        >
                            <div className="flex items-center p-4">
                                <div className={`${stat.color} p-3 rounded-full text-white mr-4`}>{stat.icon}</div>
                                <div>
                                    <p className="text-gray-500 text-sm">{stat.title}</p>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))
                }
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <SlideInLeft className="lg:col-span-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle>Upcoming Trips</CardTitle>
                                <CardDescription>Your planned and confirmed travel itineraries</CardDescription>
                            </div>
                            <Button variant="ghost" className="text-[#00A699] hover:text-[#008b80]">
                                View All <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {
                                    upcomingTrips.map((trip, index) => (
                                        <motion.div
                                            key={trip.id}
                                            className="flex flex-col md:flex-row bg-gray-50 rounded-lg overflow-hidden"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1, duration: 0.3 }}
                                            whileHover={{ x: 5 }}
                                        >
                                            <div className="w-full md:w-1/3 h-40 md:h-auto">
                                                <Image
                                                    src={trip.image || "/placeholder.svg"}
                                                    alt={trip.destination}
                                                    className="w-full h-full object-cover"
                                                    height={30}
                                                    width={30}
                                                />
                                            </div>
                                            <div className="p-4 flex-grow">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-lg font-semibold">{trip.destination}</h3>
                                                        <div className="flex items-center text-gray-500 text-sm mt-1">
                                                            <Calendar className="h-4 w-4 mr-1" />
                                                            <span>
                                                                {trip.startDate} - {trip.endDate}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <Badge
                                                        className={`${trip.status === "Confirmed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}
                                                    >
                                                        {trip.status}
                                                    </Badge>
                                                </div>
                                                <div className="mt-4">
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span>Trip planning progress</span>
                                                        <span>{trip.progress}%</span>
                                                    </div>
                                                    <Progress value={trip.progress} className="h-2" />
                                                </div>
                                                <div className="flex justify-end mt-4">
                                                    <Button variant="outline" className="mr-2">
                                                        Edit Plan
                                                    </Button>
                                                    <Button className="bg-[#00A699] hover:bg-[#008b80]">View Details</Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                }
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-center border-t pt-4">
                            <Button variant="outline" className="w-full md:w-auto">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Plan a New Trip
                            </Button>
                        </CardFooter>
                    </Card>
                </SlideInLeft>
                <SlideInRight>
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Personalized Recommendations</CardTitle>
                            <CardDescription>Based on your travel preferences</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {
                                    recommendations.map((rec, index) => (
                                        <motion.div
                                            key={rec.id}
                                            className="relative rounded-lg overflow-hidden h-40"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1, duration: 0.3 }}
                                            whileHover={{ y: -5 }}
                                        >
                                            <Image
                                                src={rec.image || "/placeholder.svg"}
                                                alt={rec.destination}
                                                className="w-full h-full object-cover"
                                                height={30}
                                                width={30}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                                            <div className="absolute bottom-0 left-0 p-4 text-white">
                                                <h3 className="font-semibold text-lg">{rec.destination}</h3>
                                                <p className="text-sm text-white text-opacity-90">{rec.description}</p>
                                            </div>
                                            <Button
                                                className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30"
                                                variant="ghost"
                                            >
                                                <Heart className="h-4 w-4 text-white" />
                                            </Button>
                                        </motion.div>
                                    ))
                                }
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="ghost" className="w-full text-[#00A699]">
                                View More Recommendations
                            </Button>
                        </CardFooter>
                    </Card>
                    <Card>
                        <CardHeader className="bg-[#F4F4F9]">
                            <CardTitle className="flex items-center">
                                <Luggage className="mr-2 h-5 w-5 text-[#00A699]" />
                                Travel Tips
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="space-y-3">
                                {
                                    [
                                        "Pack light and smart for your Goa trip - beach essentials only!",
                                        "Don't forget to book your Himalayan trek guides in advance",
                                        "Monsoon season in Kerala offers lush landscapes at lower prices",
                                    ].map((tip, index) => (
                                        <motion.div
                                            key={index}
                                            className="flex items-start p-2 rounded-md hover:bg-gray-50"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1, duration: 0.3 }}
                                        >
                                            <div className="bg-[#e6f7f6] p-1 rounded-full text-[#00A699] mr-3 mt-0.5 flex-shrink-0">
                                                <Compass className="h-4 w-4" />
                                            </div>
                                            <p className="text-sm text-gray-700">{tip}</p>
                                        </motion.div>
                                    ))
                                }
                            </div>
                        </CardContent>
                    </Card>
                </SlideInRight>
            </div>
            <FadeInUp className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Saved Hotels</h2>
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {
                        savedHotels.map((hotel, index) => (
                            <StaggerItem key={hotel.id} index={index}>
                                <motion.div whileHover={{ y: -10 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}>
                                    <Card className="overflow-hidden h-full flex flex-col">
                                        <div className="relative h-48 overflow-hidden">
                                            <motion.img
                                                src={hotel.image}
                                                alt={hotel.name}
                                                className="w-full h-full object-cover"
                                                whileHover={{ scale: 1.1 }}
                                                transition={{ duration: 0.5 }}
                                            />
                                            <Button className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full bg-white" variant="ghost">
                                                <Heart className="h-4 w-4 text-red-500" fill="#ef4444" />
                                            </Button>
                                        </div>
                                        <CardContent className="p-4 flex-grow">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-semibold">{hotel.name}</h3>
                                                <div className="flex items-center bg-yellow-100 px-2 py-1 rounded text-sm">
                                                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                                    <span className="font-medium">{hotel.rating}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center text-gray-500 text-sm mb-3">
                                                <MapPin className="h-4 w-4 mr-1" />
                                                <span>{hotel.location}</span>
                                            </div>
                                            <div className="flex justify-between items-end mt-4">
                                                <div className="text-lg font-bold text-[#00A699]">{hotel.price}</div>
                                                <Button className="bg-[#00A699] hover:bg-[#008b80]">View Hotel</Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </StaggerItem>
                        ))
                    }
                    <StaggerItem index={savedHotels.length}>
                        <motion.div
                            whileHover={{ y: -10 }}
                            transition={{ type: "spring", stiffness: 300, damping: 10 }}
                            className="h-full"
                        >
                            <Card className="border-dashed border-2 flex items-center justify-center h-full">
                                <CardContent className="p-6 text-center">
                                    <div className="mb-4 text-gray-400">
                                        <PlusCircle className="h-12 w-12 mx-auto" />
                                    </div>
                                    <h3 className="text-lg font-medium mb-2">Find More Hotels</h3>
                                    <p className="text-gray-500 mb-4">Discover and save hotels for your next adventure</p>
                                    <Button className="bg-[#00A699] hover:bg-[#008b80]">Browse Hotels</Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </StaggerItem>
                </StaggerContainer>
            </FadeInUp>
            <FadeInUp className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Saved Itineraries</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {
                        savedItineraries.map((itinerary, index) => (
                            <motion.div
                                key={itinerary.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.3 }}
                                whileHover={{ y: -5 }}
                            >
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-semibold">{itinerary.name}</h3>
                                                <div className="flex items-center text-gray-500 text-sm mt-1">
                                                    <Clock className="h-4 w-4 mr-1" />
                                                    <span>Last updated {itinerary.lastUpdated}</span>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="icon">
                                                <Bookmark className="h-4 w-4 text-[#00A699]" fill="#00A699" />
                                            </Button>
                                        </div>
                                        <div className="flex items-center mt-4 space-x-4">
                                            <div className="bg-gray-100 px-3 py-2 rounded-md">
                                                <p className="text-sm text-gray-500">Days</p>
                                                <p className="text-lg font-bold">{itinerary.days}</p>
                                            </div>
                                            <div className="bg-gray-100 px-3 py-2 rounded-md">
                                                <p className="text-sm text-gray-500">Activities</p>
                                                <p className="text-lg font-bold">{itinerary.activities}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-end mt-4">
                                            <Button variant="outline" className="mr-2">
                                                Edit
                                            </Button>
                                            <Button className="bg-[#00A699] hover:bg-[#008b80]">View Details</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    }
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: savedItineraries.length * 0.1, duration: 0.3 }}
                        whileHover={{ y: -5 }}
                    >
                        <Card className="border-dashed border-2">
                            <CardContent className="p-6 text-center">
                                <div className="mb-4 text-gray-400">
                                    <PlusCircle className="h-12 w-12 mx-auto" />
                                </div>
                                <h3 className="text-lg font-medium mb-2">Create New Itinerary</h3>
                                <p className="text-gray-500 mb-4">Plan your next adventure step by step</p>
                                <Link href="/itinerary-planner">
                                    <Button className="bg-[#00A699] hover:bg-[#008b80]">Start Planning</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </FadeInUp>
        </div>
        </section>
    )
}

