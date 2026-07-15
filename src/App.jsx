import React, { Suspense } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Loading from "./components/Loading";
import ProtectedRoute from "./components/ProtectedRoute";

// IMPORT SEMUA HALAMAN 
const LandingPage = React.lazy(() => import("./pages/LandingPage")); 
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Services = React.lazy(() => import("./pages/Services"));
const Orders = React.lazy(() => import("./pages/Orders"));
const Customers = React.lazy(() => import("./pages/Customers"));
const Products = React.lazy(() => import("./pages/Products"));
const ProductDetail = React.lazy(() => import("./pages/ProductDetail"));
const Kapster = React.lazy(() => import("./pages/Kapster")); 
const Users = React.lazy(() => import("./pages/Users")); 

const ErrorDisplay = React.lazy(() => import("./pages/ErrorDisplay"));
const MainLayout = React.lazy(() => import("./layouts/MainLayout"));
const AuthLayout = React.lazy(() => import("./layouts/AuthLayout"));
const Forgot = React.lazy(() => import("./pages/Auth/Forget"));
const Promo = React.lazy(() => import("./pages/Promo"));
const Reviews = React.lazy(() => import("./pages/Reviews"));

// IMPORT HALAMAN MEMBER BARU
const LoginMember = React.lazy(() => import("./pages/LoginMember")); 
const RegisterMember = React.lazy(() => import("./pages/RegisterMember"));
const MemberDashboard = React.lazy(() => import("./pages/MemberDashboard"));
const Booking = React.lazy(() => import("./pages/Booking"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* RUTE GUEST / PUBLIK DI LUAR LAYOUT ADMIN */}
        <Route path="/" element={<LandingPage />} />
        
        {/* RUTE HALAMAN MEMBER & BOOKING (Berdiri Sendiri / Full Screen) */}
        <Route path="/login" element={<LoginMember />} />
        <Route path="/register" element={<RegisterMember />} />
        
        <Route path="/member-dashboard" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <MemberDashboard />
          </ProtectedRoute>
        } />
        <Route path="/booking" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <Booking />
          </ProtectedRoute>
        } />

        {/* RUTE DASHBOARD ADMIN (Dibungkus MainLayout agar ada Sidebar) */}
        <Route element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<Dashboard />} /> 
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/users" element={<Users />} />
          <Route path="/services" element={<Services />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/kapster" element={<Kapster />} />
          <Route path="/promo" element={<Promo />} />
          <Route path="/reviews" element={<Reviews />} />
          
          <Route path="/error/:code" element={<ErrorDisplay />} />
        </Route>
        
        {/* RUTE AUTENTIKASI ADMIN & REGISTER */}
        <Route element={<AuthLayout />}>
          <Route path="/forgot" element={<Forgot />} />
        </Route>

        <Route path="*" element={<ErrorDisplay />} />
      </Routes>
    </Suspense>
  );
}

export default App;