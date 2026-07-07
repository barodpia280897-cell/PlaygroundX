import { createContext, useContext, useState, useEffect } from 'react';
import { loadData, saveData, removeData } from '../utils/storage';

const AuthContext = createContext(null);

export const ROLE_CONFIG = {
  // Platform Roles (PlayGroundX Gateway)
  PLATFORM_OWNER: { scope: 'PLATFORM', prefix: 'platform' },
  PLATFORM_ADMIN: { scope: 'PLATFORM', prefix: 'platform' },
  PLATFORM_SUPPORT: { scope: 'PLATFORM', prefix: 'platform' },

  // Tenant Roles (Customer CRM)
  TENANT_OWNER: { scope: 'TENANT', prefix: 'ceo' },
  MANAGER: { scope: 'TENANT', prefix: 'manager' },
  SUPERVISOR: { scope: 'TENANT', prefix: 'supervisor' },
  AGENT: { scope: 'TENANT', prefix: 'agent' },
  RECEPTIONIST: { scope: 'TENANT', prefix: 'reception' },
  STAFF: { scope: 'TENANT', prefix: 'staff' },
  VIEWER: { scope: 'TENANT', prefix: 'viewer' }
};

export const MOCK_USERS = [
  // Platform Users
  {
    id: 'pgx-admin',
    name: 'Sarah Mitchell',
    email: 'admin@playgroundx.com',
    role: 'PLATFORM_ADMIN',
    roleLabel: 'Platform Admin',
    scope: 'PLATFORM',
    tenantId: 'PGX_GLOBAL',
    tenantName: 'PlayGroundX Platform',
    avatar: 'https://i.pravatar.cc/150?img=47',
    color: '#00f0ff',
  },
  // Tenant Users
  {
    id: 'tenant-owner',
    name: 'James Harrington',
    email: 'ceo@acmedigital.com',
    role: 'TENANT_OWNER',
    roleLabel: 'CEO / Owner',
    scope: 'TENANT',
    tenantId: 'ACME_001',
    tenantName: 'Acme Digital Ltd.',
    avatar: 'https://i.pravatar.cc/150?img=53',
    color: '#ffd700',
    language: 'en',
  },
  {
    id: 'tenant-manager',
    name: 'Elena Vasquez',
    email: 'manager@acmedigital.com',
    role: 'MANAGER',
    roleLabel: 'Operations Manager',
    scope: 'TENANT',
    tenantId: 'ACME_001',
    tenantName: 'Acme Digital Ltd.',
    avatar: 'https://i.pravatar.cc/150?img=32',
    color: '#8a2be2',
    language: 'es',
  },
  {
    id: 'tenant-agent',
    name: 'Priya Sharma',
    email: 'agent@acmedigital.com',
    role: 'AGENT',
    roleLabel: 'Sales Agent',
    scope: 'TENANT',
    tenantId: 'ACME_001',
    tenantName: 'Acme Digital Ltd.',
    avatar: 'https://i.pravatar.cc/150?img=25',
    color: '#39ff14',
    language: 'es',
  },
  {
    id: 'tenant-receptionist',
    name: 'Emma Watson',
    email: 'reception@acmedigital.com',
    role: 'RECEPTIONIST',
    roleLabel: 'Front Desk / Receptionist',
    scope: 'TENANT',
    tenantId: 'ACME_001',
    tenantName: 'Acme Digital Ltd.',
    avatar: 'https://i.pravatar.cc/150?img=12',
    color: '#f59e0b',
    language: 'en',
  },
  {
    id: 'tenant-viewer',
    name: 'David Chen',
    email: 'viewer@acmedigital.com',
    role: 'VIEWER',
    roleLabel: 'Viewer / Auditor',
    scope: 'TENANT',
    tenantId: 'ACME_001',
    tenantName: 'Acme Digital Ltd.',
    avatar: 'https://i.pravatar.cc/150?img=68',
    color: '#aaaaaa',
    language: 'fr',
  },
  {
    id: 'tenant-supervisor',
    name: 'Marcus Brody',
    email: 'supervisor@acmedigital.com',
    role: 'SUPERVISOR',
    roleLabel: 'Team Supervisor',
    scope: 'TENANT',
    tenantId: 'ACME_001',
    tenantName: 'Acme Digital Ltd.',
    avatar: 'https://i.pravatar.cc/150?img=11',
    color: '#f97316',
    language: 'en',
  },
];

const AUTH_KEY = 'auth_session_v2'; // Bumped version for new schema

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadData(AUTH_KEY));

  const loginAsRole = (userId) => {
    const found = MOCK_USERS.find(u => u.id === userId);
    if (found) {
      setUser(found);
      saveData(AUTH_KEY, found);
      return { success: true };
    }
    return { success: false, message: 'Role not found.' };
  };

  const login = (email, password) => {
    const found = MOCK_USERS.find(u => u.email === email);
    if (found) {
      setUser(found);
      saveData(AUTH_KEY, found);
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials.' };
  };

  const logout = () => {
    setUser(null);
    removeData(AUTH_KEY);
  };

  // We are removing rigid route checks from AuthContext and leaving it to the App router and Navigation configs
  const canAccess = (roleRequired) => {
    // If we wanted to check if a specific role is required, we could do it here.
    return true; 
  };

  return (
    <AuthContext.Provider value={{ user, login, loginAsRole, logout, isAuthenticated: !!user, canAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    console.warn('useAuth called outside of AuthProvider');
    return {};
  }
  return ctx;
}
