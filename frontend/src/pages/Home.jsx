import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, BarChart3 } from 'lucide-react';
import ShortenForm from '../components/ShortenForm';
import Button from '../components/ui/Button';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 pt-20 pb-16 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
          Shorten URLs. <br />
          <span className="text-indigo-600">Share Smarter.</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
          Create short, memorable links in seconds. Track clicks, manage your links, 
          and boost your online presence — all in one place.
        </p>

        <div className="max-w-2xl mx-auto">
          <ShortenForm />
        </div>

        <div className="mt-6">
          <Link
            to="/register"
            className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Create a free account for analytics & more
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-sm text-gray-500">
              Shorten URLs instantly with zero hassle. No account required for basic shortening.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Reliable & Secure</h3>
            <p className="text-sm text-gray-500">
              Your links are safe with us. We ensure uptime and protect against malicious usage.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Track & Analyze</h3>
            <p className="text-sm text-gray-500">
              Get detailed click analytics with a free account. Know your audience better.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}