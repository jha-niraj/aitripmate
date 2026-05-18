import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const userId = searchParams.get('userId');

		if (!userId) {
			return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
		}

		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { email: true },
		});

		if (!user || user.email !== session.user.email) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const trips = await prisma.trip.findMany({
			where: { userId },
			orderBy: { date: 'desc' },
			select: {
				id: true,
				destination: true,
				date: true,
				image: true,
				days: true,
				itinerary: true,
				confirmed: true,
				travelType: true,
				budget: true,
				interests: true,
				createdAt: true,
			},
		});

		return NextResponse.json({ trips });
	} catch (error) {
		console.error('Error fetching user trips:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch user trips' },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const body = await request.json();
		const { userId, destination, date, image, days, budget, travelType, interests } = body;

		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { email: true },
		});

		if (!user || user.email !== session.user.email) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const trip = await prisma.trip.create({
			data: {
				destination,
				date: new Date(date),
				image: image || null,
				userId,
				days: days ? Number(days) : null,
				budget: budget || null,
				travelType: travelType || null,
				interests: interests || [],
			},
		});

		await prisma.user.update({
			where: { id: userId },
			data: {
				tripsCompleted: { increment: 1 },
				placesVisited: { increment: 1 },
			},
		});

		return NextResponse.json({ trip }, { status: 201 });
	} catch (err) {
		const error = err as Error;
		console.log('Error adding user trip:', error);
		return NextResponse.json(
			{ error: 'Failed to add user trip' },
			{ status: 500 }
		);
	}
}
