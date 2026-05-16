"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Shield, CheckCircle, X, RotateCcw, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { SafetyData } from "./aigeneration"

interface Props {
    safetyData: SafetyData
    destination: string
    onContinue: () => void
    onModify: () => void
    onCancel: () => void
}

const riskConfig = {
    low: { color: "text-green-700", bg: "bg-green-50", border: "border-green-300", icon: <CheckCircle className="h-8 w-8 text-green-600" />, label: "Low Risk" },
    medium: { color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-300", icon: <AlertTriangle className="h-8 w-8 text-yellow-600" />, label: "Medium Risk" },
    high: { color: "text-red-700", bg: "bg-red-50", border: "border-red-300", icon: <AlertTriangle className="h-8 w-8 text-red-600" />, label: "High Risk" },
}

const severityBadge = {
    low: "bg-green-100 text-green-700 border-green-200",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    high: "bg-red-100 text-red-700 border-red-200",
}

export function SafetyAlertModal({ safetyData, destination, onContinue, onModify, onCancel }: Props) {
    const risk = riskConfig[safetyData.riskLevel as keyof typeof riskConfig] || riskConfig.medium

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 20 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
                <div className={`p-6 rounded-t-xl ${risk.bg} border-b ${risk.border}`}>
                    <div className="flex items-center gap-3">
                        <Shield className="h-6 w-6 text-[#00A699]" />
                        <h2 className="text-xl font-bold">Safety Check — {destination}</h2>
                    </div>
                    <div className={`flex items-center gap-3 mt-4 p-4 rounded-lg border ${risk.border} bg-white/70`}>
                        {risk.icon}
                        <div>
                            <p className={`font-semibold text-lg ${risk.color}`}>{risk.label}</p>
                            <p className="text-gray-700 text-sm mt-1">{safetyData.riskSummary}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                            Safety Alerts
                        </h3>
                        <div className="space-y-3">
                            {safetyData.alerts.map((alert, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border">
                                    <span className="text-2xl">{alert.icon}</span>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-medium text-gray-900">{alert.title}</p>
                                            <Badge variant="outline" className={`text-xs ${severityBadge[alert.severity as keyof typeof severityBadge] || severityBadge.medium}`}>
                                                {alert.severity}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Safety Tips</h3>
                        <ul className="space-y-2">
                            {safetyData.safetyTips.map((tip, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-700">
                            <strong>Best time to visit:</strong> {safetyData.bestTimeToVisit}
                        </p>
                        {safetyData.localEmergencyInfo && (
                            <p className="text-sm text-blue-700 mt-1">
                                <strong>Emergency:</strong> {safetyData.localEmergencyInfo}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <Button
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                            onClick={onCancel}
                        >
                            <X className="h-4 w-4 mr-2" />
                            Cancel Trip
                        </Button>
                        <Button
                            variant="outline"
                            className="border-yellow-200 text-yellow-700 hover:bg-yellow-50"
                            onClick={onModify}
                        >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Modify Itinerary
                        </Button>
                        <Button
                            className="bg-[#00A699] hover:bg-[#008b80] text-white"
                            onClick={onContinue}
                        >
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Continue Journey
                        </Button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}
