import React, { useState, useEffect } from 'react';
import { 
  FaSearch, FaBell, FaUserPlus, 
  FaCut, FaCalendarCheck, FaMoneyBillWave, FaUserFriends, 
  FaChartLine, FaClock, FaCrown, FaStar, FaTrophy,
  FaDollarSign, FaShoppingBag, FaTags, FaPercentage,
  FaEnvelope, FaExclamationTriangle, FaCheckCircle
} from "react-icons/fa";
import { 
  FiChevronDown, FiFilter, FiRefreshCw, FiMoreVertical, FiChevronUp,
  FiTrendingUp, FiTrendingDown, FiActivity, FiBarChart2, FiPieChart,
  FiDownload, FiPrinter, FiCalendar
} from "react-icons/fi";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Area, AreaChart, RadialBarChart, RadialBar
} from 'recharts';

// --- DATA ---
const revenueData = [
  { name: 'Jan', thisYear: 12000, lastYear: 5000, target: 10000 },
  { name: 'Feb', thisYear: 14000, lastYear: 13000, target: 12000 },
  { name: 'Mar', thisYear: 13000, lastYear: 18000, target: 15000 },
  { name: 'Apr', thisYear: 24000, lastYear: 9000, target: 18000 },
  { name: 'May', thisYear: 28000, lastYear: 13000, target: 22000 },
  { name: 'Jun', thisYear: 21000, lastYear: 26000, target: 25000 },
  { name: 'Jul', thisYear: 32000, lastYear: 28000, target: 30000 },
  { name: 'Aug', thisYear: 35000, lastYear: 22000, target: 32000 },
];

const serviceData = [
  { name: 'Haircut', value: 18000, color: '#6366F1' },
  { name: 'Shaving', value: 12000, color: '#8B5CF6' },
  { name: 'Coloring', value: 9000, color: '#A78BFA' },
  { name: 'Beard', value: 15000, color: '#C4B5FD' },
  { name: 'Spa', value: 7000, color: '#DDD6FE' },
  { name: 'Package', value: 20000, color: '#EDE9FE' },
];

const distributionData = [
  { name: 'Haircut', value: 45.2, color: '#6366F1' },
  { name: 'Beard Trim', value: 25.8, color: '#8B5CF6' },
  { name: 'Coloring', value: 18.9, color: '#A78BFA' },
  { name: 'Other', value: 10.1, color: '#C4B5FD' },
];

// --- COMPONENTS ---

const AnimatedCounter = ({ value, prefix = "", suffix = "", decimals = 0, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime;
    let animationFrame;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(eased * value);
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {count.toLocaleString(undefined, { 
        minimumFractionDigits: decimals, 
        maximumFractionDigits: decimals 
      })}
      {suffix}
    </span>
  );
};

