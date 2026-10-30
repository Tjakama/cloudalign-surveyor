"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"

interface NavbarProps {
  userName: string
  userRole: string
  userEmail: string
}

export default function Navbar({ userName, userRole, userEmail }: NavbarProps) {
  const router = useRouter()

  const handleSignOut = () => {
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Aligned Company Logo & Platform Tag */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center">
            <Image
              src="/images/log.png" 
              alt="Cloudalign Logo"
              width={140}
              height={50}
              className="h-9 sm:h-10 w-auto object-contain"
              priority
            />
          </div>
          
        </div>

        {/* Right: Aligned User Profile & Sign Out Button */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-900">{userName}</p>
            <p className="text-[11px] text-slate-500">{userRole} • {userEmail}</p>
          </div>

          <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
            {userName ? userName.split(" ").map(n => n[0]).join("") : "U"}
          </div>

          <button
            onClick={handleSignOut}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-[0.98]"
          >
            Sign Out
          </button>
        </div>

      </div>
    </header>
  )
}