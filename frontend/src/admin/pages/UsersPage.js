import React, { useState, useEffect } from 'react';
import { getUsers } from '../utils/api';
import toast from 'react-hot-toast';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers()
      .then(r => setUsers(r.data))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="adm-page-header">
        <div><h1>Users</h1><p>{users.length} registered users</p></div>
      </div>
      <div className="adm-card">
        {loading ? <div className="adm-spinner" /> : (
          <div style={{ overflowX: 'auto' }}>
            <table className="adm-data-table">
              <thead>
                <tr><th>User</th><th>Email</th><th>Role</th><th>Subscribed</th><th>Joined</th></tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--adm-gray-400)', padding: '2rem' }}>No users yet</td></tr>
                ) : users.map(u => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: u.role === 'admin' ? 'var(--adm-purple-main)' : 'var(--adm-gray-200)', color: u.role === 'admin' ? 'white' : 'var(--adm-gray-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
                          {u.name?.charAt(0)}
                        </div>
                        <strong style={{ fontSize: '0.88rem' }}>{u.name}</strong>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{u.email}</td>
                    <td><span className={`adm-status-badge ${u.role === 'admin' ? 'adm-status-processing' : 'adm-status-delivered'}`}>{u.role}</span></td>
                    <td><span className={`adm-status-badge ${u.isSubscribed ? 'adm-status-delivered' : 'adm-status-pending'}`}>{u.isSubscribed ? 'Yes' : 'No'}</span></td>
                    <td style={{ fontSize: '0.82rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
