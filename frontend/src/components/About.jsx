import React from 'react';
import {
  Bike,
  Settings,
  PlugZap,
  Smartphone,
  Lightbulb,
  Clock,
} from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: Bike,
      title: 'Pick & Drop',
      subtitle: 'Service',
    },
    {
      icon: Settings,
      title: 'Warranted',
      subtitle: 'Spare Parts',
    },
    {
      icon: PlugZap,
      title: 'Multi Brand',
      subtitle: 'Options',
    },
    {
      icon: Smartphone,
      title: 'Realtime',
      subtitle: 'Tracking',
    },
    {
      icon: Lightbulb,
      title: 'Standardised',
      subtitle: 'Workshops',
    },
    {
      icon: Clock,
      title: '24/7',
      subtitle: 'Support',
    },
  ];

  return (
    <section id="about" className="min-h-5/6 bg-white px-6 py-0 text-gray-800 flex flex-col items-center mt-4">
      {/* Heading */}
      <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-green-700 via-green-800 to-green-500 bg-clip-text text-transparent animate-none">
        About FixMyBike
      </h2>

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-start">
        {/* Left: Use Cases & Features */}
        <div className="space-y-8">
          <section>
            <h3 className="text-3xl font-bold text-green-700 mb-6">Use Cases</h3>
            <p className="text-base leading-relaxed">
              FixMyBike is your go-to bike servicing platform designed to connect you with skilled
              mechanics effortlessly. Whether you're facing a sudden breakdown or need regular maintenance,
              this platform ensures your two-wheeler is in safe hands.
            </p>
          </section>

          <section>
            <h3 className="text-3xl font-bold text-green-800 mb-4">Features</h3>
            <ul className="list-disc list-inside space-y-2 text-base">
              <li>Quick service booking through an intuitive interface</li>
              <li>Verified and skilled mechanics</li>
              <li>Pickup and drop options for added convenience</li>
              <li>24/7 availability for emergency repairs</li>
            </ul>
          </section>
        </div>

        {/* Right: Vision & Mission */}
        <div className="space-y-12 bg-green-50 rounded-xl shadow-md p-6 md:p-10 border-4 border-green-900">
          <section>
            <h3 className="text-2xl font-bold text-green-700 mb-2">Vision</h3>
            <p className="text-base leading-relaxed">
              To revolutionize the way two-wheeler servicing is accessed, making it accessible,
              eco-conscious, and efficient across every city and town.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-green-800 mb-2">Mission</h3>
            <p className="text-base leading-relaxed">
              To deliver reliable, on-demand bike repair and maintenance services through a unified digital
              platform — ensuring trust, speed, and customer satisfaction.
            </p>
          </section>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-gray-50 py-10 px-6 w-full mt-10">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold">
            <span className="text-transparent bg-gradient-to-r from-green-500 to-green-700 bg-clip-text">Why </span>
            <span className="text-transparent bg-gradient-to-r from-yellow-500 to-yellow-300 bg-clip-text">Choose Us</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {features.map(({ icon: Icon, title, subtitle }, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-green-500 via-green-400 to-green-600 rounded-xl p-6 flex flex-col items-center shadow-md hover:scale-105 transition-transform duration-200"
            >
              <div className="bg-white p-4 rounded-full mb-4 shadow-lg">
                {Icon && <Icon className="h-8 w-10 text-green-900" />}
              </div>
              <p className="text-gray-600 text-lg font-semibold">{title}</p>
              <p className="text-yellow-100 text-sm font-medium">{subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
       
  );
}
