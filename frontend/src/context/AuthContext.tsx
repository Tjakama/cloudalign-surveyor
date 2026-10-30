'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 
  | 'Administrator'
  | 'Project Manager'
  | 'Surveyor'
  | 'Engineer'
  | 'Reviewer'
  | 'Approver'
  | 'Collaborator';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'Active' | 'Suspended';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  category: 'Authentication' | 'RBAC' | 'System';
}

interface AuthContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  users: UserProfile[];
  addUser: (user: Omit<UserProfile, 'id'>) => void;
  updateUserRole: (id: string, newRole: UserRole) => void;
  deleteUser: (id: string) => void;
  auditLogs: AuditLogEntry[];
  logAction: (action: string, category: 'Authentication' | 'RBAC' | 'System') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<UserProfile[]>([
    { id: '1', name: 'Letjamela Mabea', email: 'letjamela@cloudalign.co.za', role: 'Engineer', status: 'Active' },
    { id: '2', name: 'Tsepo Masita', email: 'techlead@cloudalign.co.za', role: 'Reviewer', status: 'Active' },
    { id: '3', name: 'Nthabiseng Phoofolo', email: 'sales@cloudalign.co.za', role: 'Project Manager', status: 'Active' },
    { id: '4', name: 'Admin User', email: 'admin@cloudalign.co.za', role: 'Administrator', status: 'Active' },
  ]);

  const [currentUser, setCurrentUser] = useState<UserProfile>(users[3]);

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    { id: '101', timestamp: new Date().toLocaleTimeString(), user: 'Admin User', action: 'System initialized RBAC matrix', category: 'System' },
    { id: '102', timestamp: new Date().toLocaleTimeString(), user: 'Letjamela Mabea', action: 'Secure sign-in successful', category: 'Authentication' },
  ]);

  const logAction = (action: string, category: 'Authentication' | 'RBAC' | 'System') => {
    const newLog: AuditLogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      user: currentUser.name,
      action,
      category,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const addUser = (userData: Omit<UserProfile, 'id'>) => {
    const newUser: UserProfile = { ...userData, id: Date.now().toString() };
    setUsers((prev) => [...prev, newUser]);
    logAction(`Created new user: ${newUser.name} (${newUser.role})`, 'RBAC');
  };

  const updateUserRole = (id: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          logAction(`Updated role for ${u.name} to ${newRole}`, 'RBAC');
          return { ...u, role: newRole };
        }
        return u;
      })
    );
  };

  const deleteUser = (id: string) => {
    const targetUser = users.find((u) => u.id === id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (targetUser) {
      logAction(`Deleted user: ${targetUser.name}`, 'RBAC');
    }
  };

  const handleSwitchUser = (user: UserProfile) => {
    setCurrentUser(user);
    const newLog: AuditLogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      user: user.name,
      action: `Simulated login as ${user.role}`,
      category: 'Authentication',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser: handleSwitchUser,
        users,
        addUser,
        updateUserRole,
        deleteUser,
        auditLogs,
        logAction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}