const Sparkline = ({ data, color }) => {
  if (!data || data.length === 0) return <div style={{ height: 40 }}></div>;
  
  const gradientId = `spark-${color.replace('#', '')}`;
  
  return (
    <div style={{ width: '64px', height: '40px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="100%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            fill={`url(#${gradientId})`} 
            strokeWidth={2} 
            dot={false} 
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const PremiumTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-xl p-5 rounded-[2rem] shadow-2xl border border-gray-100 min-w-[180px]">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4 text-sm mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: entry.color }}></div>
              <span className="text-gray-600 text-xs">{entry.name}:</span>
            </div>
            <span className="font-bold text-gray-900 text-xs">
              Rp {(entry.value / 1000).toFixed(1)}K
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const QuickAction = ({ icon: Icon, label, color, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 p-4 rounded-[1.75rem] transition-all duration-300 hover:scale-105 group bg-white border border-gray-100 shadow-sm hover:shadow-lg"
  >
    <div 
      className="w-12 h-12 rounded-[1.25rem] flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
      style={{ backgroundColor: `${color}15` }}
    >
      <Icon style={{ color }} className="text-xl" />
    </div>
    <span className="text-sm font-semibold text-gray-700">{label}</span>
  </button>
);

export default function Dashboard() {
  const [selectedFilter, setSelectedFilter] = useState('This Month');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showThisYear, setShowThisYear] = useState(true);
  const [showLastYear, setShowLastYear] = useState(false);
  const [showTarget, setShowTarget] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedStat, setSelectedStat] = useState(null);

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'success', icon: FaCheckCircle, text: 'Payment received Rp 250.000', time: '2 min ago', read: false },
    { id: 2, type: 'info', icon: FaCalendarCheck, text: 'New booking: Gentleman Cut', time: '15 min ago', read: false },
    { id: 3, type: 'warning', icon: FaExclamationTriangle, text: 'Low stock: Pomade Classic', time: '45 min ago', read: false },
    { id: 4, type: 'success', icon: FaCut, text: 'Service #1245 completed', time: '1 hour ago', read: true },
    { id: 5, type: 'info', icon: FaUserPlus, text: 'New member registered', time: '2 hours ago', read: true },
    { id: 6, type: 'message', icon: FaEnvelope, text: 'Customer feedback received', time: '3 hours ago', read: true },
  ]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const statCards = [
    { 
      title: 'Total Revenue', 
      value: 13.9, 
      prefix: 'Rp ', 
      suffix: 'M', 
      percent: '+11.01', 
      isUp: true, 
      icon: FaDollarSign,
      color: '#6366F1',
      sparkline: revenueData.map(d => ({ value: d.thisYear / 1000 })),
      detail: 'Revenue increased significantly compared to last month'
    },
    { 
      title: 'Appointments', 
      value: 142, 
      percent: '-0.03', 
      isUp: false, 
      icon: FaCalendarCheck,
      color: '#3B82F6',
      sparkline: [40, 55, 45, 60, 50, 65, 58, 70, 62, 75, 68, 80].map(v => ({ value: v })),
      detail: 'Slight decrease from last week, monitor closely'
    },
    { 
      title: 'Services Done', 
      value: 89, 
      percent: '+15.03', 
      isUp: true, 
      icon: FaCut,
      color: '#10B981',
      sparkline: [30, 35, 40, 38, 45, 42, 50, 55, 52, 60, 65, 70].map(v => ({ value: v })),
      detail: 'Haircut service remains the most popular choice'
    },
    { 
      title: 'Walk-in Clients', 
      value: 24, 
      percent: '+6.08', 
      isUp: true, 
      icon: FaUserFriends,
      color: '#F59E0B',
      sparkline: [10, 12, 9, 15, 13, 18, 16, 20, 19, 22, 21, 24].map(v => ({ value: v })),
      detail: 'Increase in walk-in customers this week'
    },
  ];

  const getNotificationStyle = (type) => {
    const styles = {
      success: { bg: 'bg-emerald-50', icon: 'text-emerald-500', dot: 'bg-emerald-500', border: 'border-emerald-200' },
      info: { bg: 'bg-blue-50', icon: 'text-blue-500', dot: 'bg-blue-500', border: 'border-blue-200' },
      warning: { bg: 'bg-amber-50', icon: 'text-amber-500', dot: 'bg-amber-500', border: 'border-amber-200' },
      message: { bg: 'bg-violet-50', icon: 'text-violet-500', dot: 'bg-violet-500', border: 'border-violet-200' },
    };
    return styles[type] || styles.info;
  };

  return (
    <div className="flex-1 w-full pb-10 px-4 md:px-8 pt-6 bg-[#F5F3FF] min-h-screen font-sans">
      
      {/* ============ TOP BAR ============ */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {greeting}, <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Admin!</span> 👋
              </h2>
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              <span className="text-gray-300">•</span>
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full lg:w-auto">
            {/* Search - Super Rounded */}
            <div className="relative flex-1 lg:flex-none">
              <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search anything..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full lg:w-72 pl-12 pr-5 py-3.5 bg-white border border-gray-200 rounded-[1.75rem] text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all shadow-sm"
              />
            </div>
            
            {/* Quick Actions - Super Rounded */}
            <button className="p-3.5 bg-white rounded-[1.25rem] border border-gray-200 text-gray-500 hover:text-violet-600 hover:border-violet-200 transition-all shadow-sm">
              <FiDownload className="text-lg" />
            </button>
            <button className="p-3.5 bg-white rounded-[1.25rem] border border-gray-200 text-gray-500 hover:text-violet-600 hover:border-violet-200 transition-all shadow-sm">
              <FiPrinter className="text-lg" />
            </button>
            
            {/* Refresh */}
            <button 
              onClick={handleRefresh}
              className="p-3.5 bg-white rounded-[1.25rem] border border-gray-200 text-gray-500 hover:text-violet-600 hover:border-violet-200 transition-all shadow-sm"
            >
              <FiRefreshCw className={`text-lg ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            
            {/* Notifications */}
            <div className="relative">
              <button className="relative p-3.5 bg-white rounded-[1.25rem] border border-gray-200 text-gray-500 hover:text-violet-600 hover:border-violet-200 transition-all shadow-sm">
                <FaBell className="text-lg" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-lg">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
            
            {/* Filter - Super Rounded */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-5 py-3.5 bg-white border border-gray-200 rounded-[1.75rem] text-sm font-medium text-gray-700 hover:border-violet-200 transition-all shadow-sm"
              >
                <FiCalendar className="text-gray-400" />
                <span className="hidden sm:inline">{selectedFilter}</span>
                <FiChevronDown className={`text-gray-400 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-[1.75rem] shadow-xl border border-gray-100 overflow-hidden z-50">
                  {['Today', 'This Week', 'This Month', 'This Year'].map((item) => (
                    <button
                      key={item}
                      onClick={() => { setSelectedFilter(item); setIsFilterOpen(false); }}
                      className={`w-full text-left px-6 py-3.5 text-sm transition-all hover:bg-violet-50 ${
                        selectedFilter === item ? 'font-semibold text-violet-600 bg-violet-50' : 'text-gray-600'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

     
      <div className="grid lg:grid-cols-4 gap-6">
        
        {/* ================= MAIN CONTENT ================= */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* --- STAT CARDS - Super Rounded --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {statCards.map((card, index) => (
              <div 
                key={index} 
                onClick={() => setSelectedStat(selectedStat === index ? null : index)}
                className={`group relative bg-white rounded-[2.5rem] p-6 cursor-pointer transition-all duration-500 border border-gray-100 overflow-hidden shadow-sm ${
                  selectedStat === index ? 'ring-2 ring-violet-500 shadow-2xl scale-[1.02]' : 'hover:shadow-xl hover:scale-[1.01]'
                }`}
              >
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent -rotate-45 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div 
                      className="w-12 h-12 rounded-[1.25rem] flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
                      style={{ backgroundColor: `${card.color}15` }}
                    >
                      <card.icon className="text-xl" style={{ color: card.color }} />
                    </div>
                    <Sparkline data={card.sparkline} color={card.color} />
                  </div>
                  
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    {card.title}
                  </p>
                  
                  <div className="flex items-end justify-between">
                    <h3 className="text-[1.75rem] font-bold text-gray-900 tracking-tight">
                      <AnimatedCounter value={card.value} prefix={card.prefix} suffix={card.suffix} decimals={card.suffix ? 1 : 0} />
                    </h3>
                    
                    <span className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full ${
                      card.isUp 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'bg-red-50 text-red-600'
                    }`}>
                      {card.isUp ? <FiTrendingUp className="text-xs" /> : <FiTrendingDown className="text-xs" />}
                      {card.percent}%
                    </span>
                  </div>
                  
                  {/* Expandable detail */}
                  <div className={`overflow-hidden transition-all duration-300 ${
                    selectedStat === index ? 'max-h-20 mt-4 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="bg-gray-50 rounded-[1.25rem] p-3 text-xs text-gray-500 leading-relaxed">
                      {card.detail}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* --- MAIN CHART - Super Rounded --- */}
          <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FiActivity className="text-violet-500" />
                  Revenue Overview
                </h3>
                <p className="text-xs text-gray-400 mt-1">Monthly revenue performance with targets</p>
              </div>
              
              <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-[1.25rem]">
                <button
                  onClick={() => setShowThisYear(!showThisYear)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-[1rem] text-xs font-semibold transition-all duration-300 ${
                    showThisYear ? 'bg-white text-violet-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-500 shadow-sm"></span>
                  This Year
                </button>
                <button
                  onClick={() => setShowLastYear(!showLastYear)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-[1rem] text-xs font-semibold transition-all duration-300 ${
                    showLastYear ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-300"></span>
                  Last Year
                </button>
                <button
                  onClick={() => setShowTarget(!showTarget)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-[1rem] text-xs font-semibold transition-all duration-300 ${
                    showTarget ? 'bg-white text-amber-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  Target
                </button>
              </div>
            </div>
            
            <div className="w-full" style={{ height: '350px', minHeight: '350px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradientThisYear" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366F1" stopOpacity={0.25}/>
                      <stop offset="100%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gradientLastYear" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C4B5FD" stopOpacity={0.25}/>
                      <stop offset="100%" stopColor="#C4B5FD" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} tickFormatter={(v) => `${v/1000}K`} />
                  <Tooltip content={<PremiumTooltip />} />
                  
                  {showThisYear && (
                    <Area 
                      type="monotone" 
                      dataKey="thisYear" 
                      name="This Year"
                      stroke="#6366F1" 
                      fill="url(#gradientThisYear)" 
                      strokeWidth={3} 
                      dot={false} 
                      activeDot={{ r: 8, fill: '#6366F1', stroke: '#fff', strokeWidth: 3 }}
                      animationDuration={2000}
                    />
                  )}
                  {showLastYear && (
                    <Area 
                      type="monotone" 
                      dataKey="lastYear" 
                      name="Last Year"
                      stroke="#C4B5FD" 
                      fill="url(#gradientLastYear)" 
                      strokeWidth={2.5} 
                      strokeDasharray="6 4" 
                      dot={false} 
                      activeDot={{ r: 8, fill: '#C4B5FD', stroke: '#fff', strokeWidth: 3 }}
                      animationDuration={2000}
                      animationBegin={300}
                    />
                  )}
                  {showTarget && (
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      name="Target"
                      stroke="#F59E0B" 
                      strokeWidth={2} 
                      strokeDasharray="4 4" 
                      dot={false}
                      animationDuration={1500}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* --- BOTTOM CHARTS - Super Rounded --- */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            
            {/* Bar Chart */}
            <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <FiBarChart2 className="text-violet-500" />
                    Service Performance
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Revenue by service type</p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-[1rem] transition-colors">
                  <FiMoreVertical className="text-gray-400" />
                </button>
              </div>
              <div className="w-full" style={{ height: '250px', minHeight: '250px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={serviceData} barSize={38} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10 }} tickFormatter={(v) => `${v/1000}K`} />
                    <Tooltip cursor={{ fill: '#F3F4F6', opacity: 0.4 }} />
                    <Bar 
                      dataKey="value" 
                      radius={[14, 14, 0, 0]} 
                      animationDuration={2000}
                      animationBegin={400}
                    >
                      {serviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <FiPieChart className="text-violet-500" />
                    Distribution
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Service type breakdown</p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-[1rem] transition-colors">
                  <FiMoreVertical className="text-gray-400" />
                </button>
              </div>
              <div className="flex items-center">
                <div className="w-1/2" style={{ height: '240px', minHeight: '240px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={distributionData} 
                        innerRadius={65} 
                        outerRadius={95} 
                        paddingAngle={6} 
                        dataKey="value" 
                        stroke="none"
                        animationDuration={2000}
                        animationBegin={500}
                      >
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-1/2 space-y-3 pl-2">
                  {distributionData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-[1.25rem] hover:bg-gray-50 cursor-pointer transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <div className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
                        <span className="text-xs text-gray-700 font-semibold">{item.name}</span>
                      </div>
                      <span className="text-xs font-bold text-gray-900">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDEBAR ================= */}
        <div className="col-span-1 space-y-6">
          
          {/* Performance Card - Super Rounded */}
          <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FaChartLine className="text-violet-500" />
              Performance Score
            </h3>
            <div className="flex justify-center mb-6">
              <div className="relative" style={{ width: '170px', height: '170px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    innerRadius="85%" 
                    outerRadius="100%" 
                    data={[{ value: 87, fill: '#6366F1' }]} 
                    startAngle={90} 
                    endAngle={-270}
                  >
                    <RadialBar dataKey="value" fill="#6366F1" cornerRadius={30} animationDuration={2000} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-5xl font-black bg-gradient-to-br from-violet-600 to-purple-600 bg-clip-text text-transparent">87</span>
                  <span className="text-xs text-gray-400 mt-1 font-semibold">out of 100</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-50 rounded-[1.5rem] p-4 text-center hover:bg-emerald-100 transition-colors cursor-pointer">
                <FaTrophy className="text-emerald-500 text-xl mx-auto mb-2" />
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Target</p>
                <p className="text-xl font-bold text-emerald-700">95%</p>
              </div>
              <div className="bg-violet-50 rounded-[1.5rem] p-4 text-center hover:bg-violet-100 transition-colors cursor-pointer">
                <FaStar className="text-violet-500 text-xl mx-auto mb-2" />
                <p className="text-[10px] text-violet-600 font-bold uppercase tracking-wider">Rating</p>
                <p className="text-xl font-bold text-violet-700">4.9</p>
              </div>
            </div>
          </div>

          {/* Notifications - Super Rounded */}
          <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
              <button 
                onClick={markAllAsRead}
                className="text-xs text-violet-500 hover:text-violet-700 font-bold transition-colors"
              >
                Mark all read
              </button>
            </div>
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {notifications.map((item) => {
                const style = getNotificationStyle(item.type);
                return (
                  <div 
                    key={item.id} 
                    onClick={() => markAsRead(item.id)}
                    className={`flex gap-3 p-3.5 rounded-[1.5rem] transition-all duration-300 cursor-pointer group border ${
                      !item.read ? `${style.bg} ${style.border}` : 'hover:bg-gray-50 border-transparent'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-[1rem] flex items-center justify-center flex-shrink-0 ${
                      !item.read ? 'bg-white shadow-md' : 'bg-gray-100'
                    } group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className={`text-sm ${!item.read ? style.icon : 'text-gray-400'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs truncate leading-tight transition-colors ${
                        !item.read ? 'font-semibold text-gray-900' : 'text-gray-500 group-hover:text-gray-700'
                      }`}>
                        {item.text}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">{item.time}</p>
                    </div>
                    {!item.read && (
                      <span className={`w-2.5 h-2.5 ${style.dot} rounded-full mt-1.5 flex-shrink-0 animate-pulse shadow-sm`}></span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activities - Super Rounded */}
          <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-gray-900">Activities</h3>
              <button className="text-xs text-violet-500 hover:text-violet-700 font-bold transition-colors">
                View all
              </button>
            </div>
            <div className="space-y-1 relative">
              <div className="absolute left-[22px] top-10 bottom-4 w-[2.5px] bg-gradient-to-b from-violet-200 via-violet-100 to-transparent rounded-full"></div>
              {[
                { user: 'Anton', action: 'Completed service #1245', time: 'Just now', color: 'bg-emerald-500' },
                { user: 'Bima', action: 'Booked Gentleman Cut', time: '15 min ago', color: 'bg-blue-500' },
                { user: 'Rizky', action: 'Cancelled appointment', time: '45 min ago', color: 'bg-red-500' },
                { user: 'Tomi', action: 'Purchased pomade', time: '1 hour ago', color: 'bg-amber-500' },
                { user: 'Dewi', action: 'Left a 5-star review', time: '2 hours ago', color: 'bg-violet-500' },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 relative pl-10 py-3 group cursor-pointer">
                  <div className={`absolute left-[18px] top-4 w-3 h-3 ${item.color} rounded-full border-[3px] border-white z-10 shadow-md group-hover:scale-125 transition-transform`}></div>
                  <img 
                    src={`https://ui-avatars.com/api/?name=${item.user}&background=6366F1&color=fff&font-size=0.35&bold=true`} 
                    alt={item.user} 
                    className="w-10 h-10 rounded-[1rem] shadow-sm group-hover:scale-110 transition-transform duration-300" 
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 leading-tight">
                      <span className="font-semibold text-gray-900">{item.user}</span> {item.action}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                      <FaClock className="text-[8px]" />
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============ BACK TO TOP - Super Rounded ============ */}
      {showScrollTop && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-[1.5rem] shadow-2xl hover:shadow-violet-500/25 transform hover:scale-110 transition-all duration-300 flex items-center justify-center group z-50"
        >
          <FiChevronUp className="text-2xl group-hover:-translate-y-1 transition-transform" />
        </button>
      )}
    </div>
  );
}