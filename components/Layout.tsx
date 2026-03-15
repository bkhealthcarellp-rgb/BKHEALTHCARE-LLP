import React from 'react';
import { UserRole } from '../types';
import { ShieldCheck, LogIn } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentUserRole?: UserRole;
  currentUserName?: string;
  isLoggedIn: boolean;
  onLogout: () => void;
  onRoleSwitch: (role: UserRole) => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentUserRole, 
  currentUserName,
  isLoggedIn,
  onLogout,
  onRoleSwitch
}) => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {/* Top App Bar - Deep Violet */}
      <header className="bg-[#4A148C] text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => !isLoggedIn && window.location.reload()}>
            <div className="bg-white p-1.5 rounded-full">
               <ShieldCheck className="h-6 w-6 text-[#4A148C]" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">SEHAT KA SAATHI</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {isLoggedIn && currentUserName ? (
              <>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">{currentUserName}</p>
                  <p className="text-xs text-gray-300 opacity-80">
                    {currentUserRole === UserRole.VENDOR_LAB ? 'Service Partner' : currentUserRole?.replace('_', ' ')}
                  </p>
                </div>
                <div className="h-8 w-8 bg-[#FFD600] rounded-full flex items-center justify-center text-[#4A148C] font-bold">
                  {currentUserName.charAt(0)}
                </div>
                <button 
                  onClick={onLogout}
                  className="text-xs bg-purple-800 hover:bg-purple-700 py-1 px-3 rounded transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <span className="text-sm font-medium text-purple-200">Welcome Guest</span>
            )}
          </div>
        </div>
      </header>

      {/* Role Switcher for Demo Purposes */}
      <div className="bg-gray-800 text-gray-300 text-xs py-1 px-4 text-center overflow-x-auto whitespace-nowrap">
        <span className="mr-2">DEMO MODE - Switch Role:</span>
        <button onClick={() => onRoleSwitch(UserRole.MEMBER)} className={`px-2 hover:text-white ${currentUserRole === UserRole.MEMBER ? 'text-[#FFD600] font-bold' : ''}`}>Member</button> |
        <button onClick={() => onRoleSwitch(UserRole.HEALTH_MANAGER)} className={`px-2 hover:text-white ${currentUserRole === UserRole.HEALTH_MANAGER ? 'text-[#FFD600] font-bold' : ''}`}>Health Manager</button> |
        <button onClick={() => onRoleSwitch(UserRole.VENDOR_LAB)} className={`px-2 hover:text-white ${currentUserRole === UserRole.VENDOR_LAB ? 'text-[#FFD600] font-bold' : ''}`}>Service Partner</button> |
        <button onClick={() => onRoleSwitch(UserRole.ADMIN)} className={`px-2 hover:text-white ${currentUserRole === UserRole.ADMIN ? 'text-[#FFD600] font-bold' : ''}`}>Admin</button>
      </div>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};