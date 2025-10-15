import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import Dashboard from './pages/dashboard/Dashboard';
import Home from './pages/Home';
import Test from './pages/Test';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import OTPForm from './pages/auth/OTPForm'
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import Profile from './pages/Profile';
import DashboardLayout from './components/layout/DashboardLayout';
import HotelTable from './pages/dashboard/tables/HotelTable';
import Unauthorized from './pages/Unauthorized';
import UserTable from './pages/dashboard/tables/UserTable';
import RoomTable from './pages/dashboard/tables/RoomTable';
import RoleTable from './pages/dashboard/tables/RoleTable';
import GuestTable from './pages/dashboard/tables/GuestTable';
import BookingTable from './pages/dashboard/tables/BookingTable';
import RoomTypeTable from './pages/dashboard/tables/RoomTypeTable';

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
            <Route path="/verify-email" element={<OTPForm />} />
          </Route>

          <Route path='/unauthorized' element={<Unauthorized />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path='/profile/me' element={<Profile />} />

              <Route element={<ProtectedRoute roles={['Admin']} />}>
                <Route path="/hotels" element={<HotelTable />} />
                <Route path="/guests" element={<GuestTable />} />
                <Route path="/users" element={<UserTable />} />
                <Route path="/roles" element={<RoleTable />} />
                <Route path="/rooms" element={<RoomTable />} />
                <Route path="/bookings" element={<BookingTable />} />
                <Route path="/room-types" element={<RoomTypeTable />} />
              </Route>

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