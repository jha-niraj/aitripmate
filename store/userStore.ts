import { create } from 'zustand';

export interface UserProfileData {
	id: string;
	name: string;
	email: string;
	image: string;
	username?: string;
	location?: string;
	bio?: string;
	coverPhoto?: string;
	travelPreferences: string[];
	tripsCompleted: number;
	placesVisited: number;
	reviewsPosted: number;
	photosUploaded: number;
	createdAt: string;
	emailNotifications: boolean;
	pushNotifications: boolean;
	notificationTypes: string[];
	emergencyContactName?: string;
	emergencyContactPhone?: string;
}

export interface TripData {
	id: string;
	destination: string;
	date: string;
	image?: string;
}

export interface ReviewData {
	id: string;
	place: string;
	rating: number;
	comment: string;
	date: string;
}

interface UserState {
	userData: UserProfileData | null;
	trips: TripData[];
	reviews: ReviewData[];
	loading: boolean;
	setUserData: (data: UserProfileData) => void;
	setTrips: (trips: TripData[]) => void;
	setReviews: (reviews: ReviewData[]) => void;
	setLoading: (loading: boolean) => void;
	updateUserData: (data: Partial<UserProfileData>) => void;
}

export const useUserStore = create<UserState>((set) => ({
	userData: null,
	trips: [],
	reviews: [],
	loading: true,
	setUserData: (data) => set({ userData: data }),
	setTrips: (trips) => set({ trips }),
	setReviews: (reviews) => set({ reviews }),
	setLoading: (loading) => set({ loading }),
	updateUserData: (data) => set((state) => ({
		userData: state.userData ? { ...state.userData, ...data } : null
	})),
}));
