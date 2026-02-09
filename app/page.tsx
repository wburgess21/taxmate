              {/* Contact & Support */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4 sm:mb-6 text-base sm:text-lg">Contact & Support</h3>
                <ul className="space-y-2 sm:space-y-3">
                  <li>
                    <a 
                      href="mailto:taxmateapp@outlook.com?subject=TaxMate Support Request" 
                      className="text-gray-600 hover:text-[#005424] transition-colors duration-200 inline-flex items-center gap-1 group text-sm sm:text-base"
                      aria-label="Email TaxMate support"
                    >
                      <Mail className="w-4 h-4 mr-1" />
                      Email Support
                    </a>
                  </li>
                  <li>
                    <Link 
                      href="#contact" 
                      className="text-gray-600 hover:text-[#005424] transition-colors duration-200 inline-flex items-center gap-1 group text-sm sm:text-base"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Contact Us
                    </Link>
                  </li>
                </ul>
                
                <h4 className="font-bold text-gray-900 mb-2 sm:mb-3 mt-6 text-sm sm:text-base">Legal</h4>
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