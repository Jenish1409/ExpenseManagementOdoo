# Expense Management System

A full-stack expense management application with role-based access control, OCR receipt processing, and multi-level approval workflows.

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (local or cloud) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** (for cloning)

### Step 1: Clone and Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd expense-management

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Environment Setup
Create a `.env` file in the `backend/` directory:
```env
MONGO_URI=mongodb://localhost:27017/expense-management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

### Step 3: Start the Application

**Terminal 1 - Backend Server:**
```bash
cd backend
node server.js
```
✅ Backend running on: http://localhost:5000

**Terminal 2 - Frontend Server:**
```bash
cd frontend
npm start
```
✅ Frontend running on: http://localhost:3000

### Step 4: First Time Setup
1. **Open**: http://localhost:3000
2. **Sign Up**: Create your admin account
   - Enter email and password
   - Select your country (for currency)
3. **Login**: Use your admin credentials
4. **Create Users**: Go to User Management tab
   - Create Managers (check "Can approve expenses")
   - Create Employees (assign them to managers)

## 🎯 Core Features

### ✅ Authentication & User Management
- **Signup**: Auto-creates Company and Admin User with country-based currency
- **Login**: JWT-based authentication with role-based access
- **User Creation**: Admin can create Employees & Managers
- **Manager Assignment**: Easy dropdown selection for manager assignment

### ✅ Expense Submission (Employee Role)
- **Submit Expenses**: Amount, Category, Description, Date with currency conversion
- **OCR Integration**: Upload receipt images for automatic data extraction
- **View History**: See all submitted expenses with approval status
- **Multi-currency Support**: Automatic conversion to company currency

### ✅ Approval Workflow (Manager Role)
- **Pending Approvals**: Managers can see expenses awaiting approval
- **Approve/Reject**: Simple approve/reject with comments
- **Status Tracking**: Real-time expense status updates
- **Multi-level Approval**: Support for complex approval chains

### ✅ Admin Dashboard
- **User Management**: Create and manage all users
- **Manager Assignment**: Assign managers to employees via dropdown
- **System Overview**: View all expenses and approvals
- **Company Settings**: Currency and company configuration

## 📁 Project Structure

```
expense-management/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema with roles and permissions
│   │   ├── Company.js       # Company schema with currency
│   │   └── Expense.js       # Expense schema with approval workflow
│   ├── routes/
│   │   ├── auth.js          # Authentication & user management routes
│   │   └── expenses.js      # Expense submission & approval routes
│   ├── server.js            # Main server file
│   ├── package.json         # Backend dependencies
│   └── .env                 # Environment variables (create this)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Signup.js    # User registration with country selection
│   │   │   ├── Login.js     # User authentication
│   │   │   ├── Dashboard.js # Role-based dashboard
│   │   │   ├── ExpenseForm.js # Expense submission with OCR
│   │   │   ├── ExpenseList.js # View submitted expenses
│   │   │   ├── ApprovalList.js # Approve/reject expenses
│   │   │   └── UserManagement.js # Admin user management
│   │   ├── contexts/
│   │   │   └── AuthContext.js # Authentication context
│   │   ├── App.js           # Main app component with routing
│   │   ├── index.js         # App entry point
│   │   └── index.css        # Basic styling
│   ├── public/
│   │   └── index.html       # HTML template
│   └── package.json         # Frontend dependencies
├── README.md                # This file
└── .gitignore              # Git ignore rules
```

## 🔧 Detailed Setup Instructions

### Backend Setup (Node.js + Express + MongoDB)

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**:
   Create `.env` file in `backend/` directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/expense-management
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   ```

3. **Start Backend Server**:
   ```bash
   node server.js
   # or
   npm start
   ```

### Frontend Setup (React)

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm start
   ```

## 🧪 Testing the Application

### 1. Admin Setup
1. Go to http://localhost:3000/signup
2. Create admin account:
   - Email: `admin@company.com`
   - Password: `password123`
   - Country: `United States`
3. Login and access dashboard

### 2. Create Users
1. **Go to User Management tab**
2. **Create a Manager**:
   - Email: `manager@company.com`
   - Password: `password123`
   - Role: `Manager`
   - Check "Can approve expenses as manager"
   - Manager ID: Leave empty
3. **Create an Employee**:
   - Email: `employee@company.com`
   - Password: `password123`
   - Role: `Employee`
   - Manager Assignment: Select `manager@company.com (Manager)`

### 3. Test Expense Flow
1. **Login as Employee**:
   - Submit an expense with receipt image (OCR will extract amount/date)
   - View "My Expenses" to see submission
2. **Login as Manager**:
   - Go to "Approvals" tab
   - Approve or reject the expense
3. **Login as Employee**:
   - Check "My Expenses" to see approval status

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new admin user
- `POST /api/auth/login` - User login
- `GET /api/auth/users` - Get all users (Admin only)
- `POST /api/auth/users` - Create new users (Admin only)
- `PUT /api/auth/users/:id` - Update user (Admin only)

### Expenses
- `POST /api/expenses` - Submit new expense
- `GET /api/expenses/my` - Get user's expenses
- `GET /api/expenses/pending` - Get pending approvals (Manager/Admin)
- `PUT /api/expenses/:id/approve` - Approve/reject expense
- `GET /api/expenses` - Get all expenses (Admin only)

### Utilities
- `GET /api/countries` - Get countries and currencies

## 🎨 Key Features Explained

### OCR Integration
- Uses Tesseract.js for receipt text extraction
- Automatically extracts amounts and dates from receipt images
- Falls back to manual entry if OCR fails

### Role-based Access
- **Admin**: Full system access, user management, expense oversight
- **Manager**: Expense approval, team management, personal expenses
- **Employee**: Expense submission, personal expense tracking

### Currency Support
- Automatic currency conversion to company currency
- Supports major currencies (USD, EUR, GBP, INR, CAD)
- Country-based currency selection during signup

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Ensure MongoDB is running: `mongod`
   - Check connection string in `.env` file

2. **Port Already in Use**:
   - Backend: Change PORT in `.env` file
   - Frontend: Use `PORT=3001 npm start`

3. **CORS Issues**:
   - Backend has CORS enabled
   - Ensure frontend URL is correct

4. **OCR Not Working**:
   - Ensure Tesseract.js is installed
   - Check browser console for errors
   - Use clear, high-contrast receipt images

### Dependencies Check
```bash
# Backend dependencies
cd backend && npm list

