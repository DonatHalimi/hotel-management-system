import {
  Router,
  Routes,
  Route,
  ToastProvider,
  PublicRoute,
  ProtectedRoute,
  DashboardLayout,
  Home,
  Test,
  Login,
  Register,
  OTPForm,
  Unauthorized,
  Dashboard,
  Profile,
  HotelTable,
  GuestTable,
  UserTable,
  RoleTable,
  RoomTable,
  BookingTable,
  RoomTypeTable,
  PaymentTable,
} from './routes/imports';

const App = () => {
  return (
    <Router>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts" element={<Test />} />

          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<OTPForm />} />
          </Route>

          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile/me" element={<Profile />} />

              <Route element={<ProtectedRoute roles={['Admin']} />}>
                <Route path="/hotels" element={<HotelTable />} />
                <Route path="/guests" element={<GuestTable />} />
                <Route path="/users" element={<UserTable />} />
                <Route path="/roles" element={<RoleTable />} />
                <Route path="/rooms" element={<RoomTable />} />
                <Route path="/bookings" element={<BookingTable />} />
                <Route path="/room-types" element={<RoomTypeTable />} />
                <Route path="/payments" element={<PaymentTable />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </ToastProvider>
    </Router>
  );
};

export default App;