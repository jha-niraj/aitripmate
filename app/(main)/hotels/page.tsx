import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, ArrowRight, Sun, Umbrella, Leaf, Star, Check } from "lucide-react"
import Image from "next/image"

export default function HotelsMainPage() {
	const destinations = [
		{
			id: "delhi",
			name: "Delhi",
			image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80",
			description:
				"Experience the perfect blend of old and new in India's capital, from ancient monuments to bustling markets.",
			hotelCount: 78,
			featured: true,
			category: "Heritage",
		},
		{
			id: "jaipur",
			name: "Jaipur",
			image: "https://images.unsplash.com/photo-1477587458883-47145ed6979c?w=800&q=80",
			description: "Explore the Pink City with its majestic palaces, vibrant bazaars, and rich Rajasthani culture.",
			hotelCount: 65,
			featured: true,
			category: "Heritage",
		},
		{
			id: "goa",
			name: "Goa",
			image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
			description: "Relax on pristine beaches, enjoy water sports, and experience the unique Indo-Portuguese heritage.",
			hotelCount: 92,
			featured: true,
			category: "Beach",
		},
		{
			id: "mumbai",
			name: "Mumbai",
			image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80",
			description:
				"Discover the city of dreams with its colonial architecture, Bollywood glamour, and vibrant street food.",
			hotelCount: 84,
			featured: false,
			category: "Metropolitan",
		},
		{
			id: "varanasi",
			name: "Varanasi",
			image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80",
			description:
				"Experience spiritual awakening in one of the world's oldest living cities on the banks of the sacred Ganges.",
			hotelCount: 42,
			featured: false,
			category: "Spiritual",
		},
		{
			id: "udaipur",
			name: "Udaipur",
			image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80",
			description:
				"Visit the City of Lakes with its romantic setting, magnificent palaces, and royal Rajasthani heritage.",
			hotelCount: 56,
			featured: false,
			category: "Heritage",
		},
		{
			id: "darjeeling",
			name: "Darjeeling",
			image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
			description: "Enjoy breathtaking Himalayan views, world-famous tea plantations, and the charming toy train ride.",
			hotelCount: 38,
			featured: false,
			category: "Hill Station",
		},
		{
			id: "kerala",
			name: "Kerala",
			image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80",
			description:
				"Explore God's Own Country with its serene backwaters, lush greenery, and rejuvenating Ayurvedic treatments.",
			hotelCount: 73,
			featured: false,
			category: "Backwaters",
		},
	]

	const featuredDestinations = destinations.filter((dest) => dest.featured)

	const getCurrentSeason = () => {
		const month = new Date().getMonth()
		if (month >= 2 && month <= 5) return "summer"
		if (month >= 6 && month <= 8) return "monsoon"
		return "winter"
	}

	const currentSeason = getCurrentSeason()
	const seasonalRecommendations = {
		summer: ["Darjeeling", "Shimla", "Manali"],
		monsoon: ["Kerala", "Goa", "Udaipur"],
		winter: ["Jaipur", "Delhi", "Varanasi"],
	}

	const getSeasonIcon = () => {
		switch (currentSeason) {
			case "summer":
				return <Sun className="h-6 w-6" />
			case "monsoon":
				return <Umbrella className="h-6 w-6" />
			case "winter":
				return <Leaf className="h-6 w-6" />
		}
	}

	const hotelTypes = [
		{
			name: "Heritage Hotels",
			count: 120,
			description: "Experience royal living in palaces and havelis",
		},
		{
			name: "Luxury Resorts",
			count: 85,
			description: "Indulge in opulent accommodations with world-class amenities",
		},
		{
			name: "Boutique Stays",
			count: 150,
			description: "Discover unique properties with personalized service",
		},
		{
			name: "Wellness Retreats",
			count: 65,
			description: "Rejuvenate with Ayurvedic treatments and yoga",
		},
	]

	const placeImages: Record<string, string> = {
		Darjeeling: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
		Shimla: "https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=800&q=80",
		Manali: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80",
		Kerala: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80",
		Goa: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
		Udaipur: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80",
		Jaipur: "https://images.unsplash.com/photo-1477587458883-47145ed6979c?w=800&q=80",
		Delhi: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80",
		Varanasi: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80",
	}

	return (
		<div className="min-h-screen bg-white w-full">
			<section className="w-full relative bg-gradient-to-b from-[#000080]/90 to-[#000080]/70 py-32">
				<section className="max-w-7xl mx-auto">
					<div className="absolute inset-0 overflow-hidden">
						<div
							className="absolute inset-0 bg-cover bg-center opacity-20"
							style={{
								backgroundImage: "url('https://images.unsplash.com/photo-1545959570-a94084071b5d?w=1600&q=80')",
							}}
						/>
					</div>
					<div className="mx-auto px-4 relative z-10">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
							<div className="text-white">
								<div className="inline-block px-4 py-1 bg-[#FF9933] text-white rounded-full mb-6 font-medium">
									Discover India&apos;s Finest Accommodations
								</div>
								<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
									Extraordinary Hotels & Stays Across <span className="text-[#FF9933]">India</span>
								</h1>
								<p className="text-lg md:text-xl opacity-90 mb-8 max-w-xl">
									From royal palaces to serene retreats, explore our curated collection of the most exceptional places to
									stay in India
								</p>
								<div className="flex flex-wrap gap-4 mb-8">
									{
										featuredDestinations.map((destination) => (
											<Link href={`/hotels/${destination.id}`} key={destination.id}>
												<Button size="lg" className="bg-[#FF9933] hover:bg-[#E07422] text-white">
													Hotels in {destination.name}
												</Button>
											</Link>
										))
									}
									<Button variant="outline" className="border-white text-black hover:bg-white hover:text-[#000080]">
										View All Destinations
									</Button>
								</div>
								<div className="flex flex-wrap gap-x-8 gap-y-4 text-sm">
									<div className="flex items-center">
										<Check className="h-5 w-5 text-[#FF9933] mr-2" />
										<span>Best Price Guarantee</span>
									</div>
									<div className="flex items-center">
										<Check className="h-5 w-5 text-[#FF9933] mr-2" />
										<span>Free Cancellation</span>
									</div>
									<div className="flex items-center">
										<Check className="h-5 w-5 text-[#FF9933] mr-2" />
										<span>24/7 Customer Support</span>
									</div>
								</div>
							</div>
							<div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
								<h3 className="text-xl font-semibold text-white mb-4">Featured Hotel Categories</h3>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									{
										hotelTypes.map((type, index) => (
											<div
												key={index}
												className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-colors"
											>
												<h4 className="text-[#FF9933] font-semibold mb-1">{type.name}</h4>
												<p className="text-white text-sm mb-2">{type.description}</p>
												<div className="flex items-center text-white/80 text-sm">
													<MapPin className="h-3 w-3 mr-1" />
													<span>{type.count} properties</span>
												</div>
											</div>
										))
									}
								</div>
								<div className="mt-6 text-center">
									<Button className="bg-white text-[#000080] hover:bg-[#FF9933] hover:text-white">
										Explore All Hotel Types
									</Button>
								</div>
							</div>
						</div>
					</div>
				</section>
			</section>
			<section className="bg-white py-8 border-b border-gray-200">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
						<div>
							<div className="text-3xl font-bold text-[#000080]">500+</div>
							<p className="text-gray-600">Cities & Destinations</p>
						</div>
						<div>
							<div className="text-3xl font-bold text-[#000080]">10,000+</div>
							<p className="text-gray-600">Handpicked Hotels</p>
						</div>
						<div>
							<div className="text-3xl font-bold text-[#000080]">1M+</div>
							<p className="text-gray-600">Happy Guests</p>
						</div>
						<div>
							<div className="text-3xl font-bold text-[#000080]">4.8/5</div>
							<p className="text-gray-600">Average Rating</p>
						</div>
					</div>
				</div>
			</section>
			<section className="bg-[#f8f4e9] py-10 border-b-4 border-[#138808]">
				<div className="container mx-auto px-4">
					<div className="flex items-center justify-center gap-3 mb-6">
						{getSeasonIcon()}
						<h2 className="text-2xl md:text-3xl font-bold text-[#000080]">
							Best Hotels for {currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)} Season
						</h2>
					</div>
					<p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
						{
							currentSeason === "summer"
								? "Beat the heat with these cool mountain retreats and hill station getaways"
								: currentSeason === "monsoon"
									? "Experience the magic of the rains with these perfect monsoon destinations"
									: "Enjoy the pleasant weather at these winter-friendly locations"
						}
					</p>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{
							seasonalRecommendations[currentSeason].map((place, index) => (
								<Link href={`/hotels/${place.toLowerCase()}`} key={index} className="block">
									<div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all group">
										<div className="h-48 overflow-hidden relative">
											<Image
												src={placeImages[place] || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80"}
												alt={place}
												className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
												height={30}
												width={30}
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
											<div className="absolute bottom-4 left-4 right-4">
												<h3 className="text-xl font-bold text-white">{place}</h3>
												<div className="flex items-center text-white/90 text-sm">
													<Star className="h-4 w-4 text-[#FF9933] mr-1" />
													<span>Perfect for {currentSeason} stays</span>
												</div>
											</div>
										</div>
										<div className="p-4">
											<p className="text-gray-600 mb-4">
												{currentSeason === "summer"
													? `Escape to cooler climes in ${place} with stunning views and refreshing weather.`
													: currentSeason === "monsoon"
														? `Experience the lush beauty of ${place} during the magical monsoon season.`
														: `Enjoy the perfect winter getaway in ${place} with pleasant days and cozy nights.`}
											</p>
											<Button className="w-full bg-[#FF9933] hover:bg-[#E07422] text-white">
												View Hotels in {place}
											</Button>
										</div>
									</div>
								</Link>
							))
						}
					</div>
				</div>
			</section>
			<section className="container mx-auto px-4 py-16">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#000080]">Popular Hotel Destinations</h2>
					<div className="h-1 w-24 bg-[#FF9933] mx-auto mb-6"></div>
					<p className="text-lg text-gray-700 max-w-3xl mx-auto">
						Discover exceptional accommodations in India&apos;s most sought-after locations
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{
						destinations.map((destination) => (
							<Link href={`/hotels/${destination.id}`} key={destination.id} className="block h-full">
								<Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300 border-2 border-gray-100 group">
									<div className="relative h-48 overflow-hidden">
										<Image
											src={destination.image || "/placeholder.svg"}
											alt={destination.name}
											className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
											height={30}
											width={30}
										/>
										<div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-md text-sm font-medium text-[#FF9933]">
											{destination.category}
										</div>
										<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
									</div>
									<CardContent className="p-5">
										<div className="flex justify-between items-center mb-3">
											<h3 className="text-xl font-semibold text-[#000080]">{destination.name}</h3>
											<div className="flex items-center text-sm text-gray-500">
												<MapPin className="h-4 w-4 mr-1" />
												<span>{destination.hotelCount} hotels</span>
											</div>
										</div>
										<p className="text-gray-600 mb-4">{destination.description}</p>
										<div className="flex justify-end">
											<Button className="bg-[#FF9933] hover:bg-[#E07422] text-white flex items-center">
												View Hotels <ArrowRight className="ml-2 h-4 w-4" />
											</Button>
										</div>
									</CardContent>
								</Card>
							</Link>
						))
					}
				</div>
			</section>
			<section className="bg-[#f8f4e9] py-16">
				<div className="container mx-auto px-4">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#000080]">Explore by Experience</h2>
						<div className="h-1 w-24 bg-[#FF9933] mx-auto mb-6"></div>
						<p className="text-lg text-gray-700 max-w-3xl mx-auto">
							Discover India through its diverse experiences and unique accommodations
						</p>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						<div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border-b-4 border-[#FF9933] group">
							<div className="h-40 overflow-hidden relative">
								<Image
									src="https://images.unsplash.com/photo-1607513746994-51f730a44832?w=600&q=80"
									alt="Heritage Hotel"
									className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
									height={160}
									width={300}
								/>
							</div>
							<div className="p-5 text-center">
								<h3 className="text-xl font-semibold mb-2 text-[#000080]">Heritage Hotels</h3>
								<p className="text-gray-600 mb-4">
									Stay in palaces and havelis that tell stories of India&apos;s royal past
								</p>
								<Button
									variant="outline"
									className="border-[#FF9933] text-[#FF9933] hover:bg-[#FF9933] hover:text-white"
								>
									Explore Heritage
								</Button>
							</div>
						</div>
						<div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border-b-4 border-[#138808] group">
							<div className="h-40 overflow-hidden relative">
								<Image
									src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80"
									alt="Wellness Retreat"
									className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
									height={160}
									width={300}
								/>
							</div>
							<div className="p-5 text-center">
								<h3 className="text-xl font-semibold mb-2 text-[#000080]">Wellness Retreats</h3>
								<p className="text-gray-600 mb-4">Rejuvenate with authentic Ayurvedic treatments and yoga</p>
								<Button
									variant="outline"
									className="border-[#138808] text-[#138808] hover:bg-[#138808] hover:text-white"
								>
									Find Wellness
								</Button>
							</div>
						</div>
						<div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border-b-4 border-[#000080] group">
							<div className="h-40 overflow-hidden relative">
								<Image
									src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80"
									alt="Beach Resort"
									className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
									height={160}
									width={300}
								/>
							</div>
							<div className="p-5 text-center">
								<h3 className="text-xl font-semibold mb-2 text-[#000080]">Beach Resorts</h3>
								<p className="text-gray-600 mb-4">Unwind at luxurious coastal properties with pristine beaches</p>
								<Button
									variant="outline"
									className="border-[#000080] text-[#000080] hover:bg-[#000080] hover:text-white"
								>
									Discover Beaches
								</Button>
							</div>
						</div>
						<div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border-b-4 border-[#FF9933] group">
							<div className="h-40 overflow-hidden relative">
								<Image
									src="https://images.unsplash.com/photo-1549366021-9f761d040a4d?w=600&q=80"
									alt="Wildlife Lodge"
									className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
									height={160}
									width={300}
								/>
							</div>
							<div className="p-5 text-center">
								<h3 className="text-xl font-semibold mb-2 text-[#000080]">Wildlife Lodges</h3>
								<p className="text-gray-600 mb-4">Experience India&apos;s diverse wildlife from comfortable safari lodges</p>
								<Button
									variant="outline"
									className="border-[#FF9933] text-[#FF9933] hover:bg-[#FF9933] hover:text-white"
								>
									Explore Wildlife
								</Button>
							</div>
						</div>
					</div>
				</div>
			</section>
			<section className="container mx-auto px-4 py-16">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#000080]">Guest Experiences</h2>
					<div className="h-1 w-24 bg-[#FF9933] mx-auto mb-6"></div>
					<p className="text-lg text-gray-700 max-w-3xl mx-auto">
						Hear from travelers who have experienced the magic of India through our accommodations
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#FF9933] hover:shadow-lg transition-shadow">
						<div className="flex items-center mb-4">
							<div className="w-12 h-12 bg-[#f8f4e9] rounded-full flex items-center justify-center mr-4">
								<span className="text-[#FF9933] font-bold">RS</span>
							</div>
							<div>
								<h4 className="font-semibold">Rahul Sharma</h4>
								<p className="text-sm text-gray-500">Delhi Heritage Hotel</p>
							</div>
						</div>
						<p className="text-gray-600 italic">
							&quot;The perfect blend of modern luxury and traditional Indian hospitality. The staff went above and beyond to
							make our stay memorable.&quot;
						</p>
						<div className="flex mt-4 text-[#FF9933]">
							{
								[1, 2, 3, 4, 5].map((star) => (
									<svg
										key={star}
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
									</svg>
								))
							}
						</div>
					</div>
					<div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#138808] hover:shadow-lg transition-shadow">
						<div className="flex items-center mb-4">
							<div className="w-12 h-12 bg-[#f8f4e9] rounded-full flex items-center justify-center mr-4">
								<span className="text-[#138808] font-bold">AP</span>
							</div>
							<div>
								<h4 className="font-semibold">Ananya Patel</h4>
								<p className="text-sm text-gray-500">Kerala Backwater Resort</p>
							</div>
						</div>
						<p className="text-gray-600 italic">
							&ldquo;Our stay at the backwater resort was magical. Waking up to the serene views and enjoying authentic Kerala
							cuisine made it unforgettable.&ldquo;
						</p>
						<div className="flex mt-4 text-[#138808]">
							{
								[1, 2, 3, 4, 5].map((star) => (
									<svg
										key={star}
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
									</svg>
								))
							}
						</div>
					</div>
					<div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#000080] hover:shadow-lg transition-shadow">
						<div className="flex items-center mb-4">
							<div className="w-12 h-12 bg-[#f8f4e9] rounded-full flex items-center justify-center mr-4">
								<span className="text-[#000080] font-bold">VK</span>
							</div>
							<div>
								<h4 className="font-semibold">Vikram Kumar</h4>
								<p className="text-sm text-gray-500">Jaipur Palace Hotel</p>
							</div>
						</div>
						<p className="text-gray-600 italic">
							&quot;Staying in a converted palace was like stepping back in time. The architecture, the decor, and the royal
							treatment were simply outstanding.&quot;
						</p>
						<div className="flex mt-4 text-[#000080]">
							{
								[1, 2, 3, 4, 5].map((star) => (
									<svg
										key={star}
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
									</svg>
								))
							}
						</div>
					</div>
				</div>
			</section>
			<section className="container mx-auto px-4 py-16">
				<div className="bg-gradient-to-r from-[#FF9933] to-[#138808] rounded-xl p-8 md:p-12 text-white text-center relative overflow-hidden">
					<div className="absolute top-0 left-0 w-full h-2 bg-white"></div>
					<div className="absolute bottom-0 left-0 w-full h-2 bg-white"></div>
					<div className="relative z-10">
						<h2 className="text-3xl font-bold mb-4">Subscribe for Hotel Deals</h2>
						<p className="text-lg mb-6 max-w-2xl mx-auto">
							Join our newsletter to receive exclusive offers and insights about India&apos;s best hotel accommodations
						</p>
						<div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
							<input
								type="email"
								placeholder="Your email address"
								className="px-4 py-3 rounded-md flex-grow text-gray-900 focus:outline-none"
							/>
							<Button className="bg-[#000080] hover:bg-[#00005c] text-white border-2 border-white">Subscribe</Button>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}