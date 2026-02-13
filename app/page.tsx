              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start px-4 lg:px-0">
                <Button 
                  size="lg" 
                  className="bg-[#003d1a] hover:bg-[#002a12] text-white text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14 w-full sm:w-auto"
                  asChild
                >
                  <a 
                    href="https://apps.apple.com/gb/app/taxmate-home-office-tax/id6757307991" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="Download TaxMate for iOS (opens App Store in new tab)"
                  >
                    <ExternalLink className="mr-2 w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                    Download for iOS
                    <ChevronRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                  </a>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-gray-900 border-gray-400 hover:border-gray-600 hover:bg-gray-50 text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14 border-2 w-full sm:w-auto"
                  asChild
                >
                  <Link href="#how-it-works" aria-label="Navigate to How It Works section">
                    <FileText className="mr-2 w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                    See How It Works
                  </Link>
                </Button>
              </div>