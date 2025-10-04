import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApprovalList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingExpenses();
  }, []);

  const fetchPendingExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/expenses/pending');
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching pending expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (expenseId, approve, comments = '') => {
    try {
      await axios.put(`http://localhost:5000/api/expenses/${expenseId}/approve`, {
        approve,
        comments
      });
      fetchPendingExpenses(); // Refresh the list
    } catch (error) {
      console.error('Error updating approval:', error);
    }
  };

  if (loading) {
    return <div>Loading pending approvals...</div>;
  }

  return (
    <div>
      <h3>Pending Approvals</h3>
      {expenses.length === 0 ? (
        <p>No pending approvals.</p>
      ) : (
        <div>
          {expenses.map(expense => (
            <div key={expense._id} style={{ 
              border: '1px solid #ddd', 
              padding: '15px', 
              marginBottom: '15px',
              borderRadius: '5px'
            }}>
              <h4>Expense from {expense.user?.email}</h4>
              <p><strong>Amount:</strong> {expense.originalAmount || expense.amount} {expense.originalCurrency || 'Currency'}</p>
              <p><strong>Category:</strong> {expense.category}</p>
              <p><strong>Description:</strong> {expense.description}</p>
              <p><strong>Date:</strong> {new Date(expense.date).toLocaleDateString()}</p>
              
              <div style={{ marginTop: '10px' }}>
                <button
                  onClick={() => {
                    const comments = prompt('Enter comments (optional):');
                    handleApproval(expense._id, true, comments);
                  }}
                  className="btn btn-success"
                  style={{ marginRight: '10px' }}
                >
                  Approve
                </button>
                
                <button
                  onClick={() => {
                    const comments = prompt('Enter rejection reason:');
                    if (comments) {
                      handleApproval(expense._id, false, comments);
                    }
                  }}
                  className="btn btn-danger"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovalList;
