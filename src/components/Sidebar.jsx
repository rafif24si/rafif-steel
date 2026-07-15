// src/components/Sidebar.jsx
import React, { useState, useEffect } from "react";
import {
  FaCut, FaCalendarCheck, FaUsers, FaThLarge,
  FaBoxOpen, FaUserTie, FaSignOutAlt, FaChevronLeft,
  FaCog, FaQuestionCircle, FaChevronRight, FaTicketAlt, FaStar
} from "react-icons/fa";
import { NavLink, useLocation, useNavigate } from "react-router-dom"; // TAMBAHKAN useNavigate di sini

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // INISIALISASI useNavigate

  // KOMENTAR DEMO: Mengambil data user dari localStorage agar informasi profil admin yang login (nama & email) bisa ditampilkan di Sidebar secara dinamis.
  const [userData, setUserData] = useState({ name: 'Admin User', email: 'admin@haircut.id' });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserData({
          name: parsed.nama || parsed.username || parsed.email || 'Admin User',
          email: parsed.email || 'admin@haircut.id'
        });
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, []);

  const userInitial = userData.name.charAt(0).toUpperCase();

  // Reset animasi saat navigasi
  useEffect(() => {
    setIsAnimating(false);
  }, [location.pathname]);

  const menuClass = ({ isActive }) =>
    `flex cursor-pointer items-center rounded-2xl px-4 py-3 text-[14px] font-medium transition-colors duration-200 relative ${isActive
      ? "text-[#0C0C0C] bg-gradient-to-r from-[#EDEEFC] to-[#F5F3FF] font-semibold shadow-sm"
      : "text-gray-500 hover:text-[#0C0C0C] hover:bg-gray-50/80"
    }`;

  const menuItems = [
    {
      group: "Dashboards",
      items: [
        { to: "/dashboard", icon: FaThLarge, label: "Dashboard" }
      ]
    },
    {
      group: "Management",
      items: [
        { to: "/orders", icon: FaCalendarCheck, label: "Orders", badge: "12" },
        { to: "/customers", icon: FaUsers, label: "Customers" },
        { to: "/services", icon: FaCut, label: "Services" },
        { to: "/products", icon: FaBoxOpen, label: "Products" },
        { to: "/promo", icon: FaTicketAlt, label: "Promo" },
        { to: "/kapster", icon: FaUserTie, label: "Kapster", highlight: true },
        { to: "/users", icon: FaUserTie, label: "Users", highlight: true },
        { to: "/reviews", icon: FaStar, label: "Reviews" },
      ]
    }
  ];

  // KOMENTAR DEMO: Menangani proses Logout. Menghapus data kredensial/sesi admin dari localStorage dan mengembalikan pengguna ke halaman utama (Landing Page).
  // FUNGSI LOGOUT YANG SUDAH DIPERBAIKI
  const handleLogout = () => {
    // 1. Menghapus data sesi (user) yang tersimpan saat login
    localStorage.removeItem('user');

    // 2. Mengarahkan pengguna secara paksa ke halaman Login ("/login")
    navigate('/login');
  };

  const handleToggle = () => {
    setIsAnimating(true);
    setIsCollapsed(!isCollapsed);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const collapsed = isCollapsed && !isHovered;

  return (
    <>
      {/* Spacer untuk mencegah layout shift */}
      <div
        className="flex-shrink-0 transition-all duration-300 ease-in-out"
        style={{
          width: collapsed ? '80px' : '280px',
          minWidth: collapsed ? '80px' : '280px',
        }}
      />

      {/* Sidebar Fixed */}
      <div
        id="sidebar"
        className="fixed top-0 left-0 h-full flex flex-col bg-white border-r border-gray-100 font-sans z-40"
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          width: collapsed ? '80px' : '280px',
          transition: isAnimating ? 'width 300ms ease-in-out' : 'none',
          transform: 'translateZ(0)', // Force GPU rendering
          backfaceVisibility: 'hidden', // Prevent flickering
        }}
        onMouseEnter={() => {
          if (isCollapsed) setIsHovered(true);
        }}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Toggle Button */}
        <button
          onClick={handleToggle}
          className="absolute -right-3 top-8 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 z-50 hover:bg-gray-50"
        >
          {collapsed ? (
            <FaChevronRight className="text-xs text-gray-400" />
          ) : (
            <FaChevronLeft className="text-xs text-gray-400" />
          )}
        </button>

        {/* Logo Section */}
        <div className="px-4 pt-8 pb-6 flex-shrink-0">
          <div className={`flex items-center gap-3 mb-3 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-11 h-11 bg-gradient-to-br from-[#101623] to-[#2A3A4F] rounded-2xl flex items-center justify-center shadow-lg shadow-slate-300/50 flex-shrink-0">
              <FaCut className="text-white text-lg" />
            </div>

            {!collapsed && (
              <h1 className="text-[32px] font-black tracking-tight flex items-baseline whitespace-nowrap">
                <span className="text-[#101623]">Hair</span>
                <span className="text-[#495B70]">Cut.</span>
              </h1>
            )}
          </div>

          {!collapsed && (
            <div className="ml-1">
              <p className="text-[#8E9AAC] text-[13px] font-medium whitespace-nowrap">
                Barbershop Admin
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse flex-shrink-0"></span>
                <span className="text-[11px] text-emerald-500 font-semibold whitespace-nowrap">Online</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 px-3 overflow-y-auto overflow-x-hidden">
          {menuItems.map((group, groupIdx) => (
            <div key={groupIdx} className="mb-6">
              {/* Group Label */}
              {!collapsed && (
                <div
                  className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-4 cursor-pointer flex items-center justify-between hover:text-gray-600 transition-colors"
                  onClick={() => setActiveGroup(activeGroup === groupIdx ? null : groupIdx)}
                >
                  <span>{group.group}</span>
                  <FaChevronRight
                    className={`text-[8px] transition-transform duration-200 ${activeGroup === groupIdx ? 'rotate-90' : ''
                      }`}
                  />
                </div>
              )}

              {/* Menu Items */}
              <ul className="space-y-1">
                {group.items.map((item, idx) => {
                  const isActive = location.pathname === item.to;
                  const Icon = item.icon;

                  return (
                    <li key={idx}>
                      <NavLink
                        to={item.to}
                        className={menuClass}
                        title={collapsed ? item.label : ''}
                        onClick={() => setIsAnimating(false)}
                      >
                        {/* Active Indicator */}
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#101623] rounded-r-full"></div>
                        )}

                        {/* Icon */}
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0 ${collapsed ? 'mr-0' : 'mr-3'
                          } ${isActive
                            ? 'bg-white shadow-md shadow-slate-200/50'
                            : 'bg-transparent group-hover:bg-white group-hover:shadow-sm'
                          } ${item.highlight ? 'bg-emerald-50 group-hover:bg-emerald-100' : ''}`}>
                          <Icon className={`text-lg transition-colors duration-200 ${isActive
                              ? 'text-[#101623]'
                              : item.highlight
                                ? 'text-emerald-600'
                                : 'text-gray-400 group-hover:text-gray-600'
                            }`} />
                        </div>

                        {/* Label & Badge */}
                        {!collapsed && (
                          <>
                            <span className="flex-1 whitespace-nowrap">{item.label}</span>

                            {item.badge && (
                              <span className={`ml-auto px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${isActive
                                  ? 'bg-[#101623] text-white'
                                  : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                                }`}>
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className={`pb-6 pt-4 border-t border-gray-100 flex-shrink-0 ${collapsed ? 'px-2' : 'px-3'}`}>
          {/* Help & Settings */}
          {!collapsed && (
            <div className="space-y-1 mb-4">
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all duration-200">
                <FaQuestionCircle className="text-gray-400 flex-shrink-0" />
                <span className="whitespace-nowrap">Help Center</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all duration-200">
                <FaCog className="text-gray-400 flex-shrink-0" />
                <span className="whitespace-nowrap">Settings</span>
              </button>
            </div>
          )}

          {collapsed && (
            <div className="flex flex-col items-center gap-2 mb-4">
              <button className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all" title="Help Center">
                <FaQuestionCircle className="text-lg" />
              </button>
              <button className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all" title="Settings">
                <FaCog className="text-lg" />
              </button>
            </div>
          )}

          {/* User Profile & Logout */}
          <div className={`flex items-center gap-3 px-3 py-3 rounded-2xl bg-gray-50/80 hover:bg-gray-100 transition-all duration-200 ${collapsed ? 'flex-col' : ''}`}>
            {/* Avatar */}
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-violet-200">
              <span className="text-white text-sm font-bold">{userInitial}</span>
            </div>

            {/* User Info */}
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{userData.name}</p>
                <p className="text-xs text-gray-400 truncate">{userData.email}</p>
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className={`rounded-xl flex items-center justify-center bg-white border border-gray-200 text-red-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all duration-200 shadow-sm ${collapsed ? 'w-10 h-10' : 'w-9 h-9'
                }`}
              title="Logout"
            >
              <FaSignOutAlt className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}