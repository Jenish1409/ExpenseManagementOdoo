import React, { useState } from 'react';
import axios from 'axios';
import Tesseract from 'tesseract.js';

const ExpenseForm = () => {
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const { data: { text } } = await Tesseract.recognize(file, 'eng');
      
      // Parse text for amount, date, description
      const amountMatch = text.match(/\$?(\d+\.?\d*)/);
      const dateMatch = text.match(/(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/);
      
      if (amountMatch) {
        setFormData(prev => ({
          ...prev,
          amount: amountMatch[1]
        }));
      }
      
      if (dateMatch) {
        const dateStr = dateMatch[1];
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          setFormData(prev => ({
            ...prev,
            date: date.toISOString().split('T')[0]
          }));
        }
      }
      
      // Use the full text as description if no specific parsing
      setFormData(prev => ({
        ...prev,
        description: prev.description || text.substring(0, 200)
      }));
      
    } catch (error) {
      console.error('OCR Error:', error);
      setMessage('Error processing image. Please enter details manually.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.post('http://localhost:5000/api/expenses', formData);
      setMessage('Expense submitted successfully!');
      setFormData({
        amount: '',
        currency: 'USD',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      setMessage(error.response?.data?.msg || 'Error submitting expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Submit New Expense</h3>
      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Receipt Image (Optional - OCR will extract amount and date)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="form-control"
          />
          {loading && <p>Processing image...</p>}
        </div>

        <div className="form-group">
          <label>Amount *</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="form-control"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label>Currency</label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="form-control"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="INR">INR</option>
            <option value="CAD">CAD</option>
          </select>
        </div>

        <div className="form-group">
          <label>Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Select Category</option>
            <option value="Travel">Travel</option>
            <option value="Meals">Meals</option>
            <option value="Office Supplies">Office Supplies</option>
            <option value="Transportation">Transportation</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Date *</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Expense'}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
