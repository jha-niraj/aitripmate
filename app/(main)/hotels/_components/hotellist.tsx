"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, MapPin, Wifi, Coffee, Utensils, Dumbbell, Car, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StaggerContainer, StaggerItem, FadeIn } from "@/components/motionwrapper"

interface Hotel {
    id: string
    name: string
    image: string
    description: string
    price: number
    rating: number
    location: string
    amenities: string[]
    type: string
}

interface HotelsListProps {
    destination: string
}

export function HotelsList({ destination }: HotelsListProps) {
    const [priceRange, setPriceRange] = useState([1000, 20000])
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedType, setSelectedType] = useState<string>("")
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
    const [showFilters, setShowFilters] = useState(false)

    const hotelImages = [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
        "https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&q=80",
        "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=800&q=80",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
        "https://images.unsplash.com/photo-1562778612-e1e0cda9915c?w=800&q=80",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80",
        "https://images.unsplash.com/photo-1607513746994-51f730a44832?w=800&q=80",
    ]

    // Generate hotels based on destination
    const generateHotels = (dest: string): Hotel[] => {
        const hotelTypes = ["Luxury Hotel", "Budget Hotel", "Resort", "Boutique Hotel", "Homestay"]
        const amenitiesList = ["Free Wi-Fi", "Swimming Pool", "Restaurant", "Gym", "Parking", "Room Service", "Spa", "Bar"]

        // Create a set of hotels for the destination
        return Array.from({ length: 12 }, (_, i) => {
            const type = hotelTypes[i % hotelTypes.length]
            const basePrice = type === "Luxury Hotel" || type === "Resort" ? 10000 : 3000
            const priceVariation = Math.floor(Math.random() * 5000)

            return {
                id: `hotel-${dest.toLowerCase()}-${i + 1}`,
                name: `${type === "Homestay" ? "Cozy" : type === "Luxury Hotel" ? "Grand" : type === "Resort" ? "Serene" : "Comfort"} ${dest} ${type === "Homestay" ? "Stay" : type === "Budget Hotel" ? "Inn" : "Hotel"} ${i + 1}`,
                image: hotelImages[i % hotelImages.length],
                description: `Experience the best of ${dest} at this ${type.toLowerCase()}. Located in a ${i % 2 === 0 ? "central" : "scenic"} area, offering comfortable accommodations and excellent service.`,
                price: basePrice + priceVariation,
                rating: 3 + Math.random() * 2,
                location: `${i % 3 === 0 ? "Downtown" : i % 3 === 1 ? "Riverside" : "Hillside"} Area, ${dest}`,
                amenities: amenitiesList.slice(0, 4 + (i % 4)).sort(() => Math.random() - 0.5),
                type: type,
            }
        })
    }

    const hotels = generateHotels(destination)

    // Filter hotels based on search, price range, type, and amenities
    const filteredHotels = hotels.filter((hotel) => {
        const matchesSearch =
            hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            hotel.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            hotel.location.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesPrice = hotel.price >= priceRange[0] && hotel.price <= priceRange[1]

        const matchesType = selectedType ? hotel.type === selectedType : true

        const matchesAmenities =
            selectedAmenities.length > 0 ? selectedAmenities.every((amenity) => hotel.amenities.includes(amenity)) : true

        return matchesSearch && matchesPrice && matchesType && matchesAmenities
    })

    const getAmenityIcon = (amenity: string) => {
        switch (amenity) {
            case "Free Wi-Fi":
                return <Wifi className="h-4 w-4" />
            case "Restaurant":
                return <Utensils className="h-4 w-4" />
            case "Gym":
                return <Dumbbell className="h-4 w-4" />
            case "Parking":
                return <Car className="h-4 w-4" />
            default:
                return <Coffee className="h-4 w-4" />
        }
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(price)
    }

    const toggleAmenity = (amenity: string) => {
        setSelectedAmenities((prev) => (prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]))
    }

    return (
        <div>
            <FadeIn className="mb-8">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="w-full md:w-1/2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Search hotels by name, features or location..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Select value={selectedType} onValueChange={setSelectedType}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Hotel Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="Luxury Hotel">Luxury Hotel</SelectItem>
                                <SelectItem value="Budget Hotel">Budget Hotel</SelectItem>
                                <SelectItem value="Resort">Resort</SelectItem>
                                <SelectItem value="Boutique Hotel">Boutique Hotel</SelectItem>
                                <SelectItem value="Homestay">Homestay</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowFilters(!showFilters)}>
                            <Filter className="h-4 w-4" />
                            Filters
                        </Button>
                    </div>
                </div>
                {
                    showFilters && (
                        <motion.div
                            className="bg-gray-50 p-4 rounded-lg mt-4"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-medium mb-3">Price Range</h3>
                                    <div className="px-3">
                                        <Slider
                                            defaultValue={[1000, 20000]}
                                            min={1000}
                                            max={20000}
                                            step={500}
                                            value={priceRange}
                                            onValueChange={setPriceRange}
                                            className="mb-2"
                                        />
                                        <div className="flex justify-between text-sm text-gray-500">
                                            <span>{formatPrice(priceRange[0])}</span>
                                            <span>{formatPrice(priceRange[1])}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-medium mb-3">Amenities</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {
                                            ["Free Wi-Fi", "Swimming Pool", "Restaurant", "Gym", "Parking", "Room Service"].map((amenity) => (
                                                <div key={amenity} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`amenity-${amenity}`}
                                                        checked={selectedAmenities.includes(amenity)}
                                                        onCheckedChange={() => toggleAmenity(amenity)}
                                                    />
                                                    <Label htmlFor={`amenity-${amenity}`} className="text-sm cursor-pointer">
                                                        {amenity}
                                                    </Label>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )
                }
            </FadeIn>
            <div className="mb-6">
                <p className="text-gray-500">
                    {filteredHotels.length} {filteredHotels.length === 1 ? "hotel" : "hotels"} found in {destination}
                </p>
            </div>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {
                    filteredHotels.length > 0 ? (
                        filteredHotels.map((hotel, index) => (
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
                                            <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-md text-sm font-medium text-[#00A699]">
                                                {hotel.type}
                                            </div>
                                        </div>
                                        <CardContent className="p-5 flex-grow flex flex-col">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-semibold">{hotel.name}</h3>
                                                <div className="flex items-center bg-yellow-100 px-2 py-1 rounded text-sm">
                                                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                                    <span className="font-medium">{hotel.rating.toFixed(1)}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center text-gray-500 text-sm mb-3">
                                                <MapPin className="h-4 w-4 mr-1" />
                                                <span>{hotel.location}</span>
                                            </div>
                                            <p className="text-gray-600 mb-4 flex-grow">{hotel.description}</p>
                                            <div className="mb-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {
                                                        hotel.amenities.slice(0, 4).map((amenity, i) => (
                                                            <span key={i} className="text-xs flex items-center bg-gray-100 px-2 py-1 rounded-full">
                                                                {getAmenityIcon(amenity)}
                                                                <span className="ml-1">{amenity}</span>
                                                            </span>
                                                        ))
                                                    }
                                                    {
                                                        hotel.amenities.length > 4 && (
                                                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                                                +{hotel.amenities.length - 4} more
                                                            </span>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <span className="text-gray-500 text-sm">per night</span>
                                                    <div className="text-xl font-bold text-[#00A699]">{formatPrice(hotel.price)}</div>
                                                </div>
                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                    <Button className="bg-[#00A699] hover:bg-[#008b80]">Book Now</Button>
                                                </motion.div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </StaggerItem>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                                <p className="text-xl text-gray-500 mb-4">No hotels match your search criteria</p>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchQuery("")
                                        setPriceRange([1000, 20000])
                                        setSelectedType("")
                                        setSelectedAmenities([])
                                    }}
                                >
                                    Reset Filters
                                </Button>
                            </motion.div>
                        </div>
                    )
                }
            </StaggerContainer>
        </div>
    )
}