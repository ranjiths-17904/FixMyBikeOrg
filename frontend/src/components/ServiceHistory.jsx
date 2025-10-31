import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  IndianRupee,
  Download,
  Filter,
  Bike
} from 'lucide-react';

export default function ServiceHistory() {
  const [filter, setFilter] = useState('all');

  const serviceRecords = [
    {
      id: 1,
      date: '2024-01-15',
      bike: 'Royal Enfield Classic 350',
      service: 'Full Service & Oil Change',
      shop: 'ProBike Garage - Chennai',
      cost: 1500,
      status: 'completed',
      description: 'Oil change, air filter cleaning, brake tuning, and chain lubrication.',
      nextService: '2024-04-15'
    },
    {
      id: 2,
      date: '2024-01-08',
      bike: 'TVS Apache RTR 160',
      service: 'Brake Pad Replacement',
      shop: 'Speed Motors - Coimbatore',
      cost: 600,
      status: 'completed',
      description: 'Replaced front brake pads and adjusted brake lever.',
      nextService: '2024-07-08'
    },
    {
      id: 3,
      date: '2024-01-20',
      bike: 'Bajaj Pulsar 220F',
      service: 'Chain Replacement',
      shop: 'Urban Ride - Bangalore',
      cost: 950,
      status: 'in-progress',
      description: 'Replaced worn-out chain and cleaned sprockets.',
      nextService: '2024-08-20'
    },
    {
      id: 4,
      date: '2023-12-10',
      bike: 'Hero Splendor Plus',
      service: 'Tyre Replacement',
      shop: 'Hero Service Hub - Hyderabad',
      cost: 2200,
      status: 'completed',
      description: 'Replaced both tyres and performed wheel alignment.',
      nextService: '2024-12-10'
    }
  ];

  const filteredRecords =
    filter === 'all' ? serviceRecords : serviceRecords.filter((r) => r.status === filter);

  const totalSpent = serviceRecords
    .filter((r) => r.status === 'completed')
    .reduce((sum, r) => sum + r.cost, 0);

  return (
    <div className="bg-gray-100">
      <div className="space-y-6 space-x-8 px-4 py-8 max-w-11/12 mx-auto">
        {/* Header */}
        <div className="bg-gray-50 rounded-xl shadow-md border border-green-500 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Bike className="h-6 w-6 text-green-600" /> Example Bike Service History
              </h2>
              <p className="text-gray-600 text-sm">
                Keep track of your bike maintenance records across all service centers in India.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="bg-green-50 px-4 py-2 rounded-lg shadow-sm">
                <p className="text-sm text-green-600 font-medium">Total Spent</p>
                <p className="text-2xl font-bold text-green-700">₹{totalSpent.toLocaleString('en-IN')}
                </p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center gap-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Filter by status:</span>
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All Records' },
              { value: 'completed', label: 'Completed' },
              { value: 'in-progress', label: 'In Progress' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 shadow-sm ${
                  filter === option.value
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Records */}
        <div className="space-y-4">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition duration-200"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div className="flex-1">
                  <div className="flex gap-4">
                    <div
                      className={`p-2 rounded-lg ${
                        record.status === 'completed'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-orange-100 text-orange-600'
                      }`}
                    >
                      {record.status === 'completed' ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <AlertCircle className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{record.service}</h3>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            record.status === 'completed'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-orange-100 text-orange-600'
                          }`}
                        >
                          {record.status === 'completed' ? 'Completed' : 'In Progress'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{record.description}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(record.date).toLocaleDateString('en-IN')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Bike:</span>
                          <span>{record.bike}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Service Center:</span>
                          <span>{record.shop}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-between items-start lg:items-end gap-2">
                  <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
                    <IndianRupee className="h-5 w-5" />
                    <span>{record.cost.toLocaleString('en-IN')}</span>
                  </div>
                  {record.status === 'completed' && (
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Next service:</span>
                      <span className="ml-1">
                        {new Date(record.nextService).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* No Records */}
          {filteredRecords.length === 0 && (
            <div className="bg-white text-center p-12 rounded-xl border shadow-sm">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Records Found</h3>
              <p className="text-gray-600 text-sm">
                No service records available for the selected filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
