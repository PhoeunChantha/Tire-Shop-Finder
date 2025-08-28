import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

interface WebsiteLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function WebsiteLayout({ children, title }: WebsiteLayoutProps) {
  const { auth } = usePage().props as any;
  const { url } = usePage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') {
      return url === '/';
    }
    return url.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title={title ? `${title} - Tire Shop Finder Cambodia` : 'Tire Shop Finder Cambodia'} />
      
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">
                  Tire Shop Finder
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <Link 
                  href="/" 
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    isActive('/') 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-blue-600'
                  }`}
                >
                  Home
                </Link>
                <Link 
                  href="/tire-shops" 
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    isActive('/tire-shops') 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-blue-600'
                  }`}
                >
                  Find Tire Shops
                </Link>
                <Link 
                  href="/about" 
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    isActive('/about') 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-blue-600'
                  }`}
                >
                  About
                </Link>
                <Link 
                  href="/contact" 
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    isActive('/contact') 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-blue-600'
                  }`}
                >
                  Contact
                </Link>
              </div>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              {auth?.user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    Welcome, {auth.user.name}
                  </span>
                  <Link 
                    href={auth.user?.roles?.some(role => ['admin', 'super-admin'].includes(role.name)) ? "/admin/dashboard" : "/user-dashboard"}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/logout" 
                    method="post" 
                    as="button"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-3"
                  >
                    Logout
                  </Link>
                </div>
              ) : (
                <>
                  <Link 
                    href="/login"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
                <Link 
                  href="/" 
                  className={`block px-3 py-2 text-base font-medium ${
                    isActive('/') 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  Home
                </Link>
                <Link 
                  href="/tire-shops" 
                  className={`block px-3 py-2 text-base font-medium ${
                    isActive('/tire-shops') 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  Find Tire Shops
                </Link>
                <Link 
                  href="/about" 
                  className={`block px-3 py-2 text-base font-medium ${
                    isActive('/about') 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  About
                </Link>
                <Link 
                  href="/contact" 
                  className={`block px-3 py-2 text-base font-medium ${
                    isActive('/contact') 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  Contact
                </Link>
                
                {/* Mobile Auth */}
                <div className="pt-4 pb-3 border-t border-gray-200">
                  {auth?.user ? (
                    <div className="space-y-2">
                      <div className="px-3 py-2">
                        <span className="text-sm text-gray-700">
                          Welcome, {auth.user.name}
                        </span>
                      </div>
                      <Link 
                        href={auth.user?.roles?.some(role => ['admin', 'super-admin'].includes(role.name)) ? "/admin/dashboard" : "/user-dashboard"}
                        className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-blue-600"
                      >
                        Dashboard
                      </Link>
                      <Link 
                        href="/logout" 
                        method="post" 
                        as="button"
                        className="block w-full text-left px-3 py-2 text-base font-medium text-gray-500 hover:text-blue-600"
                      >
                        Logout
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link 
                        href="/login"
                        className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-blue-600"
                      >
                        Login
                      </Link>
                      <Link 
                        href="/register"
                        className="block px-3 py-2 text-base font-medium text-blue-600 hover:text-blue-700"
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Tire Shop Finder</span>
              </div>
              <p className="text-gray-300 text-sm">
                Find the best tire shops across Cambodia. Connect with trusted tire dealers and service providers near you.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/tire-shops" className="text-gray-300 hover:text-white transition-colors">
                    Find Tire Shops
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    Tire Installation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    Tire Repair
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    Wheel Alignment
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    Tire Replacement
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300">Phnom Penh, Cambodia</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300">+855 12 345 678</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300">info@tireshopfinder.kh</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>&copy; 2024 Tire Shop Finder Cambodia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}