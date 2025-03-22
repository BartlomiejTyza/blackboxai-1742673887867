import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ClientPanel = () => {
  const { user } = useAuth();
  const [queueStatus, setQueueStatus] = useState(null);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [visitHistory, setVisitHistory] = useState([]);
  const [feedback, setFeedback] = useState({ rating: 5, comments: '' });

  useEffect(() => {
    fetchClientData();
  }, [user]);

  const fetchClientData = async () => {
    try {
      const [queueResponse, loyaltyResponse, historyResponse] = await Promise.all([
        axios.get('/api/queue'),
        axios.get(`/api/loyalty/${user.id}`),
        axios.get(`/api/clients/${user.id}`)
      ]);

      setQueueStatus(queueResponse.data);
      setLoyaltyPoints(loyaltyResponse.data.points);
      setVisitHistory(historyResponse.data.visitHistory);
    } catch (error) {
      console.error('Error fetching client data:', error);
    }
  };

  const joinQueue = async () => {
    try {
      await axios.post('/api/queue/join', {
        clientId: user.id,
        service: 'Waxing' // This could be selected from a dropdown
      });
      fetchClientData(); // Refresh data
    } catch (error) {
      console.error('Error joining queue:', error);
    }
  };

  const submitFeedback = async () => {
    try {
      await axios.post('/api/feedback', {
        clientId: user.id,
        ...feedback
      });
      setFeedback({ rating: 5, comments: '' }); // Reset form
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4">Welcome, {user?.name}!</h1>
        <p className="text-gray-600">Your Loyalty Points: {loyaltyPoints}</p>
        {loyaltyPoints >= 10 && (
          <p className="text-green-600 mt-2">
            You're eligible for a 10% discount on your next visit!
          </p>
        )}
      </div>

      {/* Queue Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Queue System</h2>
        {queueStatus?.isEnabled ? (
          <div>
            <p className="mb-4">Current queue length: {queueStatus?.length || 0}</p>
            <button
              onClick={joinQueue}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Join Queue
            </button>
          </div>
        ) : (
          <p className="text-gray-600">Queue system is currently disabled.</p>
        )}
      </div>

      {/* Visit History */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Visit History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points Earned
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {visitHistory.map((visit, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(visit.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{visit.service}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{visit.pointsEarned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feedback Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Leave Feedback</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Rating</label>
          <select
            value={feedback.rating}
            onChange={(e) => setFeedback({ ...feedback, rating: Number(e.target.value) })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          >
            {[5, 4, 3, 2, 1].map((num) => (
              <option key={num} value={num}>
                {num} Star{num !== 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Comments</label>
          <textarea
            value={feedback.comments}
            onChange={(e) => setFeedback({ ...feedback, comments: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2 w-full h-32"
            placeholder="Share your experience..."
          />
        </div>
        <button
          onClick={submitFeedback}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
};

export default ClientPanel;