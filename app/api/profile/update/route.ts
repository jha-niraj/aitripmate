import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function PUT(request: NextRequest) {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const body = await request.json();
		const { userId, name, username, location, bio, travelPreferences, emergencyContactName, emergencyContactPhone } = body;

		// Verify the user is updating their own profile
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { email: true },
		});

		if (!user || user.email !== session.user.email) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		if (username) {
			const existingUser = await prisma.user.findUnique({
				where: { username },
				select: { id: true },
			});

			if (existingUser && existingUser.id !== userId) {
				return NextResponse.json(
					{ error: 'Username is already taken' },
					{ status: 400 }
				);
			}
		}

		const updatedUser = await prisma.user.update({
			where: { id: userId },
			data: {
				name: name || undefined,
				username: username || undefined,
				location: location || undefined,
				bio: bio || undefined,
				travelPreferences: travelPreferences || undefined,
				emergencyContactName: emergencyContactName !== undefined ? emergencyContactName : undefined,
				emergencyContactPhone: emergencyContactPhone !== undefined ? emergencyContactPhone : undefined,
			},
			select: {
				id: true,
				name: true,
				email: true,
				username: true,
				location: true,
				bio: true,
				travelPreferences: true,
				emergencyContactName: true,
				emergencyContactPhone: true,
			},
		});

		return NextResponse.json({ user: updatedUser });
	} catch (err) {
		const error = err as Error;
		console.error('Error updating user profile:', error);
		return NextResponse.json(
			{ error: 'Failed to update user profile' },
			{ status: 500 }
		);
	}
}
