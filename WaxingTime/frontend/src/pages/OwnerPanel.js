import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const OwnerPanel = () => {
  const { user } = useAuth();
  const [queueEnabled, setQueueEnabled] = useState(true);
  const [revenueData, setRevenueData] = useState(null);
  const [staffData, setStaffData] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [revenueRes, staffRes, inventoryRes, feedbackRes] = await Promise.all([
        axios.get('/api/reports/revenue'),
        axios.get('/api/staff'),
        axios.get('/api/inventory'),
        axios.get('/api/feedback')
      ]);

      setRevenueData(revenueRes.data);
      setStaffData(staffRes.data);
      setInventory(inventoryRes.data);
      setFeedback(feedbackRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const toggleQueueSystem = async () => {
    try {
      await axios.put('/api/queue/toggle', { isEnabled: !queueEnabled });
      setQueueEnabled(!queueEnabled);
    } catch (error) {
      console.error('Error toggling queue system:', error);
    }
  };

  const sendPromotion = async (promotion) => {
    try {
      await axios.post('/api/notifications/send', promotion);
    } catch (error) {
      console.error('Error sending promotion:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Owner Dashboard</h1>
        <button
          onClick={toggleQueueSystem}
          className={`px-4 py-2 rounded ${
            queueEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          } text-white`}
        >
          {queueEnabled ? 'Disable Queue' : 'Enable Queue'}
        </button>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Revenue Overview</h2>
        {revenueData && (
          <div className="h-64">
            <Line
              data={{
                labels: Object.keys(revenueData.dailyBreakdown),
                datasets: [
                  {
                    label: 'Daily Revenue',
                    data: Object.values(revenueData.dailyBreakdown),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false
              }}
            />
          </div>
        )}
      </div>

      {/* Staff Management */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Staff Management</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {staffData.map((staff) => (
                <tr key={staff._id} className="border-b">
                  <td className="px-6 py-4">{staff.name}</td>
                  <td className="px-6 py-4">{staff.performance}%</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded ${
                      staff.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {staff.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Management */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Inventory Status</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item._id} className="border-b">
                  <td className="px-6 py-4">{item.productName}</td>
                  <td className="px-6 py-4">{item.quantity}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded ${
                      item.quantity > item.threshold ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.quantity > item.threshold ? 'In Stock' : 'Low Stock'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feedback Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Customer Feedback</h2>
        {feedback.length > 0 && (
          <div className="h-64">
            <Bar
              data={{
                labels: ['5★', '4★', '3★', '2★', '1★'],
                datasets: [
                  {
                    label: 'Rating Distribution',
                    data: [
                      feedback.filter(f => f.rating === 5).length,
                      feedback.filter(f => f.rating === 4).length,
                      feedback.filter(f => f.rating === 3).length,
                      feedback.filter(f => f.rating === 2).length,
                      feedback.filter(f => f.rating === 1).length,
                    ],
                    backgroundColor: 'rgba(75, 192, 192, 0.6)'
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerPanel;