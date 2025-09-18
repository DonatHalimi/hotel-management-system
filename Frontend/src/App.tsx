import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Test from './pages/Test';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import Profile from './pages/Profile';
import DashboardLayout from './components/layout/DashboardLayout';
import HotelTable from './pages/dashboard/HotelTable';
import Unauthorized from './pages/Unauthorized';

const App = () => {
  return (
    <Router>
      <ToastProvider>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/posts' element={<Test />} />

          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route path='/unauthorized' element={<Unauthorized />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path='/profile/me' element={<Profile />} />

              <Route element={<ProtectedRoute roles={['Admin']} />}>
                <Route path="/hotels" element={<HotelTable />} />
              </Route>

              <Route path='/reservations' element={<div>Reservations Page</div>} />
              <Route path='/settings' element={<div>Settings Page</div>} />
              <Route path='/support' element={<div>Support Page</div>} />
            </Route>
          </Route>
        </Routes>
      </ToastProvider>
    </Router>
  );
};

export default App;