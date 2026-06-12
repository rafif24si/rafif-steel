import React from "react";
// Tambahkan FaUserTie
import { FaCut, FaCalendarCheck, FaUsers, FaThLarge, FaBoxOpen, FaUserTie } from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const menuClass = ({ isActive }) =>
    `flex cursor-pointer items-center rounded-lg px-4 py-3 text-[14px] font-medium transition-all
        ${
          isActive
            ? "text-[#0C0C0C] bg-[#EDEEFC] font-semibold"
            : "text-gray-500 hover:text-[#0C0C0C] hover:bg-gray-50"
        }`;

  return (
    <div
      id="sidebar"
      className="flex min-h-screen w-[260px] flex-col bg-white p-6 border-r border-gray-100 font-sans"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="mb-8 px-6 pt-6">
        <h1 className="text-[32px] font-black tracking-tight flex items-baseline">
          <span className="text-[#101623]">Hair</span>
          <span className="text-[#495B70]">Cut.</span>
        </h1>
        <p className="text-[#8E9AAC] text-[13px] font-medium mt-1 ml-0.5">
          Barbershop Admin
        </p>
      </div>

      <div id="sidebar-menu" className="flex-1">
        <div className="text-xs font-medium text-gray-400 mb-4 px-4">
          Dashboards
        </div>
        <ul id="menu-list" className="space-y-1 mb-8">
          <li>
            <NavLink to="/" className={menuClass}>
              <FaThLarge className="mr-3 text-lg" /> Dashboard
            </NavLink>
          </li>
        </ul>

        <div className="text-xs font-medium text-gray-400 mb-4 px-4">Pages</div>
        <ul id="menu-list" className="space-y-1">
          <li>
            <NavLink to="/orders" className={menuClass}>
              <FaCalendarCheck className="mr-3 text-lg" /> Orders
            </NavLink>
          </li>
          <li>
            <NavLink to="/customers" className={menuClass}>
              <FaUsers className="mr-3 text-lg" /> Customers
            </NavLink>
          </li>
          <li>
            <NavLink to="/services" className={menuClass}>
              <FaCut className="mr-3 text-lg" /> Services
            </NavLink>
          </li>
          <li>
            <NavLink to="/products" className={menuClass}>
              <FaBoxOpen className="mr-3 text-lg" /> Products
            </NavLink>
          </li>
          {/* MENU KAPSTER UNTUK TUGAS SHADCN UI */}
          <li>
            <NavLink to="/kapster" className={menuClass}>
              <FaUserTie className="mr-3 text-lg text-emerald-600" /> Kapster
            </NavLink>
          </li>
           <li>
            <NavLink to="/users" className={menuClass}>
              <FaUserTie className="mr-3 text-lg text-emerald-600" /> Users
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="mt-auto px-4 flex items-center justify-center pb-4">
        <span className="font-semibold text-[#7DBBFF] text-sm flex items-center gap-2">
          <FaCut /> HairCut UI
        </span>
      </div>
    </div>
  );
}