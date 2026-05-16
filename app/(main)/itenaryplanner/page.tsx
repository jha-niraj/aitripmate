import { FullItineraryPlanner } from "./_components/fullitenaryplanner"
import { AIGeneration } from "./_components/aigeneration"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FadeInUp } from "@/components/motionwrapper"
import { Sparkles, CalendarDays } from "lucide-react"

export default function ItineraryPlannerPage() {
    return (
        <main className="min-h-screen pt-20 pb-16 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4">
                <FadeInUp className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Trip Planner</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Let AI build your perfect itinerary, or plan manually — your choice.
                    </p>
                </FadeInUp>
                <Tabs defaultValue="ai" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                        <TabsTrigger value="ai" className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            AI Generate
                        </TabsTrigger>
                        <TabsTrigger value="manual" className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" />
                            Manual Planner
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="ai">
                        <AIGeneration />
                    </TabsContent>
                    <TabsContent value="manual">
                        <FullItineraryPlanner />
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    )
}
