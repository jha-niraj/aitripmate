"use client"

import { motion } from "framer-motion"

interface PlaceBannerProps {
    destination: string
}

export function PlaceBanner({ destination }: PlaceBannerProps) {
    const getBannerImage = (dest: string) => {
        const destinations: Record<string, string> = {
            Maharashtra: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=1600&q=80",
            Himachal: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1600&q=80",
            Rajasthan: "https://images.unsplash.com/photo-1477587458883-47145ed6979c?w=1600&q=80",
            Kerala: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600&q=80",
            Goa: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&q=80",
            Delhi: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1600&q=80",
            Jaipur: "https://images.unsplash.com/photo-1477587458883-47145ed6979c?w=1600&q=80",
            Mumbai: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1600&q=80",
            Varanasi: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1600&q=80",
            Udaipur: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1600&q=80",
            Darjeeling: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&q=80",
            Shimla: "https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=1600&q=80",
            Manali: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1600&q=80",
        }

        return destinations[dest] || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600&q=80"
    }

    return (
        <div className="relative h-[30vh] min-h-[150px] w-full overflow-hidden">
            <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url('${getBannerImage(destination)}')`,
                    filter: "brightness(0.7)",
                }}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5 }}
            />
            <motion.div
                className="relative h-full flex items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <h1 className="text-5xl font-bold text-white">{destination}</h1>
            </motion.div>
        </div>
    )
}