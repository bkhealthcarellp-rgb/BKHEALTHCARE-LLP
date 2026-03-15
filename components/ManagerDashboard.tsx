import React from 'react';
import { User, ServiceRequest, RequestStatus, Vendor } from '../types';
import { ClipboardList, UserCheck, Activity, MapPin, CheckCircle } from 'lucide-react';

interface ManagerDashboardProps {
  currentUser: User;
  requests: ServiceRequest[];
  vendors: Vendor[];
  onAssignVendor: (requestId: string, vendorId: string) => void;
  onReleaseReport: (requestId: string) => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ 
  currentUser, 
  requests, 
  vendors,
  onAssignVendor,
  onReleaseReport
}) => {

  const incomingRequests = requests.filter(r => r.status === RequestStatus.REQUESTED);
  const pendingVendor = requests.filter(r => r.status === RequestStatus.VENDOR_ASSIGNED);
  const reviewPending = requests.filter(r => r.status === RequestStatus.REPORT_UPLOADED);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-2xl font-bold text-[#4A148C]">Manager Dashboard</h2>
           <p className="text-gray-600">Welcome back, {currentUser.name}. You have pending tasks.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-sm font-medium">
          Active Members: <span className="text-[#4A148C] font-bold">24</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Incoming Requests */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-0 overflow-hidden">
          <div className="bg-blue-50 p-4 border-b border-blue-100 flex justify-between items-center">
            <h3 className="font-bold text-blue-900 flex items-center gap-2">
              <ClipboardList className="w-5 h-5" /> Incoming Requests
            </h3>
            <span className="bg-blue-200 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">{incomingRequests.length}</span>
          </div>
          <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
            {incomingRequests.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No new requests.</p>}
            {incomingRequests.map(req => (
              <div key={req.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                   <h4 className="font-bold text-gray-800">{req.serviceType}</h4>
                   <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">New</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">Member: <strong>{req.memberName}</strong></p>
                <p className="text-sm text-gray-600 mb-2">Date: {req.dateRequested}</p>
                {req.symptoms && (
                  <div className="bg-gray-50 p-2 rounded text-xs text-gray-600 mb-3">
                    <span className="font-semibold">Symptoms:</span> {req.symptoms}
                  </div>
                )}
                
                <div className="mt-3">
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Step B: Select Path Lab</label>
                  <select 
                    className="w-full text-sm border-gray-300 rounded-md shadow-sm mb-2 p-1.5 border"
                    onChange={(e) => {
                       if(e.target.value) onAssignVendor(req.id, e.target.value);
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>Select a Vendor...</option>
                    {vendors.filter(v => v.type === 'PATH_LAB').map(v => (
                      <option key={v.id} value={v.id}>{v.name} {v.verified ? '(Verified)' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Pending Vendor Fulfillment */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-0 overflow-hidden">
          <div className="bg-yellow-50 p-4 border-b border-yellow-100 flex justify-between items-center">
            <h3 className="font-bold text-yellow-900 flex items-center gap-2">
              <Activity className="w-5 h-5" /> Pending Coordination
            </h3>
            <span className="bg-yellow-200 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded-full">{pendingVendor.length}</span>
          </div>
          <div className="p-4 space-y-4">
             {pendingVendor.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No pending coordinations.</p>}
             {pendingVendor.map(req => (
                <div key={req.id} className="border border-gray-200 rounded-lg p-4 opacity-75">
                   <h4 className="font-bold text-gray-800 text-sm">{req.serviceType}</h4>
                   <p className="text-xs text-gray-600">Member: {req.memberName}</p>
                   <div className="mt-2 flex items-center gap-2 text-xs text-yellow-700 bg-yellow-50 p-2 rounded">
                     <ClockIcon className="w-3 h-3" />
                     Waiting for Vendor Report
                   </div>
                </div>
             ))}
          </div>
        </div>

        {/* Column 3: Review & Release */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-0 overflow-hidden">
          <div className="bg-purple-50 p-4 border-b border-purple-100 flex justify-between items-center">
            <h3 className="font-bold text-purple-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5" /> Review & Release
            </h3>
            <span className="bg-purple-200 text-purple-800 text-xs font-bold px-2 py-0.5 rounded-full">{reviewPending.length}</span>
          </div>
           <div className="p-4 space-y-4">
             {reviewPending.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No reports to review.</p>}
             {reviewPending.map(req => (
                <div key={req.id} className="border border-purple-200 bg-purple-50 rounded-lg p-4">
                   <h4 className="font-bold text-gray-800">{req.serviceType}</h4>
                   <p className="text-sm text-gray-600 mb-2">Member: {req.memberName}</p>
                   <div className="bg-white p-2 rounded border border-gray-200 mb-3 text-xs flex items-center gap-2">
                      <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center text-red-500 font-bold">PDF</div>
                      <span>Blood_Report_FINAL.pdf</span>
                   </div>
                   <button 
                     onClick={() => onReleaseReport(req.id)}
                     className="w-full bg-[#4A148C] text-white text-sm font-bold py-2 rounded shadow hover:bg-purple-800 transition-colors"
                   >
                     Release to Member
                   </button>
                </div>
             ))}
           </div>
        </div>

      </div>
    </div>
  );
};

const ClockIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);