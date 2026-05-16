import Link from "next/link"
import { Globe, Twitter, Instagram, Facebook } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-gray-900 w-full text-white py-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <Globe className="h-6 w-6 text-[#00A699]" />
                            <span className="font-bold text-xl">AI Trip Mate</span>
                        </div>
                        <p className="text-gray-400 mb-4">Your AI-powered travel companion for India</p>
                        <p className="text-gray-400">© {new Date().getFullYear()} AI Trip Mate. All rights reserved.</p>
                    </div>
                    <div className="flex flex-col space-y-3">
                        <h3 className="font-semibold text-lg mb-2">Quick Links</h3>
                        <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
                        <Link href="/aboutus" className="text-gray-400 hover:text-white transition-colors">About Us</Link>
                        <Link href="/itenaryplanner" className="text-gray-400 hover:text-white transition-colors">Itinerary Planner</Link>
                        <Link href="/hotels" className="text-gray-400 hover:text-white transition-colors">Hotels</Link>
                        <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link>
                        <Link href="/contactus" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Connect With Us</h3>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                                <Twitter className="h-6 w-6" />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                                <Instagram className="h-6 w-6" />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                                <Facebook className="h-6 w-6" />
                            </Link>
                        </div>
                        <div className="mt-6">
                            <h4 className="font-medium mb-2">Emergency Helplines</h4>
                            <div className="space-y-1">
                                <p className="text-gray-400 text-sm">National Emergency: 112</p>
                                <p className="text-gray-400 text-sm">Tourist Helpline: 1800-111-363</p>
                                <p className="text-gray-400 text-sm">Ambulance: 108</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
