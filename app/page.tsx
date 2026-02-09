      {/* Contact Section */}
      <section id="contact" className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
              Need help or have questions?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              We're here to help. Get in touch if you need support with TaxMate or have questions about home office tax calculations.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-2xl mx-auto">
            {/* Email Contact */}
            <Card className="border-2 hover:border-[#005424] transition-colors text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-[#005424]" />
                </div>
                <CardTitle>Email Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-4">
                  Send us your questions and we'll get back to you promptly.
                </CardDescription>
                <Button 
                  className="bg-[#005424] hover:bg-[#004020] text-white"
                  asChild
                >
                  <a 
                    href="mailto:taxmateapp@outlook.com?subject=TaxMate Support Request"
                    aria-label="Send email to TaxMate support"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email Us
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* General Inquiries */}
            <Card className="border-2 hover:border-[#005424] transition-colors text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-[#005424]" />
                </div>
                <CardTitle>General Inquiries</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-4">
                  Questions about features, billing, or how TaxMate works.
                </CardDescription>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <strong>Email:</strong> 
                    <a 
                      href="mailto:taxmateapp@outlook.com"
                      className="text-[#005424] hover:underline ml-1"
                      aria-label="Contact TaxMate via email"
                    >
                      taxmateapp@outlook.com
                    </a>
                  </p>
                  <p className="text-xs text-gray-500">
                    We typically respond within 24 hours
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="mt-10 sm:mt-12 text-center">
            <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border">
              <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-900">
                Contact Information
              </h3>
              <div className="space-y-3 text-sm sm:text-base text-gray-600">
                <div className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4 text-[#005424]" />
                  <a 
                    href="mailto:taxmateapp@outlook.com"
                    className="hover:text-[#005424] transition-colors"
                    aria-label="Email TaxMate support"
                  >
                    taxmateapp@outlook.com
                  </a>
                </div>
                <p className="text-xs text-gray-500">
                  For technical support, feature requests, or general questions about TaxMate
                </p>
              </div>
            </div>
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
                href="https://apps.apple.com/gb/app/taxmate-home-office-tax/id6757307991" 
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