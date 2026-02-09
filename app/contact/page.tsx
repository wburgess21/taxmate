import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Mail, 
  MessageCircle, 
  FileText, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Home,
  ArrowLeft
} from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 sticky top-0 bg-white/30 backdrop-blur z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="TaxMate Logo" width={60} height={60} className="rounded-lg shadow-md" />
              <span className="text-xl sm:text-2xl font-bold">TaxMate</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </Link>
              <Link href="/#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
                How It Works
              </Link>
              <Link href="/#faq" className="text-gray-600 hover:text-gray-900 transition-colors">
                FAQ
              </Link>
              <Link href="/contact" className="text-[#005424] font-medium">
                Contact
              </Link>
              <a 
                href="https://apps.apple.com/gb/app/taxmate-home-office-tax/id6757307991" 
                target="_blank" 
                rel="noopener noreferrer"
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

      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="flex items-center gap-1 text-gray-600 hover:text-[#005424] transition-colors">
                <Home className="w-4 h-4" />
                Home
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-[#005424] font-medium">Contact & Support</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 tracking-tight">
            Contact & Support
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto">
            Get help with TaxMate or find answers to common questions about home office tax calculations.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">How can we help you?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the best way to get support based on your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {/* Email Support */}
            <Card className="border-2 hover:border-[#005424] transition-colors">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-[#005424]" />
                </div>
                <CardTitle className="text-xl">Email Support</CardTitle>
                <CardDescription className="text-base">
                  Get personalized help with your questions or technical issues
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
                    <Clock className="w-4 h-4" />
                    Typical response: 24-48 hours
                  </div>
                </div>
                <Button 
                  size="lg" 
                  className="bg-[#005424] hover:bg-[#004020] w-full"
                  asChild
                >
                  <a href="mailto:taxmateapp@outlook.com">
                    Send Email
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card className="border-2 hover:border-[#005424] transition-colors">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-[#005424]" />
                </div>
                <CardTitle className="text-xl">FAQ Section</CardTitle>
                <CardDescription className="text-base">
                  Find instant answers to the most common questions
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
                    <Clock className="w-4 h-4" />
                    Instant answers
                  </div>
                </div>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 w-full"
                  asChild
                >
                  <Link href="/#faq">
                    View FAQ
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Send us a message</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Have a specific question or feedback? Fill out the form below and we'll get back to you.
            </p>
          </div>

          <Card>
            <CardContent className="p-6 sm:p-8">
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      First Name *
                    </Label>
                    <Input 
                      id="firstName" 
                      name="firstName"
                      required 
                      className="mt-1"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      Last Name *
                    </Label>
                    <Input 
                      id="lastName" 
                      name="lastName"
                      required 
                      className="mt-1"
                      placeholder="Smith"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address *
                  </Label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    required 
                    className="mt-1"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
                    Subject *
                  </Label>
                  <Input 
                    id="subject" 
                    name="subject"
                    required 
                    className="mt-1"
                    placeholder="Question about home office calculations"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                    Message *
                  </Label>
                  <Textarea 
                    id="message" 
                    name="message"
                    required 
                    className="mt-1 min-h-[120px]"
                    placeholder="Please describe your question or issue in detail..."
                  />
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="bg-[#005424] hover:bg-[#004020] w-full sm:w-auto"
                  >
                    Send Message
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                  <p className="text-sm text-gray-500 mt-3">
                    * Required fields. We'll respond within 24-48 hours.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Common Questions Preview */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Common Questions</h2>
            <p className="text-gray-600">
              Quick answers to help you get started
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How accurate are TaxMate's calculations?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  TaxMate follows published HMRC guidance for home office expense calculations. 
                  The app calculates both the flat rate method and the actual cost method, 
                  helping you choose the most beneficial option.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I use TaxMate if I'm employed and work from home?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  TaxMate is designed specifically for self-employed individuals and sole traders 
                  who complete Self Assessment. Employed individuals have different rules for 
                  claiming home office expenses.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What information do I need to use the app?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  You'll need your annual household expenses (rent/mortgage interest, council tax, 
                  utilities), information about your work pattern, and details about the rooms 
                  you use for work.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2"
              asChild
            >
              <Link href="/#faq">
                View All FAQ
                <ChevronRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* App Download CTA */}
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-[#005424] to-[#003618] rounded-2xl p-6 sm:p-8 md:p-12 text-white">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to calculate your home office tax?
            </h2>
            <p className="text-lg mb-6 text-green-50">
              Download TaxMate and get your accurate deduction in minutes.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-[#005424] hover:bg-gray-100"
              asChild
            >
              <a 
                href="https://apps.apple.com/gb/app/taxmate-home-office-tax/id6757307991" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Download for iOS
                <ChevronRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-10 sm:py-12 md:py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-4 sm:mb-6 md:mb-8">
              {/* Brand Section */}
              <div className="sm:col-span-2 lg:col-span-2">
                <Link href="/" className="flex items-center gap-3 mb-4 sm:mb-6">
                  <Image src="/logo.png" alt="TaxMate Logo" width={60} height={60} className="rounded-xl shadow-lg" />
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">TaxMate</span>
                </Link>
                <p className="text-gray-600 mb-4 sm:mb-6 max-w-md leading-relaxed text-sm sm:text-base">
                  A better way to calculate home office tax for self-employed individuals 
                  and small business owners in the UK.
                </p>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                  <a 
                    href="mailto:taxmateapp@outlook.com" 
                    className="hover:text-[#005424] transition-colors duration-200"
                  >
                    taxmateapp@outlook.com
                  </a>
                </p>
                <div className="flex items-center gap-4">
                  <a 
                    href="https://apps.apple.com/gb/app/taxmate-home-office-tax/id6757307991" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#005424] text-white rounded-lg hover:bg-[#004020] transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium"
                  >
                    Download App
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
              
              {/* Product Links */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4 sm:mb-6 text-base sm:text-lg">Product</h3>
                <ul className="space-y-2 sm:space-y-3">
                  <li>
                    <Link 
                      href="/#features" 
                      className="text-gray-600 hover:text-[#005424] transition-colors duration-200 inline-flex items-center gap-1 group text-sm sm:text-base"
                    >
                      Features
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/#how-it-works" 
                      className="text-gray-600 hover:text-[#005424] transition-colors duration-200 inline-flex items-center gap-1 group text-sm sm:text-base"
                    >
                      How It Works
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/#faq" 
                      className="text-gray-600 hover:text-[#005424] transition-colors duration-200 inline-flex items-center gap-1 group text-sm sm:text-base"
                    >
                      FAQ
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/contact" 
                      className="text-[#005424] font-medium inline-flex items-center gap-1 group text-sm sm:text-base"
                    >
                      Contact
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                </ul>
              </div>
              
              {/* Legal Links */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4 sm:mb-6 text-base sm:text-lg">Legal</h3>
                <ul className="space-y-2 sm:space-y-3">
                  <li>
                    <Link 
                      href="/privacy" 
                      className="text-gray-600 hover:text-[#005424] transition-colors duration-200 inline-flex items-center gap-1 group text-sm sm:text-base"
                    >
                      Privacy Policy
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/terms" 
                      className="text-gray-600 hover:text-[#005424] transition-colors duration-200 inline-flex items-center gap-1 group text-sm sm:text-base"
                    >
                      Terms of Use
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-gray-200 py-6 sm:py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
              <div className="text-gray-600 text-xs sm:text-sm text-center md:text-left">
                <p className="font-medium">&copy; {new Date().getFullYear()} TaxMate. All rights reserved.</p>
              </div>
              <div className="text-gray-500 text-xs text-center md:text-right max-w-2xl">
                <p>
                  TaxMate is not affiliated with HMRC. This app is designed to help you calculate 
                  home office expenses following published HMRC guidance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}