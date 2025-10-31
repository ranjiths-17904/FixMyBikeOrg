import React from 'react';
import { FaCalendarCheck, FaMotorcycle, FaTools, FaBell, FaSmile } from 'react-icons/fa';
import Mech1 from '../assets/image/Mech1.jpg';
import Mech2 from '../assets/image/Mech2.jpg';
import Mech3 from '../assets/image/Mech4.jpg';
import Mech4 from '../assets/image/Mech3.png';

export default function OurProgress() {
  const steps = [
    {
      icon: <FaCalendarCheck size={24} className="text-green-600" />,
      title: '1. Book a Service',
      desc: 'Choose your bike service and schedule your preferred time slot.',
    },
    {
      icon: <FaMotorcycle size={24} className="text-green-600" />,
      title: '2. Pickup or Drop',
      desc: 'We offer pickup or you can drop your bike at our service center.',
    },
    {
      icon: <FaTools size={24} className="text-green-600" />,
      title: '3. Diagnosis & Repair',
      desc: 'Our expert mechanics inspect and fix the issues using quality parts.',
    },
    {
      icon: <FaBell size={24} className="text-green-600" />,
      title: '4. Real-time Updates',
      desc: 'Track your repair progress via messages or app notifications.',
    },
    {
      icon: <FaSmile size={24} className="text-green-600" />,
      title: '5. Delivery & Feedback',
      desc: 'We return your bike and ask for your valuable feedback.',
    },
  ];

  const workImages = [
    Mech1,
    Mech2,
    Mech3,
    Mech4,
  ];

  return (
    <section id="progress" className="px-2 py-6 md:px-8 bg-gradient-to-b from-green-50 to-green-100">
      <h2 className="text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-green-900 to-green-700 text-transparent bg-clip-text">
        Our Progress
      </h2>

      {/* Steps */}
      <div className="max-w-4xl mx-auto space-y-8">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="bg-white border border-green-200 shadow-md rounded-xl p-6 flex items-start gap-4 transition duration-300 hover:shadow-lg"
          >
            <div className="mt-1">{step.icon}</div>
            <div>
              <h3 className="text-lg font-semibold text-green-700">{step.title}</h3>
              <p className="text-gray-600 mt-1">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="my-6 border-green-200 w-4/5 mx-auto"></div>

      {/* Gallery */}
      <h3 className="text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-green-900 to-green-700 text-transparent bg-clip-text">
        See Our Work
      </h3>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-4">
        {workImages.map((src, idx) => (
          <div
            key={idx}
            className="overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-transform duration-300 transform hover:scale-105"
          >
            <img
              src={src}
              alt={`Work sample ${idx + 1}`}
              className="w-full h-52 object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
