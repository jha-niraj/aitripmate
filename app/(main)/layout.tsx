import { Footer } from "@/components/footer";
import Navbar from "@/components/navbar";
import { SOSButton } from "@/components/sos-button";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar />
            {children}
            <SOSButton />
            <Footer />
        </>
    )
}
