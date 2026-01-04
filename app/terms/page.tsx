import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calculator, ArrowLeft, ChevronRight, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Terms of Use - TaxMate",
  description: "Terms of use for TaxMate - Home Office Tax Calculator",
};

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#005424] rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold">TaxMate</span>
            </Link>
            <Button variant="ghost" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Use</h1>
          <p className="text-lg text-gray-600 mb-8">
            We use Apple's standard terms of use. You can find out more here:
          </p>
          
          <Button 
            size="lg" 
            className="bg-[#005424] hover:bg-[#004020] text-lg px-8 h-14"
            asChild
          >
            <a 
              href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Apple's Standard EULA
            </a>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
              {/* Brand Section */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#005424] to-[#003618] rounded-xl flex items-center justify-center shadow-lg">
                    <Calculator className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">TaxMate</span>
                </div>
                <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
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
                <h3 className="font-bold text-gray-900 mb-6 text-lg">Product</h3>
                <ul className="space-y-3">
                  <li>
                    <Link 
                      href="/#features" 
                      className="text-gray-600 hover:text-[#005424] transition-colors duration-200 inline-flex items-center gap-1 group"
                    >
                      Features
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/#how-it-works" 
                      className="text-gray-600 hover:text-[#005424] transition-colors duration-200 inline-flex items-center gap-1 group"
                    >
                      How It Works
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/#faq" 
                      className="text-gray-600 hover:text-[#005424] transition-colors duration-200 inline-flex items-center gap-1 group"
                    >
                      FAQ
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                </ul>
              </div>
              
              {/* Legal Links */}
              <div>
                <h3 className="font-bold text-gray-900 mb-6 text-lg">Legal</h3>
                <ul className="space-y-3">
                  <li>
                    <Link 
                      href="/privacy" 
                      className="text-gray-600 hover:text-[#005424] transition-colors duration-200 inline-flex items-center gap-1 group"
                    >
                      Privacy Policy
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/terms" 
                      className="text-gray-600 hover:text-[#005424] transition-colors duration-200 inline-flex items-center gap-1 group"
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
          <div className="border-t border-gray-200 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-600 text-sm">
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

