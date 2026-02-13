export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav 
        className="border-b border-gray-200 sticky top-0 bg-white/30 backdrop-blur z-50"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center gap-2">
              <Image 
                src="/logo.png" 
                alt="TaxMate application logo - home office tax calculator" 
                width={60} 
                height={60} 
                className="rounded-lg shadow-md" 
              />
              <span className="text-xl sm:text-2xl font-bold">TaxMate</span>
            </div>
            <div className="hidden md:flex items-center gap-8" role="menubar">
              <Link 
                href="#features" 
                className="text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-[#005424] focus:ring-offset-2 rounded-sm px-2 py-1"
                role="menuitem"
                aria-label="Go to Features section"
              >
                Features
              </Link>
              <Link 
                href="#how-it-works" 
                className="text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-[#005424] focus:ring-offset-2 rounded-sm px-2 py-1"
                role="menuitem"
                aria-label="Go to How It Works section"
              >
                How It Works
              </Link>
              <Link 
                href="#faq" 
                className="text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-[#005424] focus:ring-offset-2 rounded-sm px-2 py-1"
                role="menuitem"
                aria-label="Go to Frequently Asked Questions section"
              >
                FAQ
              </Link>
              <a 
                href="https://apps.apple.com/gb/app/taxmate-home-office-tax/id6757307991" 
                target="_blank" 
                rel="noopener noreferrer"
                className="focus:outline-none focus:ring-2 focus:ring-[#005424] focus:ring-offset-2 rounded-sm"
                aria-label="Download TaxMate app from the Apple App Store - opens in new window"
              >
                <img 
                  alt="Download on the App Store badge" 
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
                className="focus:outline-none focus:ring-2 focus:ring-[#005424] focus:ring-offset-2 rounded-sm"
                aria-label="Download TaxMate app from the Apple App Store - opens in new window"
              >
                <img 
                  alt="Download on the App Store badge" 
                  className="w-[130px] h-[100px] object-contain" 
                  src="https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/black/en-us?releaseDate=1740700800"
                />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main id="main-content">
        <section 
          className="py-12 sm:py-16 md:py-20 lg:py-32"
          aria-labelledby="hero-heading"
          role="banner"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Text Content - First on mobile, left on desktop */}
              <div className="text-center lg:text-left order-1 lg:order-1">
                <Badge 
                  className="mb-4 sm:mb-6 bg-green-50 text-[#005424] border-[#005424] hover:bg-green-100 text-sm sm:text-base"
                  role="note"
                  aria-label="HMRC-Compliant tax calculations badge"
                >
                  HMRC-Compliant Calculations
                </Badge>
                <h1 
                  id="hero-heading"
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 tracking-tight px-2"
                >
                  A better way to calculate
                  <span className="block text-[#005424]">home office tax</span>
                </h1>
                <p 
                  className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto lg:mx-0 px-4 lg:px-0"
                  role="text"
                  aria-describedby="hero-heading"
                >
                  Stop under-claiming or guessing. Calculate your home office tax deduction 
                  accurately using both HMRC-approved methods and choose the best option for you.
                </p>
                <div 
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start px-4 lg:px-0"
                  role="group"
                  aria-label="Primary action buttons"
                >
                  <Button 
                    size="lg" 
                    className="bg-[#005424] hover:bg-[#004020] text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14 w-full sm:w-auto"
                    asChild
                  >
                    <a 
                      href="https://apps.apple.com/gb/app/taxmate-home-office-tax/id6757307991" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label="Download TaxMate app for iOS from the App Store - opens in new window"
                    >
                      Download for iOS
                      <ChevronRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                    </a>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14 border-2 w-full sm:w-auto"
                    asChild
                  >
                    <Link 
                      href="#how-it-works"
                      aria-label="Navigate to How It Works section"
                    >
                      See How It Works
                    </Link>
                  </Button>
                </div>
              </div>
              {/* Hero Image - Second on mobile, right on desktop */}
              <div className="flex items-center justify-center order-2 lg:order-2">
                <Image 
                  src="/hero-photo.png" 
                  alt="Screenshot of TaxMate app interface showing home office tax calculation with both flat rate and detailed methods displayed on mobile device" 
                  width={400}
                  height={600}
                  className="w-auto h-auto max-w-full"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section 
          className="py-12 sm:py-16 md:py-20 bg-gray-50"
          aria-labelledby="problem-heading"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 
                id="problem-heading"
                className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-center px-2"
              >
                Home office tax is often miscalculated
              </h2>
              <p 
                className="text-base sm:text-lg text-gray-600 text-center mb-8 sm:mb-12 px-4"
                aria-describedby="problem-heading"
              >
                There are two HMRC-approved ways to claim home office expenses: the simplified 
                flat rate and a detailed calculation based on actual costs. The right choice 
                depends on how you work, how much space you use, and what your real expenses are.
              </p>
              <div 
                className="grid sm:grid-cols-2 gap-4 sm:gap-6"
                role="group"
                aria-label="Home office tax calculation methods comparison"
              >
                <Card role="article" aria-labelledby="flat-rate-title">
                  <CardHeader>
                    <CardTitle id="flat-rate-title" className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-gray-400" aria-hidden="true" />
                      Flat Rate Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Simple but often leaves money on the table. Great for minimal home use, 
                      but most people qualify for more.
                    </p>
                  </CardContent>
                </Card>
                <Card role="article" aria-labelledby="detailed-calc-title">
                  <CardHeader>
                    <CardTitle id="detailed-calc-title" className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-gray-400" aria-hidden="true" />
                      Detailed Calculation Method
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
      </main>