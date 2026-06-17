import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { FileText, Users, Zap, Clock, BarChart3, Shield } from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (isAuthenticated) {
    setLocation("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold text-slate-900">InteriorQuote AI</span>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setLocation("/login")}>
              Sign In
            </Button>
            <Button onClick={() => setLocation("/signup")}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900">
            Create Professional Quotations & Proposals in Minutes
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            InteriorQuote AI helps interior designers generate beautiful, professional quotations and proposals in 2-3 minutes instead of hours. Say goodbye to manual spreadsheets and templates.
          </p>
          <div className="flex gap-4 justify-center pt-6">
            <Button
              size="lg"
              onClick={() => setLocation("/signup")}
              className="px-8"
            >
              Start Free Today
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setLocation("/login")}
              className="px-8"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white border-t border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-slate-600">
              Powerful features designed for interior design professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <Zap className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Lightning Fast
              </h3>
              <p className="text-slate-600">
                Create complete quotations and proposals in 2-3 minutes with our intuitive interface
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <Users className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Client Management
              </h3>
              <p className="text-slate-600">
                Organize and manage all your clients in one centralized database
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <FileText className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Professional Documents
              </h3>
              <p className="text-slate-600">
                Generate beautiful, branded quotations and proposals with one click
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <BarChart3 className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Auto Calculations
              </h3>
              <p className="text-slate-600">
                Automatic calculation of subtotals, GST, discounts, and final amounts
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <Clock className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Save Time
              </h3>
              <p className="text-slate-600">
                Reuse templates, duplicate quotations, and manage your library efficiently
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <Shield className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Secure & Reliable
              </h3>
              <p className="text-slate-600">
                Your data is encrypted and securely stored in the cloud
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600">
              Three simple steps to create professional quotations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Add Client & Project Details
              </h3>
              <p className="text-slate-600">
                Select your client, project type, area, budget, and timeline
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Add Line Items & Services
              </h3>
              <p className="text-slate-600">
                Add items with quantities, rates, and select services included
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Download & Share
              </h3>
              <p className="text-slate-600">
                Download as PDF, print, or share directly with your clients
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join hundreds of interior designers who are saving hours every week
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => setLocation("/signup")}
            className="px-8"
          >
            Get Started for Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
              <ul className="space-y-2 text-slate-600 text-sm">
                <li><a href="#" className="hover:text-slate-900">Features</a></li>
                <li><a href="#" className="hover:text-slate-900">Pricing</a></li>
                <li><a href="#" className="hover:text-slate-900">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
              <ul className="space-y-2 text-slate-600 text-sm">
                <li><a href="#" className="hover:text-slate-900">About</a></li>
                <li><a href="#" className="hover:text-slate-900">Blog</a></li>
                <li><a href="#" className="hover:text-slate-900">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-600 text-sm">
                <li><a href="#" className="hover:text-slate-900">Privacy</a></li>
                <li><a href="#" className="hover:text-slate-900">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Follow</h4>
              <ul className="space-y-2 text-slate-600 text-sm">
                <li><a href="#" className="hover:text-slate-900">Twitter</a></li>
                <li><a href="#" className="hover:text-slate-900">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-8 text-center text-slate-600 text-sm">
            <p>&copy; 2026 InteriorQuote AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
