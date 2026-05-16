import Link from "next/link"
import { Calendar, User, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"

interface BlogPost {
    id: string
    title: string
    excerpt: string
    image: string
    date: string
    author: string
    category: string
}

export function TravelBlog() {
    const blogPosts: BlogPost[] = [
        {
            id: "1",
            title: "Top 10 Hidden Gems in Maharashtra You Must Visit",
            excerpt: "Discover the lesser-known but breathtaking destinations in Maharashtra that most tourists miss...",
            image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&q=80",
            date: "May 15, 2023",
            author: "Priya Sharma",
            category: "Destinations",
        },
        {
            id: "2",
            title: "A Complete Guide to Trekking in Himachal Pradesh",
            excerpt: "Everything you need to know about the best trekking routes, seasons, and preparation for Himachal...",
            image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80",
            date: "June 22, 2023",
            author: "Rahul Khanna",
            category: "Adventure",
        },
        {
            id: "3",
            title: "Culinary Journey Through Rajasthan: Beyond Dal Baati",
            excerpt:
                "Explore the rich and diverse culinary traditions of Rajasthan that go beyond the famous Dal Baati Churma...",
            image: "https://images.unsplash.com/photo-1477587458883-47145ed6979c?w=800&q=80",
            date: "July 10, 2023",
            author: "Ananya Desai",
            category: "Food & Culture",
        },
    ]

    return (
        <section className="py-24 w-full">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-4">Travel Inspiration & Tips</h2>
                <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
                    Discover travel stories, tips, and insights from our community of travelers and AI-powered recommendations.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {
                        blogPosts.map((post) => (
                            <Card
                                key={post.id}
                                className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                            >
                                <div className="relative">
                                    <Image
                                        src={post.image || "/placeholder.svg"}
                                        alt={post.title}
                                        height={40}
                                        width={40}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="absolute top-3 left-3 bg-[#00A699] text-white px-2 py-1 rounded-md text-sm">
                                        {post.category}
                                    </div>
                                </div>
                                <CardContent className="p-5">
                                    <div className="flex items-center text-gray-500 text-sm mb-3">
                                        <div className="flex items-center mr-4">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            <span>{post.date}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <User className="h-4 w-4 mr-1" />
                                            <span>{post.author}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">{post.title}</h3>
                                    <p className="text-gray-600">{post.excerpt}</p>
                                </CardContent>
                                <CardFooter className="p-5 pt-0">
                                    <Link href="#" className="text-[#00A699] font-medium flex items-center hover:underline">
                                        Read More <ArrowRight className="ml-1 h-4 w-4" />
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))
                    }
                </div>
                <div className="text-center mt-10">
                    <Button variant="outline" className="border-[#00A699] text-[#00A699] hover:bg-[#e6f7f6]">
                        View All Articles
                    </Button>
                </div>
            </div>
        </section>
    )
}