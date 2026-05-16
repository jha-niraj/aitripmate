"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User, LogOut, Check, Loader2, Camera, Upload, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FadeIn, FadeInUp } from "@/components/motionwrapper"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from "next-auth/react"
import { useUserStore } from "@/store/userStore"
import axios from "axios"

// Using UserProfileData interface from userStore

export function ProfileSettings() {
    const { data: session, update } = useSession();
    const [saving, setSaving] = useState(false);

    // Use the user store instead of local state
    const {
        userData,
        loading,
        updateUserData
    } = useUserStore();

    // Form state
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [location, setLocation] = useState('');
    const [bio, setBio] = useState('');
    const [newPreference, setNewPreference] = useState('');
    const [preferences, setPreferences] = useState<string[]>([]);

    const [emergencyContactName, setEmergencyContactName] = useState("");
    const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
    const [savingEmergency, setSavingEmergency] = useState(false);

    // Password reset state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
    const [passwordResetting, setPasswordResetting] = useState(false);

    // Image upload state
    const [uploadingProfileImage, setUploadingProfileImage] = useState(false);
    const [uploadingCoverImage, setUploadingCoverImage] = useState(false);

    // Notification preferences state
    const [notificationPreferences, setNotificationPreferences] = useState([
        { id: 'deals', label: 'Travel deals and discounts', enabled: true },
        { id: 'reminders', label: 'Trip reminders', enabled: true },
        { id: 'updates', label: 'New features and updates', enabled: false },
        { id: 'tips', label: 'Travel tips and recommendations', enabled: true },
        { id: 'marketing', label: 'Marketing emails', enabled: false },
    ]);
    const [savingPreferences, setSavingPreferences] = useState(false);

    useEffect(() => {
        // Initialize form with user data when userData changes
        if (userData) {
            setName(userData.name || '');
            setUsername(userData.username || '');
            setLocation(userData.location || '');
            setBio(userData.bio || '');
            setPreferences(userData.travelPreferences || []);
            setEmergencyContactName(userData.emergencyContactName || "");
            setEmergencyContactPhone(userData.emergencyContactPhone || "");

            // Initialize notification preferences
            setNotificationPreferences(prefs =>
                prefs.map(pref => ({
                    ...pref,
                    enabled: userData.notificationTypes?.includes(pref.id) ?? pref.enabled
                }))
            );
        }
    }, [userData]);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userData?.id) return;

        setSaving(true);
        try {
            const response = await fetch('/api/profile/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userData.id,
                    name,
                    username,
                    location,
                    bio,
                    travelPreferences: preferences,
                }),
            });

            if (!response.ok) throw new Error('Failed to update profile');

            // Get the updated user data from the response
            // const data = await response.json();

            // Update the user store with the new data
            updateUserData({
                name,
                username,
                location,
                bio,
                travelPreferences: preferences,
            });

            // Update session with new name
            if (session?.user && name !== session.user.name) {
                await update({ name });
            }

            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordResetting(true);

        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("Please fill in all password fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New passwords don't match");
            return;
        }

        try {
            const response = await axios.post('/api/resetpassword', {
                currentPassword,
                newPassword,
            });

            if (!response) {
                throw new Error('Failed to change password');
            }

            setPasswordResetSuccess(true);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            toast.success('Password changed successfully');

            setTimeout(() => {
                setPasswordResetSuccess(false);
            }, 3000);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data.error || 'Failed to change password');
            } else {
                toast.error('An unexpected error occurred');
            }
        } finally {
            setPasswordResetting(false);
        }
    };

    const handleAddPreference = () => {
        if (!newPreference.trim()) return;
        if (preferences.includes(newPreference.trim())) {
            toast.error('This preference already exists');
            return;
        }
        setPreferences([...preferences, newPreference.trim()]);
        setNewPreference('');
    };

    const handleRemovePreference = (pref: string) => {
        setPreferences(preferences.filter(p => p !== pref));
    };

    const handleNotificationChange = (id: string, enabled: boolean) => {
        setNotificationPreferences(prefs =>
            prefs.map(pref =>
                pref.id === id ? { ...pref, enabled } : pref
            )
        );
    };

    const handleSaveNotificationPreferences = async () => {
        if (!userData?.id) return;

        setSavingPreferences(true);
        try {
            const response = await fetch('/api/profile/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    notificationTypes: notificationPreferences
                        .filter(pref => pref.enabled)
                        .map(pref => pref.id)
                }),
            });

            if (!response.ok) throw new Error('Failed to update notification preferences');

            const data = await response.json();
            updateUserData(data);
            toast.success('Notification preferences updated');
        } catch (error) {
            console.error('Error updating notification preferences:', error);
            toast.error('Failed to update notification preferences');
        } finally {
            setSavingPreferences(false);
        }
    };

    const handleUploadProfileImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !userData?.id) return;

        setUploadingProfileImage(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('userId', userData.id);
            formData.append('type', 'profile');

            const response = await fetch('/api/profile/upload-image', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to upload image');

            const data = await response.json();

            // Update the user store with the new image URL
            updateUserData({
                image: data.imageUrl
            });

            // Update session with new image
            if (session?.user) {
                await update({ image: data.imageUrl });
            }

            toast.success('Profile image updated');
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload image');
        } finally {
            setUploadingProfileImage(false);
        }
    };

    const handleUploadCoverImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !userData?.id) return;

        setUploadingCoverImage(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('userId', userData.id);
            formData.append('type', 'cover');

            const response = await fetch('/api/profile/upload-image', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to upload image');

            const data = await response.json();

            // Update the user store with the new cover photo URL
            updateUserData({
                coverPhoto: data.imageUrl
            });

            toast.success('Cover image updated');
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload image');
        } finally {
            setUploadingCoverImage(false);
        }
    };

    const handleLogout = () => {
        signOut({ callbackUrl: '/' });
    };

    return (
        <FadeIn className="bg-white rounded-lg shadow-lg p-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <nav className="space-y-2">
                        {
                            [
                                { icon: <User size={18} />, label: "Account Information", active: true },
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ x: 5 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                >
                                    <Button
                                        variant={item.active ? "default" : "ghost"}
                                        className={`w-full justify-start ${item.active ? "bg-[#00A699] hover:bg-[#008b80]" : ""}`}
                                    >
                                        <span className="mr-2">{item.icon}</span>
                                        {item.label}
                                    </Button>
                                </motion.div>
                            ))
                        }
                        <Separator className="my-4" />
                        <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={handleLogout}
                            >
                                <LogOut size={18} className="mr-2" />
                                Logout
                            </Button>
                        </motion.div>
                    </nav>
                </div>
                <div className="md:col-span-2">
                    <FadeInUp>
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Information</CardTitle>
                                <CardDescription>Update your personal details and preferences</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {
                                    loading ? (
                                        <div className="flex justify-center py-8">
                                            <Loader2 className="h-8 w-8 animate-spin text-[#00A699]" />
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSaveProfile}>
                                            <div className="mb-6">
                                                <div className="flex flex-col items-center gap-4 mb-4">
                                                    <div className="relative">
                                                        <Avatar className="h-24 w-24 border-2 border-[#00A699]">
                                                            <AvatarImage src={session?.user?.image || ''} alt={name} />
                                                            <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <label
                                                            htmlFor="profileImage"
                                                            className="absolute bottom-0 right-0 bg-[#00A699] text-white p-2 rounded-full cursor-pointer"
                                                        >
                                                            {
                                                                uploadingProfileImage ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <Camera size={16} />
                                                                )
                                                            }
                                                            <input
                                                                type="file"
                                                                id="profileImage"
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={handleUploadProfileImage}
                                                                disabled={uploadingProfileImage}
                                                            />
                                                        </label>
                                                    </div>
                                                    <div className="w-full max-w-xs">
                                                        <Label htmlFor="coverImage" className="block mb-2 text-center">Cover Photo</Label>
                                                        <div className="relative">
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                className="w-full flex items-center justify-center gap-2"
                                                                disabled={uploadingCoverImage}
                                                                asChild
                                                            >
                                                                <label htmlFor="coverImage" className="cursor-pointer">
                                                                    {
                                                                        uploadingCoverImage ? (
                                                                            <>
                                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                                                Uploading...
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <Upload size={16} />
                                                                                Upload Cover Image
                                                                            </>
                                                                        )
                                                                    }
                                                                </label>
                                                            </Button>
                                                            <input
                                                                type="file"
                                                                id="coverImage"
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={handleUploadCoverImage}
                                                                disabled={uploadingCoverImage}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="fullName">Full Name</Label>
                                                    <Input
                                                        id="fullName"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="username">Username</Label>
                                                    <Input
                                                        id="username"
                                                        value={username}
                                                        onChange={(e) => setUsername(e.target.value)}
                                                        placeholder="Choose a username"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2 mt-4">
                                                <Label htmlFor="email">Email Address</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={session?.user?.email || ''}
                                                    disabled
                                                    className="bg-gray-50"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                                            </div>
                                            <div className="space-y-2 mt-4">
                                                <Label htmlFor="location">Location</Label>
                                                <Input
                                                    id="location"
                                                    value={location}
                                                    onChange={(e) => setLocation(e.target.value)}
                                                    placeholder="e.g. Mumbai, India"
                                                />
                                            </div>
                                            <div className="space-y-2 mt-4">
                                                <Label htmlFor="bio">Bio</Label>
                                                <Textarea
                                                    id="bio"
                                                    value={bio}
                                                    onChange={(e) => setBio(e.target.value)}
                                                    placeholder="Tell us about yourself and your travel interests"
                                                    className="min-h-[100px]"
                                                />
                                            </div>
                                            <div className="space-y-2 mt-4">
                                                <Label>Travel Preferences</Label>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {
                                                        preferences.map((pref) => (
                                                            <Badge
                                                                key={pref}
                                                                variant="outline"
                                                                className="bg-[#e6f7f6] text-[#00A699] hover:bg-[#d0f0ee] cursor-pointer"
                                                                onClick={() => handleRemovePreference(pref)}
                                                            >
                                                                {pref} ×
                                                            </Badge>
                                                        ))
                                                    }
                                                </div>
                                                <div className="flex mt-2 gap-2">
                                                    <Input
                                                        value={newPreference}
                                                        onChange={(e) => setNewPreference(e.target.value)}
                                                        placeholder="Add a travel preference"
                                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPreference())}
                                                    />
                                                    <Button
                                                        type="button"
                                                        onClick={handleAddPreference}
                                                        className="bg-[#00A699] hover:bg-[#008b80]"
                                                    >
                                                        Add
                                                    </Button>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">Click on a preference to remove it</p>
                                            </div>
                                            <div className="flex justify-end mt-6">
                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                    <Button
                                                        type="submit"
                                                        className="bg-[#00A699] hover:bg-[#008b80]"
                                                        disabled={saving}
                                                    >
                                                        {
                                                            saving ? (
                                                                <>
                                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                    Saving...
                                                                </>
                                                            ) : 'Save Changes'
                                                        }
                                                    </Button>
                                                </motion.div>
                                            </div>
                                        </form>
                                    )
                                }
                            </CardContent>
                        </Card>
                    </FadeInUp>
                    <FadeInUp className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Reset Password</CardTitle>
                                <CardDescription>Change your password to keep your account secure</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleResetPassword} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="currentPassword">Current Password</Label>
                                        <Input
                                            id="currentPassword"
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <Input
                                            id="newPassword"
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                    {
                                        passwordResetSuccess && (
                                            <motion.div
                                                className="bg-green-100 text-green-700 p-3 rounded-md flex items-center"
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <Check className="h-5 w-5 mr-2" />
                                                Password reset successfully!
                                            </motion.div>
                                        )
                                    }
                                    <div className="flex justify-end">
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button type="submit" className="bg-[#00A699] hover:bg-[#008b80]">
                                                {
                                                    passwordResetting ?
                                                        <div className="flex items-center gap-2">
                                                            <Loader className="animate-spin" />
                                                            <p>Resetting Password</p>
                                                        </div>
                                                        : "Reset Password"
                                                }
                                            </Button>
                                        </motion.div>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </FadeInUp>
                    <FadeInUp className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Email Notifications</CardTitle>
                                <CardDescription>Manage your email notification preferences</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {
                                    notificationPreferences.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between">
                                            <Label htmlFor={`notification-${item.id}`} className="cursor-pointer">
                                                {item.label}
                                            </Label>
                                            <Switch
                                                id={`notification-${item.id}`}
                                                checked={item.enabled}
                                                onCheckedChange={(checked) => handleNotificationChange(item.id, checked)}
                                            />
                                        </div>
                                    ))
                                }
                                <div className="flex justify-end mt-4">
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            onClick={handleSaveNotificationPreferences}
                                            disabled={savingPreferences}
                                            className="bg-[#00A699] hover:bg-[#008b80] flex items-center gap-2"
                                        >
                                            {
                                                savingPreferences ? (
                                                    <>
                                                        <Loader className="h-4 w-4 animate-spin" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    'Save Preferences'
                                                )
                                            }
                                        </Button>
                                    </motion.div>
                                </div>
                            </CardContent>
                        </Card>
                    </FadeInUp>
                    <FadeInUp className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Emergency Contact</CardTitle>
                                <CardDescription>Your emergency contact for SOS alerts during travel</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="emergencyName">Contact Name</Label>
                                    <Input
                                        id="emergencyName"
                                        value={emergencyContactName}
                                        onChange={(e) => setEmergencyContactName(e.target.value)}
                                        placeholder="e.g. Mom, Dad, Partner"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="emergencyPhone">Phone Number (with country code)</Label>
                                    <Input
                                        id="emergencyPhone"
                                        value={emergencyContactPhone}
                                        onChange={(e) => setEmergencyContactPhone(e.target.value)}
                                        placeholder="e.g. +91 98765 43210"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        onClick={async () => {
                                            if (!userData?.id) return;
                                            if (!emergencyContactName.trim() || !emergencyContactPhone.trim()) {
                                                toast.error("Please enter both name and phone number");
                                                return;
                                            }
                                            setSavingEmergency(true);
                                            try {
                                                const response = await fetch("/api/profile/update", {
                                                    method: "PUT",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({
                                                        userId: userData.id,
                                                        emergencyContactName: emergencyContactName.trim(),
                                                        emergencyContactPhone: emergencyContactPhone.trim(),
                                                    }),
                                                });
                                                if (!response.ok) throw new Error("Failed to save");
                                                updateUserData({
                                                    emergencyContactName: emergencyContactName.trim(),
                                                    emergencyContactPhone: emergencyContactPhone.trim(),
                                                });
                                                toast.success("Emergency contact saved");
                                            } catch {
                                                toast.error("Failed to save emergency contact");
                                            } finally {
                                                setSavingEmergency(false);
                                            }
                                        }}
                                        disabled={savingEmergency}
                                        className="bg-[#00A699] hover:bg-[#008b80]"
                                    >
                                        {savingEmergency ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : "Save Emergency Contact"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </FadeInUp>
                </div>
            </div>
        </FadeIn>
    )
}