import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            if (existingUser.emailVerified) {
                return NextResponse.json({ message: "User already exists with this email" }, { status: 409 });
            }
            // Exists but unverified — refresh OTP and resend
            const otp = generateOTP();
            const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
            await prisma.user.update({
                where: { email },
                data: { otpCode: otp, otpExpiry },
            });
            await sendOTPEmail(email, existingUser.name, otp);
            return NextResponse.json({ message: "OTP resent. Please verify your email." }, { status: 200 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                otpCode: otp,
                otpExpiry,
            },
        });

        await sendOTPEmail(email, name, otp);

        return NextResponse.json({ message: "Registration successful. Check your email for the OTP." }, { status: 200 });
    } catch (err) {
        const error = err as Error;
        return NextResponse.json({ error: error.message || "An unexpected error occurred" }, { status: 500 });
    }
}

async function sendOTPEmail(email: string, name: string, otp: string) {
    await resend.emails.send({
        from: "AI TripMate <noreply@nirajjha.xyz>",
        to: email,
        subject: "Your AI TripMate Verification Code",
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:#00A699;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">AI TripMate</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Your AI-powered travel companion</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 16px;color:#374151;font-size:16px;">Hi <strong>${name}</strong>,</p>
              <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.6;">
                Welcome to AI TripMate! Use the verification code below to confirm your email address.
                This code expires in <strong>10 minutes</strong>.
              </p>
              <div style="background:#f0fdf9;border:2px dashed #00A699;border-radius:12px;padding:28px;text-align:center;margin:0 0 28px;">
                <p style="margin:0 0 8px;color:#6b7280;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Your OTP Code</p>
                <p style="margin:0;color:#00A699;font-size:44px;font-weight:800;letter-spacing:10px;">${otp}</p>
              </div>
              <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.6;">
                If you didn't create an account with AI TripMate, you can safely ignore this email.
                Never share this code with anyone.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">© ${new Date().getFullYear()} AI TripMate. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    });
}
