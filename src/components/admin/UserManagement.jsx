import { useState, useEffect } from 'react';
import { FaUsers, FaBan, FaUnlock, FaEye, FaFilter } from 'react-icons/fa';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filters, setFilters] = useState({
    role: '',
    page: 1
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (filters.role) params.append('role', filters.role);
      params.append('page', filters.page);
      params.append('limit', 20);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setUsers(data.users);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        total: data.total
      });
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userId}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#e74c3c';
      case 'seller': return '#f39c12';
      case 'deliveryAgent': return '#3498db';
      case 'customer': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getUserStats = () => {
    const stats = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      acc.total++;
      if (user.isBlocked) acc.blocked++;
      return acc;
    }, { total: 0, blocked: 0 });

    return stats;
  };

  if (loading) {
    return <div className="loading-spinner">Loading users...</div>;
  }

  const stats = getUserStats();

  return (
    <div className="user-management">
      {/* Header */}
      <div className="admin-card">
        <h2>👥 User Management</h2>
        
        {/* Filters */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          marginTop: '1rem'
        }}>
          <div className="form-group">
            <label>Role</label>
            <select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 1 })}
            >
              <option value="">All Roles</option>
              <option value="customer">Customers</option>
              <option value="seller">Sellers</option>
              <option value="deliveryAgent">Delivery Agents</option>
              <option value="admin">Admins</option>
            </select>
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              className="btn btn-secondary"
              onClick={() => setFilters({ role: '', page: 1 })}
            >
              <FaFilter /> Clear Filters
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '1rem',
          marginTop: '1rem'
        }}>
          <div style={{ 
            textAlign: 'center',
            padding: '1rem',
            background: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <h4 style={{ margin: '0', color: '#636e72', fontSize: '0.9rem' }}>Total Users</h4>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', fontWeight: 'bold' }}>
              {stats.total}
            </p>
          </div>
          <div style={{ 
            textAlign: 'center',
            padding: '1rem',
            background: '#ffeaa7',
            borderRadius: '8px'
          }}>
            <h4 style={{ margin: '0', color: '#d63031', fontSize: '0.9rem' }}>Blocked</h4>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', fontWeight: 'bold' }}>
              {stats.blocked}
            </p>
          </div>
          <div style={{ 
            textAlign: 'center',
            padding: '1rem',
            background: '#d4edda',
            borderRadius: '8px'
          }}>
            <h4 style={{ margin: '0', color: '#155724', fontSize: '0.9rem' }}>Customers</h4>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', fontWeight: 'bold' }}>
              {stats.customer || 0}
            </p>
          </div>
          <div style={{ 
            textAlign: 'center',
            padding: '1rem',
            background: '#fff3cd',
            borderRadius: '8px'
          }}>
            <h4 style={{ margin: '0', color: '#856404', fontSize: '0.9rem' }}>Sellers</h4>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', fontWeight: 'bold' }}>
              {stats.seller || 0}
            </p>
          </div>
        </div>

        {/* Pagination Info */}
        <div style={{ 
          display: 'flex', 
          gap: '2rem', 
          marginTop: '1rem',
          padding: '1rem',
          background: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <span><strong>Total Users:</strong> {pagination.total}</span>
          <span><strong>Page:</strong> {pagination.currentPage} of {pagination.totalPages}</span>
        </div>
      </div>

      {/* Users Table */}
      {users.length > 0 ? (
        <div className="admin-card">
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.9rem'
                        }}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <strong>{user.name}</strong>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{ 
                          background: getRoleColor(user.role),
                          color: 'white'
                        }}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${user.isBlocked ? 'status-inactive' : 'status-active'}`}>
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.9rem' }}>
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-primary"
                          onClick={() => setSelectedUser(user)}
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        {user.role !== 'admin' && (
                          <button
                            className={`btn ${user.isBlocked ? 'btn-success' : 'btn-warning'}`}
                            onClick={() => toggleUserStatus(user._id)}
                            title={user.isBlocked ? 'Unblock User' : 'Block User'}
                          >
                            {user.isBlocked ? <FaUnlock /> : <FaBan />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '0.5rem',
              marginTop: '1rem'
            }}>
              <button
                className="btn btn-secondary"
                onClick={() => setFilters({ ...filters, page: pagination.currentPage - 1 })}
                disabled={pagination.currentPage === 1}
              >
                Previous
              </button>
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0 1rem' 
              }}>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                className="btn btn-secondary"
                onClick={() => setFilters({ ...filters, page: pagination.currentPage + 1 })}
                disabled={pagination.currentPage === pagination.totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No users found</h3>
          <p>
            {filters.role 
              ? `No ${filters.role}s found.` 
              : 'No users have registered yet.'}
          </p>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>User Details</h2>
              <button className="close-modal" onClick={() => setSelectedUser(null)}>
                ×
              </button>
            </div>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '2rem',
                  margin: '0 auto 1rem'
                }}>
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <h3>{selectedUser.name}</h3>
                <p style={{ color: '#636e72', margin: '0.5rem 0' }}>{selectedUser.email}</p>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: '1rem' 
              }}>
                <div>
                  <strong>User ID:</strong>
                  <div style={{ 
                    fontFamily: 'monospace', 
                    fontSize: '0.9rem',
                    background: '#f8f9fa',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    marginTop: '0.25rem'
                  }}>
                    {selectedUser._id}
                  </div>
                </div>
                <div>
                  <strong>Role:</strong>
                  <div style={{ marginTop: '0.25rem' }}>
                    <span 
                      className="status-badge"
                      style={{ 
                        background: getRoleColor(selectedUser.role),
                        color: 'white'
                      }}
                    >
                      {selectedUser.role}
                    </span>
                  </div>
                </div>
                <div>
                  <strong>Status:</strong>
                  <div style={{ marginTop: '0.25rem' }}>
                    <span className={`status-badge ${selectedUser.isBlocked ? 'status-inactive' : 'status-active'}`}>
                      {selectedUser.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </div>
                </div>
                <div>
                  <strong>Member Since:</strong>
                  <div style={{ marginTop: '0.25rem' }}>
                    {formatDate(selectedUser.createdAt)}
                  </div>
                </div>
              </div>

              {selectedUser.resetOtp && (
                <div style={{
                  background: '#fff3cd',
                  padding: '1rem',
                  borderRadius: '8px',
                  color: '#856404'
                }}>
                  <strong>⚠️ Password Reset:</strong> User has an active password reset request
                </div>
              )}

              {selectedUser.role !== 'admin' && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                  <button
                    className={`btn ${selectedUser.isBlocked ? 'btn-success' : 'btn-warning'}`}
                    onClick={() => {
                      toggleUserStatus(selectedUser._id);
                      setSelectedUser({ ...selectedUser, isBlocked: !selectedUser.isBlocked });
                    }}
                  >
                    {selectedUser.isBlocked ? (
                      <>
                        <FaUnlock /> Unblock User
                      </>
                    ) : (
                      <>
                        <FaBan /> Block User
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
