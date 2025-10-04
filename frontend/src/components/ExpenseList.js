import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/expenses/my');
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'green';
      case 'Rejected': return 'red';
      case 'Pending': return 'orange';
      default: return 'black';
    }
  };

  if (loading) {
    return <div>Loading expenses...</div>;
  }

  return (
    <div>
      <h3>My Expenses</h3>
      {expenses.length === 0 ? (
        <p>No expenses found.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Currency</th>
              <th>Category</th>
              <th>Description</th>
              <th>Date</th>
              <th>Status</th>
              <th>Approvers</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(expense => (
              <tr key={expense._id}>
                <td>{expense.originalAmount || expense.amount}</td>
                <td>{expense.originalCurrency || 'Company Currency'}</td>
                <td>{expense.category}</td>
                <td>{expense.description}</td>
                <td>{new Date(expense.date).toLocaleDateString()}</td>
                <td style={{ color: getStatusColor(expense.status) }}>
                  {expense.status}
                </td>
                <td>
                  {expense.approvers.map((approver, index) => (
                    <div key={index}>
                      {approver.user?.email}: 
                      {approver.approved === true ? ' ✓ Approved' : 
                       approver.approved === false ? ' ✗ Rejected' : ' ⏳ Pending'}
                      {approver.comments && ` (${approver.comments})`}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExpenseList;
