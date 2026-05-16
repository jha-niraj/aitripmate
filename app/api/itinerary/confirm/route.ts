import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { tripId, emergencyContactName, emergencyContactPhone } = await request.json();

        if (!tripId) {
            return NextResponse.json({ error: "Trip ID is required" }, { status: 400 });
        }

        if (emergencyContactName && emergencyContactPhone) {
            await prisma.user.update({
                where: { id: session.user.id },
                data: { emergencyContactName, emergencyContactPhone },
            });
        }

        const trip = await prisma.trip.update({
            where: { id: tripId, userId: session.user.id },
            data: { confirmed: true },
        });

        await prisma.user.update({
            where: { id: session.user.id },
            data: { tripsCompleted: { increment: 1 } },
        });

        return NextResponse.json({ trip, message: "Trip confirmed successfully" }, { status: 200 });
    } catch (err) {
        const error = err as Error;
        return NextResponse.json({ error: error.message || "Failed to confirm trip" }, { status: 500 });
    }
}
