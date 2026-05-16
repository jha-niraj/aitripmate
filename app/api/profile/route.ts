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
		const email = searchParams.get('email');

		if (!email) {
			return NextResponse.json({ error: 'Email is required' }, { status: 400 });
		}

		if (email !== session.user.email) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const user = await prisma.user.findUnique({
			where: { email },
			select: {
				id: true,
				name: true,
				email: true,
				image: true,
				username: true,
				location: true,
				bio: true,
				coverPhoto: true,
				travelPreferences: true,
				tripsCompleted: true,
				placesVisited: true,
				reviewsPosted: true,
				photosUploaded: true,
				createdAt: true,
				emergencyContactName: true,
				emergencyContactPhone: true,
			},
		});

		if (!user) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		return NextResponse.json({ user });
	} catch (err) {
		const error = err as Error;
		console.log('Error fetching user profile:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch user profile' },
			{ status: 500 }
		);
	}
}