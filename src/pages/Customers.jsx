import React, { useState, useEffect, useRef } from 'react';
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import InputField from "../components/InputField";
import { FaSearch, FaEllipsisV, FaIdBadge, FaCrown, FaStar, FaMedal } from 'react-icons/fa';

const customersData = Array.from({ length: 30 }, (_, index) => ({
  id: `CUST-${(index + 1).toString().padStart(3, '0')}`,
  name: `Client HairCut ${index + 1}`,
  email: `client${index + 1}@email.com`,
  phone: `0812-3456-78${(index % 10).toString().padStart(2, '0')}`,
  loyalty: index % 3 === 0 ? 'Gold' : index % 2 === 0 ? 'Silver' : 'Bronze',
  visits: Math.floor(Math.random() * 30) + 1,
}));

export default function Customers() {
  // 1. useState: Mengelola status modal dan pencarian
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // 2. useRef: Membuat referensi langsung ke elemen input DOM
  const nameInputRef = useRef(null); 

  // 3. useEffect: Memberikan efek samping berupa auto-focus saat modal dibuka
  useEffect(() => {
    if (isModalOpen && nameInputRef.current) {
      setTimeout(() => {
        nameInputRef.current.focus();
      }, 100);
    }
  }, [isModalOpen]); 

  const getBadgeType = (loyalty) => {
    if (loyalty === 'Gold') return 'success';
    if (loyalty === 'Silver') return 'secondary';
    return 'warning';
  };

  const getLoyaltyIcon = (loyalty) => {
    switch(loyalty) {
      case 'Gold': return <FaCrown className="text-yellow-500" />;
      case 'Silver': return <FaStar className="text-gray-400" />;
      default: return <FaMedal className="text-amber-700" />;
    }
  };

  return (
    <div className="flex-1 w-full pb-10 bg-gradient-to-br from-gray-50 to-slate-100 min-h-screen p-4 md:p-8">
      <PageHeader title="Customers Database" breadcrumb={["Dashboard", "Client List"]}>
        <Button 
          type="dark" 
          onClick={() => setIsModalOpen(true)} 
          className="shadow-lg shadow-slate-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
        >
          + Add New Client
        </Button>
      </PageHeader>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-white/50 mt-6 transition-all duration-300 hover:shadow-2xl">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-96 group">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-slate-600 transition-colors" />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              className="pl-12 pr-4 py-3 bg-gray-50 rounded-2xl w-full outline-none focus:ring-2 focus:ring-slate-200 transition-all duration-300 placeholder:text-gray-400"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm bg-gray-50 px-4 py-2 rounded-2xl">
              <FaIdBadge className="text-slate-500" />
              <span className="font-medium">30</span> clients
            </div>
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-yellow-400" title="Gold"></span>
              <span className="w-3 h-3 rounded-full bg-gray-300" title="Silver"></span>
              <span className="w-3 h-3 rounded-full bg-amber-700" title="Bronze"></span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-slate-50">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Membership</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Visits</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {customersData.map(cust => (
                <tr 
                  key={cust.id} 
                  className="border-b border-gray-50 hover:bg-slate-50 transition-all duration-200 group relative"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-bold shadow-md">
                          {cust.name.charAt(0)}
                        </div>
                        {cust.loyalty === 'Gold' && (
                          <span className="absolute -bottom-0.5 -right-0.5 bg-yellow-400 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
                            <FaCrown className="text-[8px] text-white" />
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700 block">{cust.name}</span>
                        <span className="text-xs text-gray-400">Member since 2024</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-600">{cust.email}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{cust.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="bg-gray-100 px-2 py-1 rounded-md text-xs font-mono text-slate-600">
                      {cust.id}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Badge type={getBadgeType(cust.loyalty)}>
                        <span className="flex items-center gap-1.5">
                          {getLoyaltyIcon(cust.loyalty)}
                          {cust.loyalty} Member
                        </span>
                      </Badge>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          cust.loyalty === 'Gold' ? 'bg-yellow-400 w-full' :
                          cust.loyalty === 'Silver' ? 'bg-gray-400 w-2/3' :
                          'bg-amber-600 w-1/3'
                        }`} 
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-700">{cust.visits}</span>
                    <span className="text-xs text-gray-400 ml-1">visits</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors group/btn">
                        <FaEllipsisV className="text-gray-400 group-hover/btn:text-slate-600 transition-colors" />
                      </button>
                      {/* Quick edit dropdown */}
                      <div className="absolute right-0 mt-8 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-slate-50">View Profile</button>
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-slate-50">Edit</button>
                        <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Delete</button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Client">
        <div className="space-y-4">
          {/* Menerapkan useRef di InputField pertama */}
          <InputField 
            ref={nameInputRef} 
            label="Full Name" 
            name="name" 
            placeholder="clientname" 
          />
          <InputField label="Email" type="email" name="email" placeholder="client@email.com" />
          <InputField label="Phone" name="phone" placeholder="0812-xxxx-xxxx" />
          <div className="flex gap-3 mt-6 pt-4 border-t">
            <Button type="primary" onClick={() => setIsModalOpen(false)} className="flex-1">Save Client</Button>
            <Button type="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}