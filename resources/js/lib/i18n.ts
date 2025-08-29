import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    common: {
      // Navigation
      home: 'Home',
      about: 'About',
      contact: 'Contact',
      services: 'Services',
      businesses: 'Businesses',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      dashboard: 'Dashboard',
      
      // Business
      tire_shops: 'Tire Shops',
      find_tire_shops: 'Find Tire Shops',
      search_tire_shops: 'Search tire shops...',
      create_business: 'Create Business',
      business_name: 'Business Name',
      business_description: 'Business Description',
      business_address: 'Business Address',
      business_phone: 'Business Phone',
      business_email: 'Business Email',
      business_website: 'Business Website',
      business_hours: 'Business Hours',
      verified: 'Verified',
      pending_verification: 'Pending Verification',
      rejected: 'Rejected',
      
      // Location
      province: 'Province',
      district: 'District',
      commune: 'Commune',
      village: 'Village',
      select_province: 'Select Province',
      select_district: 'Select District',
      select_commune: 'Select Commune',
      select_village: 'Select Village',
      location: 'Location',
      use_my_location: 'Use My Location',
      nearest_shops: 'Nearest Tire Shops',
      distance_away: '{{distance}} away',
      
      // Search & Filter
      search: 'Search',
      filter: 'Filter',
      filters: 'Filters',
      clear_filters: 'Clear Filters',
      no_results: 'No results found',
      showing_results: 'Showing {{count}} results',
      
      // Actions
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      submit: 'Submit',
      create: 'Create',
      update: 'Update',
      verify: 'Verify',
      reject: 'Reject',
      
      // Admin
      admin_panel: 'Admin Panel',
      users: 'Users',
      roles: 'Roles',
      permissions: 'Permissions',
      settings: 'Settings',
      business_management: 'Business Management',
      user_management: 'User Management',
      
      // Messages
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Information',
      business_created: 'Business created successfully',
      business_updated: 'Business updated successfully',
      business_deleted: 'Business deleted successfully',
      business_verified: 'Business verified successfully',
      business_rejected: 'Business rejected successfully',
      
      // Forms
      name: 'Name',
      email: 'Email',
      password: 'Password',
      confirm_password: 'Confirm Password',
      phone: 'Phone',
      address: 'Address',
      description: 'Description',
      website: 'Website',
      required_field: 'This field is required',
      invalid_email: 'Please enter a valid email address',
      password_min_length: 'Password must be at least 8 characters',
      
      // Reviews
      reviews: 'Reviews',
      write_review: 'Write a Review',
      rating: 'Rating',
      comment: 'Comment',
      submit_review: 'Submit Review',
      no_reviews: 'No reviews yet',
      stars: '{{count}} stars',
      
      // Language
      language: 'Language',
      english: 'English',
      khmer: 'ខ្មែរ',
    },
  },
  km: {
    common: {
      // Navigation
      home: 'ទំព័រដើម',
      about: 'អំពីយើង',
      contact: 'ទំនាក់ទំនង',
      services: 'សេវាកម្ម',
      businesses: 'អាជីវកម្ម',
      login: 'ចូលប្រើប្រាស់',
      register: 'ចុះឈ្មោះ',
      logout: 'ចាកចេញ',
      dashboard: 'ផ្ទាំងគ្រប់គ្រង',
      
      // Business
      tire_shops: 'ហាងកង់',
      find_tire_shops: 'រកហាងកង់',
      search_tire_shops: 'ស្វែងរកហាងកង់...',
      create_business: 'បង្កើតអាជីវកម្ម',
      business_name: 'ឈ្មោះអាជីវកម្ម',
      business_description: 'ការពិពណ៌នាអាជីវកម្ម',
      business_address: 'អាសយដ្ឋានអាជីវកម្ម',
      business_phone: 'លេខទូរស័ព្ទអាជីវកម្ម',
      business_email: 'អ៊ីមែលអាជីវកម្ម',
      business_website: 'គេហទំព័រអាជីវកម្ម',
      business_hours: 'ម៉ោងធ្វើការ',
      verified: 'បានផ្ទៀងផ្ទាត់',
      pending_verification: 'កំពុងរង់ចាំការផ្ទៀងផ្ទាត់',
      rejected: 'បានបដិសេធ',
      
      // Location
      province: 'ខេត្ត',
      district: 'ស្រុក/ក្រុង',
      commune: 'ឃុំ/សង្កាត់',
      village: 'ភូមិ',
      select_province: 'ជ្រើសរើសខេត្ត',
      select_district: 'ជ្រើសរើសស្រុក/ក្រុង',
      select_commune: 'ជ្រើសរើសឃុំ/សង្កាត់',
      select_village: 'ជ្រើសរើសភូមិ',
      location: 'ទីតាំង',
      use_my_location: 'ប្រើទីតាំងរបស់ខ្ញុំ',
      nearest_shops: 'ហាងកង់ដែលនៅជិតបំផុត',
      distance_away: 'ចម្ងាយ {{distance}}',
      
      // Search & Filter
      search: 'ស្វែងរក',
      filter: 'តម្រង',
      filters: 'តម្រងများ',
      clear_filters: 'សម្អាតតម្រង',
      no_results: 'រកមិនឃើញលទ្ធផល',
      showing_results: 'បង្ហាញលទ្ធផល {{count}}',
      
      // Actions
      save: 'រក្សាទុក',
      cancel: 'បោះបង់',
      delete: 'លុប',
      edit: 'កែសម្រួល',
      view: 'មើល',
      submit: 'ដាក់ស្នើ',
      create: 'បង្កើត',
      update: 'ធ្វើបច្ចុប្បន្នភាព',
      verify: 'ផ្ទៀងផ្ទាត់',
      reject: 'បដិសេធ',
      
      // Admin
      admin_panel: 'ផ្ទាំងគ្រប់គ្រងអ្នកដឹកនាំ',
      users: 'អ្នកប្រើប្រាស់',
      roles: 'តួនាទី',
      permissions: 'សិទ្ធិ',
      settings: 'ការកំណត់',
      business_management: 'ការគ្រប់គ្រងអាជីវកម្ម',
      user_management: 'ការគ្រប់គ្រងអ្នកប្រើប្រាស់',
      
      // Messages
      success: 'ជោគជ័យ',
      error: 'កំហុស',
      warning: 'ការព្រមាន',
      info: 'ព័ត៌មាន',
      business_created: 'អាជីវកម្មត្រូវបានបង្កើតដោយជោគជ័យ',
      business_updated: 'អាជីវកម្មត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ',
      business_deleted: 'អាជីវកម្មត្រូវបានលុបដោយជោគជ័យ',
      business_verified: 'អាជីវកម្មត្រូវបានផ្ទៀងផ្ទាត់ដោយជោគជ័យ',
      business_rejected: 'អាជីវកម្មត្រូវបានបដិសេធដោយជោគជ័យ',
      
      // Forms
      name: 'ឈ្មោះ',
      email: 'អ៊ីមែល',
      password: 'លេខសម្ងាត់',
      confirm_password: 'បញ្ជាក់លេខសម្ងាត់',
      phone: 'លេខទូរស័ព្ទ',
      address: 'អាសយដ្ឋាន',
      description: 'ការពិពណ៌នា',
      website: 'គេហទំព័រ',
      required_field: 'កន្លែងនេះត្រូវតែបំពេញ',
      invalid_email: 'សូមបញ្ចូលអាសយដ្ឋានអ៊ីមែលដែលត្រឹមត្រូវ',
      password_min_length: 'លេខសម្ងាត់ត្រូវតែមានយ៉ាងហោចណាស់ ៨ តួអក្សរ',
      
      // Reviews
      reviews: 'ការវាយតម្លៃ',
      write_review: 'សរសេរការវាយតម្លៃ',
      rating: 'ការដាក់ពិន្ទុ',
      comment: 'មតិយោបល់',
      submit_review: 'ដាក់ស្នើការវាយតម្លៃ',
      no_reviews: 'មិនទាន់មានការវាយតម្លៃនៅឡើយទេ',
      stars: '{{count}} ផ្កាយ',
      
      // Language
      language: 'ភាសា',
      english: 'English',
      khmer: 'ខ្មែរ',
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    // Detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
    
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    
    // Namespace
    defaultNS: 'common',
    ns: ['common'],
  });

export default i18n;