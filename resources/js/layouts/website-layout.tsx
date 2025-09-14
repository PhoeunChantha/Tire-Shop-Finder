import React, { useCallback, useState, useEffect } from 'react';

import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import UserProfileDropdown from '@/components/user-profile-dropdown';
import UserProfileDropdownMobile from '@/components/user-profile-dropdown-mobile';
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
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import useBusinessSettings, { BusinessSettings } from '@/hooks/use-business-settings';
import { getImageUrl } from '@/lib/imageHelper';
import { useTranslation as useLaravelTranslation } from '@/hooks/useTranslation';
import ScrollToTopButton from '@/components/ui/scroll-to-top-button';
import { Send, MessageCircle, ExternalLink } from 'lucide-react';


interface WebsiteLayoutProps {
  children: React.ReactNode;
  title?: string;
  businessSettings?: BusinessSettings;
  className?: string;
  showName?: boolean;
}

interface Service {
  id: number;
  name: string;
  slug: string;
}


export default function WebsiteLayout({ children, title, businessSettings }: WebsiteLayoutProps) {
  const { auth } = usePage().props as any;
  const { url } = usePage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const { t } = useTranslation();
  const { locale } = useLaravelTranslation();

  const isActive = (path: string) => {
    if (path === '/') {
      return url === '/';
    }
    return url.startsWith(path);
  };
  const [imageError, setImageError] = useState(false);
  const { 
    businessData, 
    getBusinessName, 
    getWebsiteDescription,
    hasSocialMedia 
  } = useBusinessSettings(businessSettings);
  
  // Get business name in current language
  const displayName = getBusinessName(locale);
  
  // Get dynamic website description
  const websiteDescription = getWebsiteDescription(locale);
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // Handle image load success (reset error state)
  const handleImageLoad = useCallback(() => {
    setImageError(false);
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/public/services');
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        }
      } catch (error) {
        console.error('Failed to fetch services:', error);
      }
    };

    fetchServices();
  }, []);
  const systemLogoUrl = businessData.systemLogo && !imageError
    ? getImageUrl(businessData.systemLogo, 'business-settings')
    : null;

  const renderLogo = () => {
    if (systemLogoUrl) {
      return (
        <img
          src={systemLogoUrl}
          alt={`${displayName} Logo`}
          className={`w-10 h-10 rounded-full object-cover bg-white dark:bg-black`}
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="lazy"
        />
      );
    }

    return (
      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
        <Search className="w-5 h-5 text-white" />
      </div>
    );
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
                {renderLogo()}
                <span className="text-xl font-bold text-gray-900">
                  {displayName}
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <Link
                  href="/"
                  className={`px-3 py-2 text-sm font-medium transition-colors ${isActive('/')
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-blue-600'
                    }`}
                >
                  {t('home')}
                </Link>
                <Link
                  href="/tire-shops"
                  className={`px-3 py-2 text-sm font-medium transition-colors ${isActive('/tire-shops')
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-blue-600'
                    }`}
                >
                  {t('find_tire_shops')}
                </Link>
                <Link
                  href="/about"
                  className={`px-3 py-2 text-sm font-medium transition-colors ${isActive('/about')
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-blue-600'
                    }`}
                >
                  {t('about')}
                </Link>
                <Link
                  href="/contact"
                  className={`px-3 py-2 text-sm font-medium transition-colors ${isActive('/contact')
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-blue-600'
                    }`}
                >
                  {t('contact')}
                </Link>
              </div>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              <LanguageSwitcher />
              {auth?.user ? (
                <UserProfileDropdown user={auth.user} />
              ) : (
                <>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3"
                  >
                    {t('register')}
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <LanguageSwitcher />
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
                  className={`block px-3 py-2 text-base font-medium ${isActive('/')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                >
                  {t('home')}
                </Link>
                <Link
                  href="/tire-shops"
                  className={`block px-3 py-2 text-base font-medium ${isActive('/tire-shops')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                >
                  {t('find_tire_shops')}
                </Link>
                <Link
                  href="/about"
                  className={`block px-3 py-2 text-base font-medium ${isActive('/about')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                >
                  {t('about')}
                </Link>
                <Link
                  href="/contact"
                  className={`block px-3 py-2 text-base font-medium ${isActive('/contact')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                >
                  {t('contact')}
                </Link>

                {/* Mobile Auth */}
                {auth?.user ? (
                  <UserProfileDropdownMobile
                    user={auth.user}
                    onLinkClick={() => setMobileMenuOpen(false)}
                  />
                ) : (
                  <div className="pt-4 pb-3 border-t border-gray-200">
                    <div className="space-y-2">
                      <Link
                        href="/login"
                        className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-blue-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t('login')}
                      </Link>
                      <Link
                        href="/register"
                        className="block px-3 py-2 text-base font-medium text-blue-600 hover:text-blue-700"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t('register')}
                      </Link>
                    </div>
                  </div>
                )}
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
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  {renderLogo()}
                </div>
                <span className="text-xl font-bold"> {displayName}</span>
              </div>
              <p className="text-gray-300 text-sm">
                {websiteDescription || t('website_description')}
              </p>
              <div className="flex space-x-4">
                {hasSocialMedia('facebook') && (
                  <a 
                    href={businessData.socialFacebook!} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {hasSocialMedia('telegram') && (
                  <a 
                    href={businessData.socialTelegram!} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Telegram"
                  >
                    <Send className="w-5 h-5" />
                  </a>
                )}
                {hasSocialMedia('messenger') && (
                  <a 
                    href={businessData.socialMessenger!} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Messenger"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </a>
                )}
                
                {/* Custom Social Media Links */}
                {Object.entries(businessData.customSocialMedia || {}).map(([id, social]) => (
                  social.url && (
                    <a 
                      key={id}
                      href={social.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-gray-400 hover:text-white transition-colors"
                      aria-label={social.name}
                      title={social.name}
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('quick_links')}</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                    {t('home')}
                  </Link>
                </li>
                <li>
                  <Link href="/tire-shops" className="text-gray-300 hover:text-white transition-colors">
                    {t('find_tire_shops')}
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                    {t('about')} {t('us')}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                    {t('contact')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('services')}</h3>
              <ul className="space-y-2 text-sm">
                {services.length > 0 ? (
                  services.map((service) => (
                    <li key={service.id}>
                      <Link
                        href={`/tire-shops?service=${encodeURIComponent(service.name)}`}
                        className="text-gray-300 hover:text-white transition-colors"
                      >
                        {service.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <>
                    <li>
                      <Link
                        href="/tire-shops?service=tire installation"
                        className="text-gray-300 hover:text-white transition-colors"
                      >
                        {t('tire_installation')}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/tire-shops?service=tire repair"
                        className="text-gray-300 hover:text-white transition-colors"
                      >
                        {t('tire_repair')}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/tire-shops?service=wheel alignment"
                        className="text-gray-300 hover:text-white transition-colors"
                      >
                        {t('wheel_alignment')}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/tire-shops?service=tire replacement"
                        className="text-gray-300 hover:text-white transition-colors"
                      >
                        {t('tire_replacement')}
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('contact_info')}</h3>
              <div className="space-y-3 text-sm">
                {businessData.contactAddress && (
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-blue-400 mt-0.5" />
                    <span className="text-gray-300">{businessData.contactAddress}</span>
                  </div>
                )}
                {businessData.contactPhone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-blue-400" />
                    <a 
                      href={`tel:${businessData.contactPhone}`}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {businessData.contactPhone}
                    </a>
                  </div>
                )}
                {businessData.contactEmail && (
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-blue-400" />
                    <a 
                      href={`mailto:${businessData.contactEmail}`}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {businessData.contactEmail}
                    </a>
                  </div>
                )}
                
                {/* Fallback to default if no contact info */}
                {!businessData.contactAddress && !businessData.contactPhone && !businessData.contactEmail && (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>&copy; 2024 Tire Shop Finder Cambodia. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
}