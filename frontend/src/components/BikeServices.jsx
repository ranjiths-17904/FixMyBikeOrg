import React, { useState } from 'react';
import GeneralServices from '../assets/image/General.png';
import VehicleBreakdown from '../assets/image/BreakDown.png';
import Engine from '../assets/image/Engine.png';
import Repairs from '../assets/image/MajorRepairs.png';
import Wash from '../assets/image/Wash & Polish.png';
import Offers from '../assets/image/Offers.png';

const services = [
  { 
    title: 'General Service', 
    icon: GeneralServices,
    description: 'Complete bike inspection, oil change, brake adjustment, chain lubrication, and general maintenance to keep your bike running smoothly.'
  },
  { 
    title: 'Vehicle Breakdown', 
    icon: VehicleBreakdown,
    description: '24/7 emergency roadside assistance, towing services, and on-spot repairs to get you back on the road quickly and safely.'
  },
  { 
    title: 'Engine Reboring', 
    icon: Engine,
    description: 'Professional engine reboring services to restore engine performance, improve compression, and extend your bike lifespan.'
  },
  { 
    title: 'Major Repairs', 
    icon: Repairs,
    description: 'Comprehensive repair services for transmission, suspension, electrical systems, and other major bike components with genuine parts.'
  },
  { 
    title: 'Wash & Polish', 
    icon: Wash,
    description: 'Premium bike cleaning, waxing, and detailing services to keep your bike looking brand new and protected from the elements.'
  },
  { 
    title: 'Offers', 
    icon: Offers,
    description: 'Special discounts, seasonal packages, and loyalty rewards for regular customers. Save up to 20% on selected services!'
  },
];

const reviews = [
  {
    name: 'Arun S.',
    comment: 'Excellent service! My bike feels brand new. Highly recommended!',
  },
  {
    name: 'Divya R.',
    comment: 'Quick response and skilled mechanics. Loved the experience!',
  },
  {
    name: 'Mohit K.',
    comment: 'Affordable pricing and genuine parts. Will return again.',
  },
];

export default function BikeServices() {
  const [flippedCards, setFlippedCards] = useState(new Set());

  const handleCardFlip = (index) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <section id="services" className="bg-gradient-to-b from-green-50 to-green-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Title */}
        <h2 className="text-4xl font-extrabold text-center text-green-900 mb-6">
          Bike Services   
        </h2>
        <p className="text-center text-gray-700 max-w-2xl mx-auto mb-12 text-lg">
          We offer top-notch bike repair and maintenance services with a dedicated team of experts ensuring smooth rides every time. Our commitment to quality and customer satisfaction sets us apart.
        </p>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 mb-20">
          {services.map((service, index) => (
            <div
              key={index}
              className="relative h-64 w-full cursor-pointer"
              style={{ perspective: '1000px' }}
              onMouseEnter={() => handleCardFlip(index)}
              onMouseLeave={() => handleCardFlip(index)}
            >
              <div 
                className={`absolute inset-0 w-full h-full transition-transform duration-700 ${
                  flippedCards.has(index) ? '[transform:rotateY(180deg)]' : ''
                }`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front of Card */}
                <div className="absolute inset-0 w-full h-full bg-white border border-green-400 hover:shadow-2xl transition-all duration-300 rounded-2xl flex flex-col items-center text-center p-6 md:p-8 hover:scale-105"
                     style={{ backfaceVisibility: 'hidden' }}>
                  {/* Badge for Offers */}
                  {service.title === 'Offers' && (
                    <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      20% OFF
                    </span>
                  )}
                  <img
                    src={service.icon}
                    alt={service.title}
                    className="h-28 w-28 md:h-44 md:w-44 object-contain mb-2 -mt-2 md:-mt-6 -ml-2 md:-ml-4 align-middle justify-center"
                  />
                  <p className="text-xl font-semibold text-gray-800">{service.title}</p>
                </div>

                {/* Back of Card */}
                <div className="absolute inset-0 w-full h-full bg-green-600 text-white rounded-2xl flex flex-col items-center justify-center text-center p-4 md:p-6"
                     style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                  <h3 className="text-lg font-bold mb-4">{service.title}</h3>
                  <p className="text-sm leading-relaxed">{service.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Customer Reviews */}
        <h3 className="text-3xl font-bold text-center text-green-900 mb-10">
          What Our Customers Say
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 border border-green-200 hover:shadow-lg transition-all duration-200"
            >
              <p className="text-gray-700 italic mb-4">"{review.comment}"</p>
              <p className="text-right text-green-800 font-semibold">- {review.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}