# Frontend dependencies  
cd frontend && npm list
```

## 📝 Development Notes

- **Backend**: Express.js with MongoDB and Mongoose
- **Frontend**: React with React Router for navigation
- **Authentication**: JWT tokens with role-based middleware
- **Database**: MongoDB with Mongoose ODM
- **Styling**: Custom CSS with Bootstrap classes
- **OCR**: Tesseract.js for receipt processing

## 🔮 Future Enhancements

- Email notifications for approvals
- Advanced reporting and analytics
- Mobile app development
- Integration with accounting software
- Advanced OCR with ML models
- Bulk expense import
- Approval workflow configuration UI
- Real-time notifications
- Advanced search and filtering

## 📄 License

This project is for educational purposes. Please ensure you have proper licenses for production use.

---

## 🎉 Ready to Use!

Your Expense Management System is now fully functional with:
- ✅ Complete authentication system
- ✅ Role-based user management
- ✅ Expense submission with OCR
- ✅ Multi-level approval workflow
- ✅ Currency conversion support
- ✅ Modern, responsive UI

**Start using it at**: http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new admin user
- `POST /api/auth/login` - User login
- `POST /api/auth/users` - Create new users (Admin only)
- `PUT /api/auth/users/:id` - Update user (Admin only)

### Expenses
- `POST /api/expenses` - Submit new expense
- `GET /api/expenses/my` - Get user's expenses
- `GET /api/expenses/pending` - Get pending approvals (Manager/Admin)
- `PUT /api/expenses/:id/approve` - Approve/reject expense
- `GET /api/expenses` - Get all expenses (Admin only)
- `PUT /api/expenses/:id/rules` - Configure approval rules (Admin only)

### Utilities
- `GET /api/countries` - Get countries and currencies

## Usage Guide

### 1. Initial Setup
1. Start both backend and frontend servers
2. Go to `http://localhost:3000/signup`
3. Create an admin account with your country
4. Login and access the dashboard

### 2. User Management (Admin)
1. Go to "User Management" tab
2. Create employees and managers
3. Assign managers to employees
4. Set approval permissions

### 3. Expense Submission (Employee)
1. Go to "Submit Expense" tab
2. Upload receipt image (optional - OCR will extract amount/date)
3. Fill in expense details
4. Submit for approval

### 4. Expense Approval (Manager)
1. Go to "Approvals" tab
2. Review pending expenses
3. Approve or reject with comments

### 5. Expense Tracking
1. View "My Expenses" to track submission status
2. See approval history and comments

## Key Features Explained

### OCR Integration
- Uses Tesseract.js for receipt text extraction
- Automatically extracts amounts and dates
- Falls back to manual entry if OCR fails

### Approval Workflow
- Multi-level approval support
- Conditional approval rules (percentage-based, specific approvers)
- Sequential approval process
- Real-time status updates

### Currency Conversion
- Automatic currency conversion to company currency
- Supports major currencies (USD, EUR, GBP, INR, CAD)
- Uses ExchangeRate-API for real-time rates

### Role-based Access
- **Admin**: Full system access, user management
- **Manager**: Expense approval, team management
- **Employee**: Expense submission, personal tracking

## Testing with Postman

### 1. Test Authentication
```bash
# Signup
POST http://localhost:5000/api/auth/signup
{
  "email": "admin@example.com",
  "password": "password123",
  "country": "United States"
}

# Login
POST http://localhost:5000/api/auth/login
{
  "email": "admin@example.com",
  "password": "password123"
}
```

### 2. Test Expense Submission
```bash
POST http://localhost:5000/api/expenses
Headers: x-auth-token: <your-token>
{
  "amount": 100,
  "currency": "USD",
  "category": "Travel",
  "description": "Business trip",
  "date": "2024-01-15"
}
```

## Development Notes

- Backend uses Express.js with MongoDB and Mongoose
- Frontend uses React with React Router for navigation
- Authentication handled via JWT tokens
- CORS enabled for cross-origin requests
- Error handling implemented throughout

## Future Enhancements

- Email notifications for approvals
- Advanced reporting and analytics
- Mobile app development
- Integration with accounting software
- Advanced OCR with ML models
- Bulk expense import
- Approval workflow configuration UI

## Troubleshooting

### Common Issues
1. **MongoDB Connection Error**: Ensure MongoDB is running and connection string is correct
2. **CORS Issues**: Backend has CORS enabled, check if frontend URL is correct
3. **OCR Not Working**: Ensure Tesseract.js is properly installed and images are clear
4. **Authentication Issues**: Check JWT_SECRET in environment variables

### Dependencies
Make sure all required packages are installed:
- Backend: express, mongoose, bcryptjs, jsonwebtoken, cors, axios, dotenv
- Frontend: react, react-dom, react-router-dom, axios, bootstrap, tesseract.js

## License

This project is for educational purposes. Please ensure you have proper licenses for production use.
