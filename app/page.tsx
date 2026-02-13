import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Home as HomeIcon, 
  Users, 
  BarChart3,
  Shield,
  ChevronRight,
  ExternalLink,
  AlertCircle
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-300 sticky top-0 bg-white/95 backdrop-blur z-50" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="TaxMate Logo" width={60} height={60} className="rounded-lg shadow-md" />
              <span className="text-xl sm:text-2xl font-bold text-gray-900">TaxMate</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-gray-700 hover:text-gray-900 hover:underline focus:text-gray-900 focus:underline focus:outline-none transition-colors" aria-label="Navigate to Features section">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-700 hover:text-gray-900 hover:underline focus:text-gray-900 focus:underline focus:outline-none transition-colors" aria-label="Navigate to How It Works section">
                How It Works
              </Link>
              <Link href="#faq" className="text-gray-700 hover:text-gray-900 hover:underline focus:text-gray-900 focus:underline focus:outline-none transition-colors" aria-label="Navigate to FAQ section">
                FAQ
              </Link>
              <a 
                href="https://apps.apple.com/gb/app/taxmate-home-office-tax/id6757307991" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Download TaxMate on the App Store (opens in new tab)"
                className="focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded"
              >
                <img 
                  alt="Download on the App Store" 
                  className="w-[130px] h-[100px] object-contain" 
                  src="https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/black/en-us?releaseDate=1740700800"
                />
              </a>
            </div>
            {/* Mobile App Store Badge */}
            <div className="md:hidden">
              <a 
                href="https://apps.apple.com/gb/app/taxmate-home-office-tax/id6757307991" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Download TaxMate on the App Store (opens in new tab)"
                className="focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded"
              >
                <img 
                  alt="Download on the App Store" 
                  className="w-[130px] h-[100px] object-contain" 
                  src="https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/black/en-us?releaseDate=1740700800"
                />
              </a>
            </div>
          </div>
        </div>
      </nav>