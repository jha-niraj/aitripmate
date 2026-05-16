"use client"

import { Calendar, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { StaggerContainer, StaggerItem, HoverScale } from "@/components/motionwrapper"

interface Package {
    id: string
    title: string
    destination: string
    image: string
    duration: string
    price: number
    discount?: number
    rating: number
    tags: string[]
}

export function TravelPackages() {
    const packages: Package[] = [
        {
            id: "1",
            title: "Magical Maharashtra",
            destination: "Maharashtra",
            image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&q=80",
            duration: "5 days, 4 nights",
            price: 24999,
            discount: 15,
            rating: 4.7,
            tags: ["Cultural", "Beach", "Heritage"],
        },
        {
            id: "2",
            title: "Himalayan Adventure",
            destination: "Himachal Pradesh",
            image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80",
            duration: "6 days, 5 nights",
            price: 29999,
            rating: 4.8,
            tags: ["Adventure", "Mountains", "Trekking"],
        },
        {
            id: "3",
            title: "Royal Rajasthan Tour",
            destination: "Rajasthan",
            image: "https://images.unsplash.com/photo-1477587458883-47145ed6979c?w=800&q=80",
            duration: "7 days, 6 nights",
            price: 34999,
            discount: 10,
            rating: 4.9,
            tags: ["Heritage", "Cultural", "Luxury"],
        },
        {
            id: "4",
            title: "Kerala Backwaters Escape",
            destination: "Kerala",
            image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80",
            duration: "5 days, 4 nights",
            price: 27999,
            rating: 4.6,
            tags: ["Backwaters", "Nature", "Relaxation"],
        },
        {
            id: "5",
            title: "Goa Beach Holiday",
            destination: "Goa",
            image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
            duration: "4 days, 3 nights",
            price: 19999,
            discount: 12,
            rating: 4.5,
            tags: ["Beach", "Nightlife", "Water Sports"],
        },
    ]

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(price)
    }

    return (
        <section className="py-24 w-full bg-[#F4F4F9]">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-bold mb-4">Curated Travel Packages</h2>
                    <p className="text-gray-600 max-w-3xl mx-auto">
                        Explore our handpicked packages designed by travel experts and enhanced by AI to match your preferences
                        perfectly.
                    </p>
                </motion.div>
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {
                        packages.map((pkg, index) => (
                            <StaggerItem key={pkg.id} index={index}>
                                <HoverScale>
                                    <Card className="overflow-hidden">
                                        <div className="relative">
                                            <motion.img
                                                src={pkg.image || "/placeholder.svg"}
                                                alt={pkg.title}
                                                className="w-full h-48 object-cover"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ duration: 0.3 }}
                                            />
                                            {
                                                pkg.discount && (
                                                    <motion.div
                                                        className="absolute top-3 right-3 bg-[#FF6F61] text-white px-2 py-1 rounded-md font-medium text-sm"
                                                        initial={{ scale: 0, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        transition={{ delay: 0.2 + index * 0.1, duration: 0.3, type: "spring" }}
                                                    >
                                                        {pkg.discount}% OFF
                                                    </motion.div>
                                                )
                                            }
                                        </div>
                                        <CardContent className="p-5">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-semibold">{pkg.title}</h3>
                                                <div className="flex items-center bg-yellow-100 px-2 py-1 rounded text-sm">
                                                    <span className="text-yellow-700">★</span>
                                                    <span className="ml-1 font-medium">{pkg.rating}</span>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 mb-4">{pkg.destination}</p>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {
                                                    pkg.tags.map((tag, i) => (
                                                        <Badge key={i} variant="outline" className="bg-[#e6f7f6] text-[#00A699] hover:bg-[#d0f0ee]">
                                                            {tag}
                                                        </Badge>
                                                    ))
                                                }
                                            </div>
                                            <div className="flex items-center text-gray-600 mb-1">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                <span className="text-sm">{pkg.duration}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Users className="h-4 w-4 mr-2" />
                                                <span className="text-sm">2 adults</span>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="p-5 pt-0 flex justify-between items-center">
                                            <div>
                                                {
                                                    pkg.discount ? (
                                                        <div>
                                                            <span className="text-gray-400 line-through text-sm">{formatPrice(pkg.price)}</span>
                                                            <div className="text-xl font-bold text-[#00A699]">
                                                                {formatPrice(pkg.price * (1 - pkg.discount / 100))}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-xl font-bold text-[#00A699]">{formatPrice(pkg.price)}</div>
                                                    )
                                                }
                                                <span className="text-xs text-gray-500">per person</span>
                                            </div>
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Button className="bg-[#00A699] hover:bg-[#008b80]">View Details</Button>
                                            </motion.div>
                                        </CardFooter>
                                    </Card>
                                </HoverScale>
                            </StaggerItem>
                        ))
                    }
                </StaggerContainer>
                <motion.div
                    className="text-center mt-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className="bg-[#FF6F61] hover:bg-[#e5645a] px-8 py-6 text-lg">View All Packages</Button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}