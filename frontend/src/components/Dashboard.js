import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import ApprovalList from './ApprovalList';
import UserManagement from './UserManagement';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(user?.role === 'Admin' ? 'users' : 'expenses');

  if (!user) {
    return <div className="container">Please log in to access the dashboard.</div>;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'expenses':
        return user.role === 'Admin' ? <div><p>Admins cannot submit expenses. Use the User Management tab to create employees who can submit expenses.</p></div> : <ExpenseForm />;
      case 'my-expenses':
        return <ExpenseList />;
      case 'approvals':
        return ['Manager', 'Admin'].includes(user.role) ? <ApprovalList /> : null;
      case 'users':
        return user.role === 'Admin' ? <UserManagement /> : null;
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <h2>Dashboard</h2>
      <p>Welcome, {user.email} ({user.role})</p>
      
      <div style={{ marginBottom: '20px' }}>
        {user.role !== 'Admin' && (
          <button 
            className={`btn ${activeTab === 'expenses' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('expenses')}
            style={{ marginRight: '10px' }}
          >
            Submit Expense
          </button>
        )}
        
        <button 
          className={`btn ${activeTab === 'my-expenses' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('my-expenses')}
          style={{ marginRight: '10px' }}
        >
          My Expenses
        </button>
        
        {['Manager', 'Admin'].includes(user.role) && (
          <button 
            className={`btn ${activeTab === 'approvals' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('approvals')}
            style={{ marginRight: '10px' }}
          >
            Approvals
          </button>
        )}
        
        {user.role === 'Admin' && (
          <button 
            className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('users')}
          >
            User Management
          </button>
        )}
      </div>
      
      {renderContent()}
    </div>
  );
};

export default Dashboard;
