import React, { useState, useEffect } from 'react';
import { Link } from '@remix-run/react';

// Declare gtag and dataLayer on the window object for TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

// Helper function to safely call gtag
const gtagHelper = (...args: any[]) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args);
  } else {
    // It's good to have a warning if gtag is not found,
    // but during development or if scripts are blocked, this might be noisy.
    // console.warn('gtag function not found on window. Ensure Google Tag is loaded.');
  }
};

// Tracking functions using the gtagHelper
const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
  gtagHelper('event', eventName, {
    // Default parameters can be set here or managed via GTM
    // For example, GA4 often automatically captures page_location
    page_location: typeof window !== 'undefined' ? window.location.href : '',
    page_title: typeof document !== 'undefined' ? document.title : '',
    ...parameters
  });
};

const trackButtonClick = (buttonName: string, buttonType = 'button', additionalParams: Record<string, any> = {}) => {
  trackEvent('button_click', {
    button_name: buttonName,
    button_type: buttonType,
    ...additionalParams
  });
};

const trackSearchEvent = (searchType: string, searchData: Record<string, any>) => {
  trackEvent('search', {
    search_term: searchType, // e.g., 'flights' or 'hotels'
    search_parameters: JSON.stringify(searchData), // Keep as string for GA4 flexibility
    // Consider more specific event category if not using GTM to manage this
    // event_category: 'search_interaction'
  });
};

