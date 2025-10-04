import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'Employee',
    managerId: '',
    isManagerApprover: false
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [availableManagers, setAvailableManagers] = useState([]);
  const [showManagerDropdown, setShowManagerDropdown] = useState(false);

  // Fetch available managers when component loads
  useEffect(() => {
    fetchAvailableManagers();
  }, []);

  const fetchAvailableManagers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/users');
      // Filter for managers and admins who can approve
      const managers = response.data.filter(user => 
        (user.role === 'Manager' && user.isManagerApprover) || 
        user.role === 'Admin'
      );
      setAvailableManagers(managers);
    } catch (error) {
      console.error('Error fetching managers:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      console.log('Submitting user data:', formData);
      const response = await axios.post('http://localhost:5000/api/auth/users', formData);
      setMessage('User created successfully!');
      setFormData({
        email: '',
        password: '',
        role: 'Employee',
        managerId: '',
        isManagerApprover: false
      });
      // Refresh the manager list
      fetchAvailableManagers();
    } catch (error) {
      console.error('Error creating user:', error);
      const errorMessage = error.response?.data?.msg || error.response?.data?.error || 'Error creating user';
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>User Management</h3>
      
      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}

      <h4>Create New User</h4>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label>Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label>Role *</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="Employee">Employee</option>
            <option value="Manager">Manager</option>
          </select>
        </div>

        <div className="form-group">
          <label>Manager Assignment (Optional)</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <select
              name="managerId"
              value={formData.managerId}
              onChange={handleChange}
              className="form-control"
              style={{ flex: 1 }}
            >
              <option value="">No Manager (Leave Empty)</option>
              {availableManagers.map(manager => (
                <option key={manager._id} value={manager._id}>
                  {manager.email} ({manager.role})
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={fetchAvailableManagers}
              className="btn btn-secondary"
              style={{ whiteSpace: 'nowrap' }}
            >
              Refresh
            </button>
          </div>
          <small className="form-text text-muted">
            <strong>For Employees:</strong> If no manager selected, admin will be assigned automatically.<br/>
            <strong>For Managers:</strong> Leave empty unless you want to assign them to another manager.
          </small>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="isManagerApprover"
              checked={formData.isManagerApprover}
              onChange={handleChange}
            />
            Can approve expenses as manager
          </label>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create User'}
        </button>
      </form>

      <div style={{ marginTop: '30px' }}>
        <h4>Current Users</h4>
        {availableManagers.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Can Approve</th>
                <th>User ID</th>
              </tr>
            </thead>
            <tbody>
              {availableManagers.map(user => (
                <tr key={user._id}>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.isManagerApprover ? 'Yes' : 'No'}</td>
                  <td style={{ fontSize: '12px', fontFamily: 'monospace' }}>{user._id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No users found. Create some users first!</p>
        )}
        
        <h4>Instructions</h4>
        <ul>
          <li>Create employees and managers for your company</li>
          <li>Use the dropdown above to assign managers to employees</li>
          <li>Check "Can approve expenses as manager" to allow managers to approve expenses</li>
          <li>For Employees: If no manager selected, admin will be assigned automatically</li>
          <li>Only admins can create and manage users</li>
        </ul>
      </div>
    </div>
  );
};

export default UserManagement;
