export { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

export { ToastProvider } from '../contexts/ToastContext';

export { default as DashboardLayout } from '../components/layout/DashboardLayout';

export { default as ProtectedRoute } from './ProtectedRoute';
export { default as PublicRoute } from './PublicRoute';

export { default as Home } from '../pages/Home';
export { default as Test } from '../pages/Test';
export { default as Login } from '../pages/auth/Login';
export { default as Register } from '../pages/auth/Register';
export { default as OTPForm } from '../pages/auth/OTPForm';
export { default as Profile } from '../pages/Profile';
export { default as Dashboard } from '../pages/dashboard/Dashboard';
export { default as Unauthorized } from '../pages/Unauthorized';

export { default as HotelTable } from '../pages/dashboard/tables/HotelTable';
export { default as GuestTable } from '../pages/dashboard/tables/GuestTable';
export { default as UserTable } from '../pages/dashboard/tables/UserTable';
export { default as RoleTable } from '../pages/dashboard/tables/RoleTable';
export { default as RoomTable } from '../pages/dashboard/tables/RoomTable';
export { default as BookingTable } from '../pages/dashboard/tables/BookingTable';
export { default as RoomTypeTable } from '../pages/dashboard/tables/RoomTypeTable';
export { default as PaymentTable } from '../pages/dashboard/tables/PaymentTable';
