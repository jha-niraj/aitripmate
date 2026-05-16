import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { email, otp } = await request.json();

        if (!email || !otp) {
            return NextResponse.json({ message: "Email and OTP are required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (user.emailVerified) {
            return NextResponse.json({ message: "Email already verified" }, { status: 200 });
        }

        if (!user.otpCode || !user.otpExpiry) {
            return NextResponse.json({ message: "No OTP found. Please request a new one." }, { status: 400 });
        }

        if (new Date() > user.otpExpiry) {
            return NextResponse.json({ message: "OTP has expired. Please request a new one." }, { status: 400 });
        }

        if (user.otpCode !== otp.trim()) {
            return NextResponse.json({ message: "Invalid OTP. Please try again." }, { status: 400 });
        }

        await prisma.user.update({
            where: { email },
            data: {
                emailVerified: new Date(),
                otpCode: null,
                otpExpiry: null,
            },
        });

        return NextResponse.json({ message: "Email verified successfully" }, { status: 200 });
    } catch (err) {
        const error = err as Error;
        return NextResponse.json({ error: error.message || "Verification failed" }, { status: 500 });
    }
}
