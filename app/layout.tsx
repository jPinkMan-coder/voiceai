import type {Metadata} from "next";
import "./globals.css";
import {BackgroundWave} from "@/components/background-wave";
import Link from "next/link";
import {ElevenLabsLogo, GithubLogo} from "@/components/logos";

export const metadata: Metadata = {
    title: "ConvAI",
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={"h-full w-full"}>
        <body className={`antialiased w-full h-full flex flex-col`}>
        <div 
          className="flex flex-col flex-grow w-full items-center justify-center sm:px-4 min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 70%)
            `,
            backgroundSize: '100% 100%, 100% 100%, 100% 100%',
            backgroundAttachment: 'fixed'
          }}
        >
          {/* Animated particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-70 animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 3}s`
                }}
              />
            ))}
          </div>
          
            <nav
                className={
                    "sm:fixed w-full top-0 left-0 grid grid-cols-2 py-4 px-8"
                }
            >
                <div className={"flex"}>
                    <Link href={"/"} prefetch={true} className="logo-glow">
                        <ElevenLabsLogo
                            className={"h-[15px] w-auto hover:text-gray-500 filter drop-shadow-sm"}
                        />
                    </Link>
                </div>

                <div className={"flex gap-4 justify-end"}>
                    <Link
                        href="https://github.com/jonatanvm/convai-demo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={"py-0.5 logo-glow filter drop-shadow-sm"}
                        aria-label="View source on GitHub"
                    >
                        <GithubLogo
                            className={"w-5 h-5 hover:text-gray-500 text-[#24292f]"}
                        />
                    </Link>
                </div>
            </nav>
            {children}
        </div>
        </body>
        </html>
    );
}
