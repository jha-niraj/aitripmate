import { Chatbot } from "@/components/chatbot"
import { CameraButton } from "../../place/_components/camerabutton"
import { HotelsList } from "../_components/hotellist"

const destinationImages: Record<string, string> = {
    Delhi: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1600&q=80",
    Jaipur: "https://images.unsplash.com/photo-1477587458883-47145ed6979c?w=1600&q=80",
    Goa: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&q=80",
    Mumbai: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1600&q=80",
    Varanasi: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1600&q=80",
    Udaipur: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1600&q=80",
    Darjeeling: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&q=80",
    Kerala: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600&q=80",
    Shimla: "https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=1600&q=80",
    Manali: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1600&q=80",
}

export default function HotelPlaceDetails({ destination }: { destination: string }) {
    const formattedDestination = destination.charAt(0).toUpperCase() + destination.slice(1)
    const bannerImage = destinationImages[formattedDestination] || "https://images.unsplash.com/photo-1545959570-a94084071b5d?w=1600&q=80"

    return (
        <div className="min-h-screen bg-white">
            <main>
                <div className="relative h-[40vh] min-h-[300px] w-full overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url('${bannerImage}')`,
                            filter: "brightness(0.7)",
                        }}
                    />
                    <div className="relative h-full flex items-center justify-center text-center px-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Hotels in {formattedDestination}</h1>
                            <p className="text-xl text-white max-w-3xl mx-auto">
                                Find your perfect accommodation for an unforgettable stay
                            </p>
                        </div>
                    </div>
                </div>
                <div className="container mx-auto px-4 py-12">
                    <HotelsList destination={formattedDestination} />
                </div>
            </main>
            <Chatbot destination={formattedDestination} />
            <CameraButton />
        </div>
    )
}