const WelcomePage = () => {
  const [activeTab, setActiveTab] = useState('flights');
  const [flightData, setFlightData] = useState({
    from: '',
    to: '',
    departure: '',
    return: '',
    passengers: '1'
  });
  const [hotelData, setHotelData] = useState({
    destination: '',
    checkin: '',
    checkout: '',
    guests: '1'
  });

  // Effect for sending a page_view event when the component mounts
  // GA4 usually sends a page_view automatically on history changes if configured.
  // This manual one can be used for more control or if the auto one isn't sufficient.
  useEffect(() => {
    // Ensure this only runs client-side
    if (typeof window !== 'undefined') {
      gtagHelper('event', 'page_view', {
        page_title: 'Welcome Page - LetsGoMakkah', // More specific title
        // page_location: window.location.href, // gtagHelper's trackEvent can add this
        content_group1: 'Landing Pages' // Example custom dimension
      });
    }
  }, []); // Empty dependency array means this runs once on mount

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    trackButtonClick(`${tab}_tab_selected`, 'navigation_tab', {
      previous_tab: activeTab,
      new_tab: tab
    });
  };

  const handleSearch = () => {
    const searchData = activeTab === 'flights' ? flightData : hotelData;
    trackSearchEvent(activeTab, searchData);

    // Example: Enhanced ecommerce tracking for GA4 (if applicable)
    // This event name 'begin_checkout' might be specific.
    // Adjust according to your e-commerce tracking setup.
    gtagHelper('event', 'begin_checkout', { // Or a more generic 'search_submitted'
      currency: 'USD', // Example currency
      value: activeTab === 'flights' ? 500 : 200, // Example value
      items: [{
        item_id: `${activeTab}_search_query`,
        item_name: `${activeTab} Search Initiated`,
        // category: 'Travel Services', // Use item_category for GA4
        item_category: 'Travel Services',
        quantity: 1,
        price: activeTab === 'flights' ? 500 : 200
      }]
    });
  };

  const handleDestinationClick = (destination: { name: string; price: string; }) => {
    trackButtonClick(`destination_card_${destination.name.toLowerCase().replace(/\s+/g, '_')}`, 'destination_card_click', {
      destination_name: destination.name,
      destination_price_string: destination.price // Keep original price string if needed
    });

    // Example: Track content selection
    const priceValue = parseFloat(destination.price.replace(/[^0-9.-]+/g, ""));
    if (!isNaN(priceValue)) {
        gtagHelper('event', 'select_content', {
        content_type: 'popular_destination',
        content_id: destination.name,
        value: priceValue,
        currency: 'USD' // Assuming USD
        });
    }
  };

  const handleAuthClick = (action: string) => {
    trackButtonClick(`${action}_button_header`, 'authentication_link', {
      auth_action: action, // e.g., 'login' or 'signup'
      page_section: 'header'
    });
  };

  const popularDestinations = [
    { name: 'Makkah', image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=300&h=200&fit=crop', price: 'From $899' },
    { name: 'Madinah', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop', price: 'From $799' },
    { name: 'Jeddah', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop', price: 'From $699' },
    { name: 'Riyadh', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop', price: 'From $649' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/*
        The GTM NoScript iframe should be in your root.tsx,
        immediately after the opening <body> tag, if you are using GTM.
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=YOUR_GTM_ID" // Replace with your GTM ID
            height="0"
            width="0"
            style={{display: 'none', visibility: 'hidden'}}
          />
        </noscript>
      */}

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1
                className="text-2xl font-bold text-blue-600 cursor-pointer"
                onClick={() => trackButtonClick('logo_click', 'branding')}
              >
                LetsGoMakkah
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => handleAuthClick('login')}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => handleAuthClick('signup')}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-amber-500 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Your Journey to the Holy Land
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Book flights and hotels for Hajj, Umrah, and spiritual journeys
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-xl shadow-2xl p-6 mt-12 max-w-4xl mx-auto">
            {/* Tabs */}
            <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleTabChange('flights')}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                  activeTab === 'flights'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                ✈️ Flights
              </button>
              <button
                onClick={() => handleTabChange('hotels')}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                  activeTab === 'hotels'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                🏨 Hotels
              </button>
            </div>

            {/* Flight Search */}
            {activeTab === 'flights' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-gray-700">
                <div>
                  <label htmlFor="flight_from" className="block text-sm font-medium mb-2">From</label>
                  <input
                    id="flight_from"
                    type="text"
                    placeholder="Departure city"
                    value={flightData.from}
                    onChange={(e) => {
                      setFlightData({...flightData, from: e.target.value});
                      trackEvent('form_field_interaction', {
                        form_name: 'flight_search',
                        field_name: 'flight_from',
                        // field_value: e.target.value // Potentially PII, be careful
                      });
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="flight_to" className="block text-sm font-medium mb-2">To</label>
                  <input
                    id="flight_to"
                    type="text"
                    placeholder="Destination"
                    value={flightData.to}
                    onChange={(e) => {
                      setFlightData({...flightData, to: e.target.value});
                       trackEvent('form_field_interaction', {
                        form_name: 'flight_search',
                        field_name: 'flight_to',
                      });
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="flight_departure" className="block text-sm font-medium mb-2">Departure</label>
                  <input
                    id="flight_departure"
                    type="date"
                    value={flightData.departure}
                    onChange={(e) => {
                      setFlightData({...flightData, departure: e.target.value});
                      trackEvent('form_field_interaction', {
                        form_name: 'flight_search',
                        field_name: 'flight_departure_date',
                      });
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="flight_return" className="block text-sm font-medium mb-2">Return</label>
                  <input
                    id="flight_return"
                    type="date"
                    value={flightData.return}
                    onChange={(e) => {
                      setFlightData({...flightData, return: e.target.value});
                      trackEvent('form_field_interaction', {
                        form_name: 'flight_search',
                        field_name: 'flight_return_date',
                      });
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="flight_passengers" className="block text-sm font-medium mb-2">Passengers</label>
                  <select
                    id="flight_passengers"
                    value={flightData.passengers}
                    onChange={(e) => {
                      setFlightData({...flightData, passengers: e.target.value});
                      trackEvent('form_field_interaction', {
                        form_name: 'flight_search',
                        field_name: 'flight_passengers',
                        field_value: e.target.value
                      });
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="1">1 Passenger</option>
                    <option value="2">2 Passengers</option>
                    <option value="3">3 Passengers</option>
                    <option value="4">4+ Passengers</option>
                  </select>
                </div>
              </div>
            )}

            {/* Hotel Search */}
            {activeTab === 'hotels' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-gray-700">
                <div>
                  <label htmlFor="hotel_destination" className="block text-sm font-medium mb-2">Destination</label>
                  <input
                    id="hotel_destination"
                    type="text"
                    placeholder="Where to stay?"
                    value={hotelData.destination}
                    onChange={(e) => {
                      setHotelData({...hotelData, destination: e.target.value});
                      trackEvent('form_field_interaction', {
                        form_name: 'hotel_search',
                        field_name: 'hotel_destination',
                      });
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="hotel_checkin" className="block text-sm font-medium mb-2">Check-in</label>
                  <input
                    id="hotel_checkin"
                    type="date"
                    value={hotelData.checkin}
                    onChange={(e) => {
                      setHotelData({...hotelData, checkin: e.target.value});
                      trackEvent('form_field_interaction', {
                        form_name: 'hotel_search',
                        field_name: 'hotel_checkin_date',
                      });
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="hotel_checkout" className="block text-sm font-medium mb-2">Check-out</label>
                  <input
                    id="hotel_checkout"
                    type="date"
                    value={hotelData.checkout}
                    onChange={(e) => {
                      setHotelData({...hotelData, checkout: e.target.value});
                      trackEvent('form_field_interaction', {
                        form_name: 'hotel_search',
                        field_name: 'hotel_checkout_date',
                      });
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="hotel_guests" className="block text-sm font-medium mb-2">Guests</label>
                  <select
                    id="hotel_guests"
                    value={hotelData.guests}
                    onChange={(e) => {
                      setHotelData({...hotelData, guests: e.target.value});
                      trackEvent('form_field_interaction', {
                        form_name: 'hotel_search',
                        field_name: 'hotel_guests',
                        field_value: e.target.value
                      });
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4+ Guests</option>
                  </select>
                </div>
              </div>
            )}

            {/* Search Button */}
            <div className="mt-6 text-center">
              <button
                className="bg-gradient-to-r from-blue-600 to-amber-500 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                onClick={handleSearch}
              >
                Search {activeTab === 'flights' ? 'Flights' : 'Hotels'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Popular Destinations</h3>
            <p className="text-lg text-gray-600">Discover the most sacred places for your spiritual journey</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((dest, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                onClick={() => handleDestinationClick(dest)}
              >
                <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  {/* You could use an actual image here if dest.image was used */}
                  <span className="text-white text-4xl">🕌</span>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">{dest.name}</h4>
                  <p className="text-amber-500 font-semibold text-lg">{dest.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose LetsGoMakkah?</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🛡️', title: 'Trusted & Secure', desc: 'Your bookings are protected with our secure payment system and trusted partners.' },
              { icon: '💰', title: 'Best Prices', desc: 'We offer competitive prices and exclusive deals for your holy journey.' },
              { icon: '🎧', title: '24/7 Support', desc: 'Our dedicated support team is available round the clock to assist you.' }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="text-center p-6 cursor-pointer"
                onClick={() => trackButtonClick(`feature_card_${feature.title.replace(/\s+/g, '_').toLowerCase()}`, 'feature_card_click')}
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">LetsGoMakkah</h4>
              <p className="text-gray-400">Your trusted partner for spiritual journeys to the holy lands.</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Services</h5>
              <ul className="space-y-2 text-gray-400">
                {['Flight\'s Booking', 'Hotel Reservation', 'Hajj Packages', 'Umrah Tours'].map(service => (
                  <li
                    key={service}
                    className="cursor-pointer hover:text-white"
                    onClick={() => trackButtonClick(`footer_link_service_${service.replace(/\s+|'/g, '_').toLowerCase()}`, 'footer_link')}
                  >
                    {service}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-gray-400">
                {['Contact Us', 'Help Center', 'Travel Guide', 'FAQ'].map(support => (
                  <li
                    key={support}
                    className="cursor-pointer hover:text-white"
                    onClick={() => trackButtonClick(`footer_link_support_${support.replace(/\s+/g, '_').toLowerCase()}`, 'footer_link')}
                  >
                    {support}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Connect</h5>
              <ul className="space-y-2 text-gray-400">
                {['Facebook', 'Twitter', 'Instagram', 'WhatsApp'].map(social => (
                  <li
                    key={social}
                    className="cursor-pointer hover:text-white"
                    onClick={() => trackButtonClick(`footer_link_social_${social.toLowerCase()}`, 'social_media_link')}
                  >
                    {social}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} LetsGoMakkah. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;