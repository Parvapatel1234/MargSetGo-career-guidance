import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight, CheckCircle, Users, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20 lg:py-32">
          {/* Decorative Blooms */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
              Guiding Your <span className="gradient-text">Career Path</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              MargSetGo connects college juniors with verified seniors for genuine, impactful mentorship.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/auth/register?role=junior" className="btn-primary flex items-center justify-center text-lg px-8 py-3">
                Join as Junior <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/auth/register?role=senior" className="px-8 py-3 bg-white text-gray-800 border-2 border-gray-200 rounded-full font-semibold hover:border-indigo-600 hover:text-indigo-600 transition duration-300 flex items-center justify-center text-lg">
                Join as Senior
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">Why MargSetGo?</h2>
              <p className="text-gray-500 mt-4 max-w-2xl mx-auto">We bridge the gap between confusion and clarity with verified mentorship.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="glass p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                  <Shield className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Verified Seniors</h3>
                <p className="text-gray-600 leading-relaxed">Every senior profile is manually verified to ensure you get advice from trusted achievers.</p>
              </div>

              {/* Feature 2 */}
              <div className="glass p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  <Users className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Role-Based Dashboard</h3>
                <p className="text-gray-600 leading-relaxed">Tailored experiences for Juniors and Seniors to manage requests and guidance easily.</p>
              </div>

              {/* Feature 3 */}
              <div className="glass p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center mb-6">
                  <CheckCircle className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Direct Mentorship</h3>
                <p className="text-gray-600 leading-relaxed">Connect directly via Chat or Call with seniors from your college or target domain.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
