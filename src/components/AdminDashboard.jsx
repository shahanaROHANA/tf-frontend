import { useState, useEffect } from 'react';
import { FaChartLine, FaUsers, FaStore, FaShoppingCart, FaCog, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import VendorManagement from './admin/VendorManagement';
import MenuOversight from './admin/MenuOversight';
import OrderMonitoring from './admin/OrderMonitoring';
import UserManagement from './admin/UserManagement';
import Analytics from './admin/Analytics';
import PlatformSettings from './admin/PlatformSettings';
import './AdminDashboard.css';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'analytics', label: 'Analytics Dashboard', icon: FaChartLine },
    { id: 'vendors', label: 'Vendor Management', icon: FaStore },
    { id: 'menu', label: 'Menu Oversight', icon: FaShoppingCart },
    { id: 'orders', label: 'Order Monitoring', icon: FaShoppingCart },
    { id: 'users', label: 'User Management', icon: FaUsers },
    { id: 'settings', label: 'Platform Settings', icon: FaCog },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <Analytics />;
      case 'vendors':
        return <VendorManagement />;
      case 'menu':
        return <MenuOversight />;
      case 'orders':
        return <OrderMonitoring />;
      case 'users':
        return <UserManagement />;
      case 'settings':
        return <PlatformSettings />;
      default:
        return <Analytics />;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <button 
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <h1>🚆 TrainFood Admin Dashboard</h1>
        </div>
        <div className="header-right">
          <span className="admin-name">Welcome, {user?.name}</span>
          <button className="logout-btn" onClick={onLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      <div className="admin-content">
        {/* Sidebar */}
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <nav className="sidebar-nav">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon className="nav-icon" />
                  <span className="nav-label">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
