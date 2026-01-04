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
              <Image src="/logo.png" alt="TaxMate Logo" width={60} height={60} className="rounded-lg shadow-md" />
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
                href="https://apps.apple.com/app/taxmate" 
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
                href="https://apps.apple.com/app/taxmate" 
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

      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 sm:mb-6 bg-green-50 text-[#005424] border-[#005424] hover:bg-green-100 text-sm sm:text-base">
              HMRC-Compliant Calculations
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 tracking-tight px-2">
              A better way to calculate
              <span className="block text-[#005424]">home office tax</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
              Stop under-claiming or guessing. Calculate your home office tax deduction 
              accurately using both HMRC-approved methods and choose the best option for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button 
                size="lg" 
                className="bg-[#005424] hover:bg-[#004020] text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14 w-full sm:w-auto"
                asChild
              >
                <a 
                  href="https://apps.apple.com/app/taxmate" 
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
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-center px-2">
              Home office tax is often miscalculated
            </h2>
            <p className="text-base sm:text-lg text-gray-600 text-center mb-8 sm:mb-12 px-4">
              There are two HMRC-approved ways to claim home office expenses: the simplified 
              flat rate and a detailed calculation based on actual costs. The right choice 
              depends on how you work, how much space you use, and what your real expenses are.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-gray-400" />
                    Flat Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Simple but often leaves money on the table. Great for minimal home use, 
                    but most people qualify for more.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-gray-400" />
                    Detailed Calculation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Based on actual costs and usage. Usually results in a higher deduction, 
                    but requires understanding the calculation method.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
              Calculate with confidence
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              TaxMate does the complex calculations for you and presents everything clearly.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="border-2 hover:border-[#005424] transition-colors">
              <CardHeader>
                <Image src="/logo.png" alt="TaxMate Logo" width={60} height={60} className="rounded-lg shadow-md mb-4" />
                <CardTitle>Both Methods Calculated</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  See flat rate and detailed calculations side by side. Know exactly which 
                  option gives you the better result.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-[#005424] transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                  <HomeIcon className="w-6 h-6 text-[#005424]" />
                </div>
                <CardTitle>Your Real Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Enter your actual household expenses like rent, mortgage interest, council tax, 
                  and utilities. Get an accurate calculation based on your situation.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-[#005424] transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-[#005424]" />
                </div>
                <CardTitle>Fast & Simple</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Answer a few straightforward questions and get your results in minutes. 
                  No tax knowledge required.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-[#005424] transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-[#005424]" />
                </div>
                <CardTitle>Calculation History</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Keep track of your calculations over time. Review past results and 
                  see how changes affect your deduction.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-[#005424] transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-[#005424]" />
                </div>
                <CardTitle>HMRC Guidance</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Built following published HMRC guidance. Designed to help you claim 
                  accurately, not aggressively.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-[#005424] transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-[#005424]" />
                </div>
                <CardTitle>Clear Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  See exactly how your figure is calculated. Save or share your summary 
                  for your records or accountant.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
              How it works
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Get your home office tax deduction in three simple steps
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8 sm:space-y-10 md:space-y-12">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-[#005424] text-white rounded-full flex items-center justify-center text-lg sm:text-xl font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Enter your work pattern</h3>
                  <p className="text-gray-600 text-base sm:text-lg">
                    Tell us how many hours per day you work from home. This helps calculate 
                    the proportion of your home used for business.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-[#005424] text-white rounded-full flex items-center justify-center text-lg sm:text-xl font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Add your expenses and rooms</h3>
                  <p className="text-gray-600 text-base sm:text-lg">
                    Enter your annual household expenses (rent, mortgage interest, council tax, 
                    utilities) and specify how many rooms you use exclusively or partially for work.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-[#005424] text-white rounded-full flex items-center justify-center text-lg sm:text-xl font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Get your result</h3>
                  <p className="text-gray-600 text-base sm:text-lg">
                    See both calculation methods compared side by side. The app shows you which 
                    option is best and explains the difference clearly.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-10 sm:mt-12 md:mt-16 px-4">
            <Button 
              size="lg" 
              className="bg-[#005424] hover:bg-[#004020] text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14 w-full sm:w-auto"
              asChild
            >
              <a 
                href="https://apps.apple.com/app/taxmate" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Download TaxMate
                <ChevronRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
              Who is TaxMate for?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Designed for anyone who works from home and completes Self Assessment
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-[#005424]" />
                </div>
                <CardTitle>Self-Employed</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Sole traders and freelancers working from home full-time or part-time.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HomeIcon className="w-8 h-8 text-[#005424]" />
                </div>
                <CardTitle>Small Business Owners</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Business owners who use their home as their primary place of work.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-[#005424]" />
                </div>
                <CardTitle>Self Assessment Filers</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Anyone completing their own Self Assessment who wants clarity and accuracy.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Is TaxMate affiliated with HMRC?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  No, TaxMate is not affiliated with HMRC. It is an independent app built 
                  to help you calculate home office expenses following published HMRC guidance.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Will this guarantee my claim is accepted?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  TaxMate calculates your deduction based on HMRC's published methods. However, 
                  you are responsible for ensuring the figures you enter are accurate and that 
                  you retain evidence of your expenses.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Can I use this if I have employees?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  TaxMate is designed for self-employed individuals and sole traders claiming 
                  expenses through Self Assessment. It is not designed for payroll or corporate 
                  expense claims.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Do I need to be tax-savvy to use this?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  No. The app is designed to be simple and clear, even if you're not confident 
                  with tax. It asks straightforward questions and explains everything in plain English.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What if my situation changes during the year?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  You can create multiple calculations and save them in your history. This lets 
                  you compare different scenarios or track changes over time.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Can I share the results with my accountant?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes. The app provides a clear breakdown of your calculation that you can save 
                  or share as needed.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-[#005424] to-[#003618] rounded-2xl p-6 sm:p-8 md:p-12 text-white">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
              Make your home office tax decision with confidence
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-green-50 px-2">
              Download TaxMate and calculate your deduction in minutes.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-[#005424] hover:bg-gray-100 text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14 w-full sm:w-auto"
              asChild
            >
              <a 
                href="https://apps.apple.com/app/taxmate" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Download for iOS
                <ChevronRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-10 sm:py-12 md:py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-10 md:mb-12">
              {/* Brand Section */}
              <div className="sm:col-span-2 lg:col-span-2">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <Image src="/logo.png" alt="TaxMate Logo" width={60} height={60} className="rounded-xl shadow-lg" />
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">TaxMate</span>
                </div>
                <p className="text-gray-600 mb-4 sm:mb-6 max-w-md leading-relaxed text-sm sm:text-base">
                  A better way to calculate home office tax for self-employed individuals 
                  and small business owners in the UK.
                </p>
                <div className="flex items-center gap-4">
                  <a 
                    href="https://apps.apple.com/app/taxmate" 
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
                      href="#features" 
                      className="text-gray-600 hover:text-[#005424] transition-colors duration-200 inline-flex items-center gap-1 group text-sm sm:text-base"
                    >
                      Features
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="#how-it-works" 
                      className="text-gray-600 hover:text-[#005424] transition-colors duration-200 inline-flex items-center gap-1 group text-sm sm:text-base"
                    >
                      How It Works
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="#faq" 
                      className="text-gray-600 hover:text-[#005424] transition-colors duration-200 inline-flex items-center gap-1 group text-sm sm:text-base"
                    >
                      FAQ
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
