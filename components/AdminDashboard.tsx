import React from 'react';
import { User, VerificationStatus, UserRole } from '../types';
import { CheckCircle, XCircle, FileText, AlertTriangle, Stethoscope, Building2 } from 'lucide-react';

interface AdminDashboardProps {
  users: User[];
  onVerifyUser: (userId: string, isApproved: boolean) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, onVerifyUser }) => {
  const pendingUsers = users.filter(u => u.verificationStatus === VerificationStatus.PENDING);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#4A148C]">Admin Verification Console</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
           <h3 className="text-gray-500 text-sm font-medium">Pending Approvals</h3>
           <p className="text-3xl font-bold text-orange-500">{pendingUsers.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 p-4 border-b border-gray-200">
           <h3 className="font-bold text-gray-800">Verification Queue</h3>
        </div>
        
        {pendingUsers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto text-green-200 mb-2" />
            <p>All caught up! No pending verifications.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {pendingUsers.map(user => (
              <div key={user.id} className="p-6 flex flex-col lg:flex-row gap-6">
                 {/* Details */}
                 <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                       {user.role === UserRole.VENDOR_LAB ? (
                         <span className="px-2 py-1 bg-purple-100 text-[#4A148C] text-xs font-bold rounded flex items-center gap-1">
                           <Building2 className="w-3 h-3" /> SERVICE PARTNER
                         </span>
                       ) : (
                         <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded flex items-center gap-1">
                           <Stethoscope className="w-3 h-3" /> HEALTH MANAGER
                         </span>
                       )}
                       <span className="text-sm text-gray-500">ID: {user.id}</span>
                    </div>
                    
                    <h4 className="text-lg font-bold text-gray-900">{user.name}</h4>
                    
                    {user.role === UserRole.VENDOR_LAB && (
                      <>
                        <p className="text-sm text-gray-600 mb-1">Owner: {user.ownerName}</p>
                        <p className="text-sm text-gray-600 mb-4">Firm Type: {user.firmType}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-3 rounded">
                           <div>
                             <span className="block text-gray-400 text-xs">GST Number</span>
                             <span className="font-mono">{user.gstNumber || 'Not Provided'}</span>
                           </div>
                           <div>
                             <span className="block text-gray-400 text-xs">Entity Type</span>
                             <span>{user.entityType}</span>
                           </div>
                        </div>
                      </>
                    )}

                    {user.role === UserRole.HEALTH_MANAGER && (
                      <>
                        <p className="text-sm text-gray-600 mb-1">Email: {user.email}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-3 rounded mt-3">
                           <div>
                             <span className="block text-gray-400 text-xs">Specialization</span>
                             <span className="font-semibold">{user.specialization}</span>
                           </div>
                           <div>
                             <span className="block text-gray-400 text-xs">Experience</span>
                             <span>{user.experienceYears} Years</span>
                           </div>
                        </div>
                      </>
                    )}
                 </div>

                 {/* Docs Preview */}
                 <div className="flex-1 border-l border-gray-100 pl-6">
                    <h5 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Uploaded Documents
                    </h5>
                    <div className="grid grid-cols-2 gap-3">
                       {/* Mock Document Previews */}
                       {user.role === UserRole.VENDOR_LAB ? (
                         <>
                           <div className="bg-gray-100 h-20 rounded flex items-center justify-center text-xs text-gray-500 border border-gray-200">GST Cert</div>
                           <div className="bg-gray-100 h-20 rounded flex items-center justify-center text-xs text-gray-500 border border-gray-200">Cancelled Cheque</div>
                         </>
                       ) : (
                          <>
                           <div className="bg-gray-100 h-20 rounded flex items-center justify-center text-xs text-gray-500 border border-gray-200">Degree Cert</div>
                           <div className="bg-gray-100 h-20 rounded flex items-center justify-center text-xs text-gray-500 border border-gray-200">Cancelled Cheque</div>
                          </>
                       )}
                    </div>
                 </div>

                 {/* Actions */}
                 <div className="w-full lg:w-48 flex flex-col gap-2 justify-center">
                    <button 
                      onClick={() => onVerifyUser(user.id, true)}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button 
                      onClick={() => onVerifyUser(user.id, false)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2 rounded flex items-center justify-center gap-2 border border-red-200"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};