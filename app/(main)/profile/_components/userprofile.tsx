"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { User, MapPin, Calendar, Settings, Edit, Camera, Globe, Heart, Compass } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FadeIn, FadeInUp, SlideInLeft } from "@/components/motionwrapper"
import { ProfileSettings } from "./userprofilesettings"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { format } from "date-fns"
import { toast } from "sonner"
import { useUserStore } from "@/store/userStore"

// Using interfaces from userStore

export function UserProfile() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState("profile");
    const settingsTabRef = useRef<HTMLDivElement>(null);
    
    // Use the user store instead of local state
    const { 
        userData, 
        trips, 
        reviews, 
        loading, 
        setUserData, 
        setTrips, 
        setReviews, 
        setLoading 
    } = useUserStore();

    useEffect(() => {
        const fetchUserData = async () => {
            if (session?.user?.email) {
                setLoading(true);
                try {
                    // Fetch user profile data
                    const response = await fetch(`/api/profile?email=${session.user.email}`);
                    if (!response.ok) throw new Error('Failed to fetch user data');
                    const data = await response.json();
                    setUserData(data.user);

                    // Fetch user trips
                    const tripsResponse = await fetch(`/api/profile/trips?userId=${data.user.id}`);
                    if (tripsResponse.ok) {
                        const tripsData = await tripsResponse.json();
                        setTrips(tripsData.trips);
                    }

                    // Fetch user reviews
                    const reviewsResponse = await fetch(`/api/profile/reviews?userId=${data.user.id}`);
                    if (reviewsResponse.ok) {
                        const reviewsData = await reviewsResponse.json();
                        setReviews(reviewsData.reviews);
                    }
                } catch (error) {
                    console.error('Error fetching profile data:', error);
                    toast.error('Failed to load profile data');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUserData();
    }, [session, setUserData, setTrips, setReviews, setLoading]);

    // If no user data and loading, show a simple loading state
    if (!userData && loading) {
        return (
            <div className="py-20 flex justify-center items-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00A699] mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading profile...</p>
                </div>
            </div>
        );
    }

    // If no user data and not loading, there was likely an error or the user isn't logged in
    if (!userData && !loading) {
        return (
            <div className="py-20 flex justify-center items-center min-h-[60vh]">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Unable to load profile data.</p>
                    <Button variant="outline" onClick={() => window.location.reload()}>
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="py-20">
            <div className="relative h-[30vh] min-h-[200px] w-full overflow-hidden">
                <motion.div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url('${userData?.coverPhoto || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600&q=80'}')`,
                        filter: "brightness(0.8)",
                    }}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5 }}
                />
                {
                    !loading && (
                        <motion.button
                            className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                                setActiveTab("settings");
                                setTimeout(() => {
                                    settingsTabRef.current?.scrollIntoView({ behavior: 'smooth' });
                                }, 100);
                            }}
                        >
                            <Camera size={20} />
                        </motion.button>
                    )
                }
            </div>
            <div className="mx-auto px-4 relative z-10">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex flex-col md:flex-row">
                        <div className="flex-shrink-0 flex justify-center md:justify-start mb-4 md:mb-0">
                            <div className="relative">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Avatar className="h-32 w-32 border-4 border-white shadow-md">
                                        <AvatarImage src={userData?.image} alt={userData?.name} />
                                        <AvatarFallback>{userData?.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </motion.div>
                                <motion.button
                                    className="absolute bottom-0 right-0 bg-[#00A699] text-white p-2 rounded-full"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => {
                                        setActiveTab("settings");
                                        setTimeout(() => {
                                            settingsTabRef.current?.scrollIntoView({ behavior: 'smooth' });
                                        }, 100);
                                    }}
                                >
                                    <Edit size={16} />
                                </motion.button>
                            </div>
                        </div>
                        <div className="md:ml-6 flex-grow text-center md:text-left">
                            <FadeInUp>
                                <h1 className="text-2xl font-bold">{userData?.name}</h1>
                                <p className="text-gray-500 flex items-center justify-center md:justify-start mt-1">
                                    <User className="h-4 w-4 mr-1" />@{userData?.username || 'user'}
                                </p>
                                <div className="flex items-center justify-center md:justify-start mt-1 text-gray-500">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    <span>{userData?.location || 'Not specified'}</span>
                                </div>
                                <div className="flex items-center justify-center md:justify-start mt-1 text-gray-500">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    <span>Member since {userData?.createdAt ? format(new Date(userData.createdAt), 'MMMM yyyy') : 'Recently'}</span>
                                </div>
                                <p className="mt-3 text-gray-700">{userData?.bio || 'No bio provided yet.'}</p>
                            </FadeInUp>
                        </div>
                        <div className="mt-4 md:mt-0 flex justify-center md:justify-end">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button 
                                    variant="outline" 
                                    className="flex items-center gap-2" 
                                    onClick={() => {
                                        setActiveTab("settings");
                                        setTimeout(() => {
                                            settingsTabRef.current?.scrollIntoView({ behavior: 'smooth' });
                                        }, 100);
                                    }}
                                >
                                    <Settings size={16} />
                                    Edit Profile
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                    <FadeIn className="mt-6">
                        <h3 className="text-lg font-semibold mb-2 flex items-center">
                            <Compass className="h-5 w-5 mr-2 text-[#00A699]" />
                            Travel Preferences
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {
                                (userData?.travelPreferences || []).map((pref, index) => (
                                    <motion.div
                                        key={pref}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1, duration: 0.3 }}
                                    >
                                        <Badge variant="outline" className="bg-[#e6f7f6] text-[#00A699] hover:bg-[#d0f0ee]">
                                            {pref}
                                        </Badge>
                                    </motion.div>
                                ))
                            }
                        </div>
                    </FadeIn>
                    <FadeIn className="mt-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {
                                [
                                    { label: "Trips Completed", value: userData?.tripsCompleted || 0, icon: <Globe className="h-5 w-5" /> },
                                    { label: "Places Visited", value: userData?.placesVisited || 0, icon: <MapPin className="h-5 w-5" /> },
                                    { label: "Reviews Posted", value: userData?.reviewsPosted || 0, icon: <Heart className="h-5 w-5" /> },
                                    { label: "Photos Uploaded", value: userData?.photosUploaded || 0, icon: <Camera className="h-5 w-5" /> },
                                ].map((stat, index) => (
                                    <motion.div
                                        key={stat.label}
                                        className="bg-gray-50 p-4 rounded-lg text-center"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1, duration: 0.3 }}
                                        whileHover={{ y: -5 }}
                                    >
                                        <div className="flex justify-center text-[#00A699] mb-2">{stat.icon}</div>
                                        <div className="text-2xl font-bold">{stat.value}</div>
                                        <div className="text-gray-500 text-sm">{stat.label}</div>
                                    </motion.div>
                                ))
                            }
                        </div>
                    </FadeIn>
                </div>
                <div className="mt-8">
                    <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="profile">Profile</TabsTrigger>
                            <TabsTrigger value="settings">Settings</TabsTrigger>
                        </TabsList>
                        <TabsContent value="profile">
                            <SlideInLeft className="bg-white rounded-lg shadow-lg p-6 mt-4">
                                <h2 className="text-xl font-semibold mb-4">Travel History</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {
                                        loading ? (
                                            <div className="col-span-3 text-center py-8">Loading travel history...</div>
                                        ) : trips.length > 0 ? (
                                            trips.map((trip, index) => (
                                                <motion.div
                                                    key={index}
                                                    className="flex items-center p-3 border rounded-lg hover:bg-gray-50"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1, duration: 0.3 }}
                                                    whileHover={{ x: 5 }}
                                                >
                                                    <Image
                                                        src={trip.image || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=200&q=80"}
                                                        alt={trip.destination}
                                                        className="w-16 h-16 object-cover rounded-md mr-4"
                                                        height={64}
                                                        width={64}
                                                    />
                                                    <div>
                                                        <h3 className="font-medium">{trip.destination}</h3>
                                                        <p className="text-gray-500 text-sm">{format(new Date(trip.date), 'MMMM yyyy')}</p>
                                                    </div>
                                                </motion.div>
                                            ))
                                        ) : (
                                            <div className="col-span-3 text-center py-8 text-gray-500">
                                                No travel history found. Add your first trip in settings!
                                            </div>
                                        )
                                    }
                                </div>
                                <h2 className="text-xl font-semibold mt-8 mb-4">Reviews</h2>
                                <div className="space-y-4">
                                    {
                                        loading ? (
                                            <div className="text-center py-8">Loading reviews...</div>
                                        ) : reviews.length > 0 ? (
                                            reviews.map((review, index) => (
                                                <motion.div
                                                    key={index}
                                                    className="p-4 border rounded-lg"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1, duration: 0.3 }}
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="font-medium">{review.place}</h3>
                                                        <div className="flex items-center bg-yellow-100 px-2 py-1 rounded text-sm">
                                                            <span className="text-yellow-700">★</span>
                                                            <span className="ml-1 font-medium">{review.rating}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-700 mb-2">{review.comment}</p>
                                                    <p className="text-gray-500 text-sm">{format(new Date(review.date), 'MMMM d, yyyy')}</p>
                                                </motion.div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                No reviews found. Share your travel experiences!
                                            </div>
                                        )
                                    }
                                </div>
                            </SlideInLeft>
                        </TabsContent>
                        <TabsContent value="settings" ref={settingsTabRef}>
                            <ProfileSettings />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}