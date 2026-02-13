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
  ExternalLink
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 sticky top-0 bg-white/30 backdrop-blur z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="TaxMate logo - A green circular icon representing the app" width={60} height={60} className="rounded-lg shadow-md" />
              <span className="text-xl sm:text-2xl font-bold">TaxMate</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
                How It Works
              </Link>
              <Link href="#faq" className="text-gray-600 hover:text-gray-900 transition-colors">
                FAQ
              </Link>
              <a 
                href="https://apps.apple.com/gb/app/taxmate-home-office-tax/id6757307991" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <img 
                  alt="Download TaxMate on the App Store - Black button with Apple logo" 
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
              >
                <img 
                  alt="Download TaxMate on the App Store - Black button with Apple logo" 
                  className="w-[130px] h-[100px] object-contain" 
                  src="https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/black/en-us?releaseDate=1740700800"
                />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Text Content - First on mobile, left on desktop */}
            <div className="text-center lg:text-left order-1 lg:order-1">
              <Badge className="mb-4 sm:mb-6 bg-green-50 text-[#005424] border-[#005424] hover:bg-green-100 text-sm sm:text-base">
                HMRC-Compliant Calculations
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 tracking-tight px-2">
                A better way to calculate
                <span className="block text-[#005424]">home office tax</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto lg:mx-0 px-4 lg:px-0">
                Stop under-claiming or guessing. Calculate your home office tax deduction 
                accurately using both HMRC-approved methods and choose the best option for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start px-4 lg:px-0">
                <Button 
                  size="lg" 
                  className="bg-[#005424] hover:bg-[#004020] text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14 w-full sm:w-auto"
                  asChild
                >
                  <a 
                    href="https://apps.apple.com/gb/app/taxmate-home-office-tax/id6757307991" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Download for iOS
                    <ChevronRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14 border-2 w-full sm:w-auto"
                  asChild
                >
                  <Link href="#how-it-works">
                    See How It Works
                  </Link>
                </Button>
              </div>
            </div>
            {/* Hero Image - Second on mobile, right on desktop */}
            <div className="flex items-center justify-center order-2 lg:order-2">
              <Image 
                src="/hero-photo.png" 
                alt="Screenshot of TaxMate app interface showing home office tax calculation with clear input fields for work hours, expenses, and rooms, displaying both flat rate and detailed calculation methods side by side" 
                width={400}
                height={600}
                className="w-auto h-auto max-w-full"
                priority
              />
            </div>
          </div>
        </div>
      </section>