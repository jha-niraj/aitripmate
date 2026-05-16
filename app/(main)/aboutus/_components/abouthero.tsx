"use client"

import { motion } from "framer-motion"

export function AboutHero() {
    return (
        <section className="relative h-[40vh] min-h-[150px] pt-14 w-full overflow-hidden">
            <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600&q=80')",
                    filter: "brightness(0.7)",
                }}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5 }}
            />
            <div className="relative h-full flex items-center justify-center text-center px-4">
                <motion.div
                    className="max-w-3xl"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <motion.h1
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        About AI Trip Mate
                    </motion.h1>
                    <motion.p
                        className="text-xl text-black"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Revolutionizing travel planning with artificial intelligence
                    </motion.p>
                </motion.div>
            </div>
        </section>
    )
}