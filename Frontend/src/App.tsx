import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import CustomersDemo from './pages/Customers';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Test from './pages/Test';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

const App = () => {
  return (
    <Router>
      <ToastProvider>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/posts' element={<Test />} />
          <Route path='/customers' element={<CustomersDemo />} />

          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </ToastProvider>
    </Router>
  );
};

export default App;