import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const EmployeePanel = () => {
  const { user } = useAuth();
  const [queueStatus, setQueueStatus] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);

  useEffect(() => {
    fetchQueueStatus();
    fetchAssignedTasks();
  }, [user]);

  const fetchQueueStatus = async () => {
    try {
      const response = await axios.get('/api/queue');
      setQueueStatus(response.data);
    } catch (error) {
      console.error('Error fetching queue status:', error);
    }
  };

  const fetchAssignedTasks = async () => {
    try {
      const response = await axios.get(`/api/staff/${user.id}/tasks`);
      setAssignedTasks(response.data);
    } catch (error) {
      console.error('Error fetching assigned tasks:', error);
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      await axios.put(`/api/queue/${taskId}/status`, { status });
      fetchQueueStatus(); // Refresh queue status
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user?.name}!</h1>

      {/* Queue Status Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Current Queue Status</h2>
        <ul>
          {queueStatus.map((entry) => (
            <li key={entry._id} className="flex justify-between items-center mb-2">
              <span>{entry.client.name} - {entry.service}</span>
              <button
                onClick={() => updateTaskStatus(entry._id, 'completed')}
                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
              >
                Mark as Completed
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Assigned Tasks Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Assigned Tasks</h2>
        <ul>
          {assignedTasks.map((task) => (
            <li key={task._id} className="mb-2">
              <span>{task.description}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EmployeePanel;