import React, { useState } from 'react';
import { Link } from '@remix-run/react';
import { UserIcon, AtSymbolIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'; // Or /24/solid for filled icons

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

  const popularDestinations = [
    { name: 'Makkah', image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=300&h=200&fit=crop', price: 'From $899' },
    { name: 'Madinah', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop', price: 'From $799' },
    { name: 'Jeddah', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop', price: 'From $699' },
    { name: 'Riyadh', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop', price: 'From $649' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">LetsGoMakkah</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">
                Login
              </Link>
              <Link 
                to="/signup" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
                onClick={() => setActiveTab('flights')}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                  activeTab === 'flights'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                ✈️ Flights
              </button>
              <button
                onClick={() => setActiveTab('hotels')}
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
                  <label className="block text-sm font-medium mb-2">From</label>
                  <input
                    type="text"
                    placeholder="Departure city"
                    value={flightData.from}
                    onChange={(e) => setFlightData({...flightData, from: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">To</label>
                  <input
                    type="text"
                    placeholder="Destination"
                    value={flightData.to}
                    onChange={(e) => setFlightData({...flightData, to: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Departure</label>
                  <input
                    type="date"
                    value={flightData.departure}
                    onChange={(e) => setFlightData({...flightData, departure: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Return</label>
                  <input
                    type="date"
                    value={flightData.return}
                    onChange={(e) => setFlightData({...flightData, return: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Passengers</label>
                  <select
                    value={flightData.passengers}
                    onChange={(e) => setFlightData({...flightData, passengers: e.target.value})}
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
                  <label className="block text-sm font-medium mb-2">Destination</label>
                  <input
                    type="text"
                    placeholder="Where to stay?"
                    value={hotelData.destination}
                    onChange={(e) => setHotelData({...hotelData, destination: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Check-in</label>
                  <input
                    type="date"
                    value={hotelData.checkin}
                    onChange={(e) => setHotelData({...hotelData, checkin: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Check-out</label>
                  <input
                    type="date"
                    value={hotelData.checkout}
                    onChange={(e) => setHotelData({...hotelData, checkout: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Guests</label>
                  <select
                    value={hotelData.guests}
                    onChange={(e) => setHotelData({...hotelData, guests: e.target.value})}
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
              <button className="bg-gradient-to-r from-blue-600 to-amber-500 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105">
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
              <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
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
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Trusted & Secure</h4>
              <p className="text-gray-600">Your bookings are protected with our secure payment system and trusted partners.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Best Prices</h4>
              <p className="text-gray-600">We offer competitive prices and exclusive deals for your holy journey.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎧</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h4>
              <p className="text-gray-600">Our dedicated support team is available round the clock to assist you.</p>
            </div>
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
                <li>Flight's Booking</li>
                <li>Hotel Reservation</li>
                <li>Hajj Packages</li>
                <li>Umrah Tours</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Contact Us</li>
                <li>Help Center</li>
                <li>Travel Guide</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Connect</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Facebook</li>
                <li>Twitter</li>
                <li>Instagram</li>
                <li>WhatsApp</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LetsGoMakkah. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;