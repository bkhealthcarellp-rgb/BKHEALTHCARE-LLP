import React, { useState } from 'react';
import { User, ServiceRequest, RequestStatus, KYCDocument } from '../types';
import { UploadCloud, CheckCircle, FileText, AlertCircle, Building2, Shield, Plus } from 'lucide-react';

interface VendorDashboardProps {
  currentUser: User;
  requests: ServiceRequest[];
  onUploadReport: (requestId: string) => void;
  onUpdateProfile?: (updates: Partial<User>) => void; // Optional for demo
}

export const VendorDashboard: React.FC<VendorDashboardProps> = ({ currentUser, requests, onUploadReport, onUpdateProfile }) => {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'PROFILE'>('DASHBOARD');
  
  // Local state for profile form (demo)
  const [entityType, setEntityType] = useState(currentUser.entityType || 'Path Lab');
  const [licenseNumber, setLicenseNumber] = useState(currentUser.licenseNumber || '');
  const [docs, setDocs] = useState<KYCDocument[]>(currentUser.kycDocuments || [
    { id: 'd1', name: 'Business_Reg_Cert.pdf', type: 'REGISTRATION', status: 'VERIFIED', uploadDate: '2023-10-12' }
  ]);

  // Vendor only sees assigned requests
  const myTasks = requests.filter(r => r.vendorId === currentUser.id && r.status === RequestStatus.VENDOR_ASSIGNED);
  const completedTasks = requests.filter(r => r.vendorId === currentUser.id && (r.status === RequestStatus.REPORT_UPLOADED || r.status === RequestStatus.COMPLETED));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newDoc: KYCDocument = {
        id: `doc_${Date.now()}`,
        name: file.name,
        type: 'LICENSE', // Defaulting for demo
        status: 'PENDING',
        uploadDate: new Date().toISOString().split('T')[0]
      };
      const updatedDocs = [...docs, newDoc];
      setDocs(updatedDocs);
      if (onUpdateProfile) onUpdateProfile({ kycDocuments: updatedDocs });
    }
  };

  const isVerified = currentUser.verified;

  return (
    <div className="space-y-8">
      {/* Header Profile Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
             <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border-2 border-[#FFD600]">
                <Building2 className="w-8 h-8" />
             </div>
             <div>
               <h2 className="text-2xl font-bold text-gray-900">{currentUser.name}</h2>
               <div className="flex items-center gap-2 mt-1">
                  {isVerified ? (
                    <span className="flex items-center gap-1 text-green-700 bg-green-50 px-2 py-0.5 rounded text-xs font-bold border border-green-200">
                      <Shield className="w-3 h-3" /> VERIFIED PARTNER
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-orange-700 bg-orange-50 px-2 py-0.5 rounded text-xs font-bold border border-orange-200">
                      <AlertCircle className="w-3 h-3" /> PENDING VERIFICATION
                    </span>
                  )}
                  <span className="text-gray-500 text-xs">{currentUser.entityType || 'Service Provider'}</span>
               </div>
             </div>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => setActiveTab('DASHBOARD')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'DASHBOARD' ? 'bg-[#4A148C] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('PROFILE')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'PROFILE' ? 'bg-[#4A148C] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Registration & KYC
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'DASHBOARD' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
          {/* Service Orders */}
          <div>
            <h3 className="text-lg font-bold text-[#4A148C] mb-4">Pending Service Orders</h3>
            {!isVerified && (
              <div className="mb-4 bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-start gap-3">
                 <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                 <div>
                   <h4 className="font-bold text-yellow-800 text-sm">Account Under Review</h4>
                   <p className="text-xs text-yellow-700">You can view orders but reports cannot be released until KYC is complete.</p>
                 </div>
              </div>
            )}
            
            {myTasks.length === 0 && <p className="text-gray-500 bg-white p-4 rounded-lg border border-gray-200">No pending orders.</p>}
            <div className="space-y-4">
              {myTasks.map(req => (
                <div key={req.id} className="bg-white p-5 rounded-xl shadow border-l-4 border-l-[#FFD600]">
                  <div className="flex justify-between items-start mb-2">
                     <div>
                       <span className="text-xs text-gray-500 uppercase font-bold tracking-wide">Order #{req.id.slice(0,6)}</span>
                       <h4 className="font-bold text-lg">{req.serviceType}</h4>
                     </div>
                     <button 
                       onClick={() => onUploadReport(req.id)}
                       disabled={!isVerified}
                       className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors ${!isVerified ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#FFD600] hover:bg-yellow-400 text-black'}`}
                     >
                       <UploadCloud className="w-4 h-4" /> Upload Report
                     </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                     <div>
                       <span className="block text-gray-400 text-xs">Patient</span>
                       <span className="font-semibold text-gray-900">{req.memberName}</span>
                     </div>
                     <div>
                       <span className="block text-gray-400 text-xs">Date</span>
                       <span className="font-semibold text-gray-900">{req.dateRequested}</span>
                     </div>
                     <div className="col-span-2">
                       <span className="block text-gray-400 text-xs">Instructions</span>
                       <span className="italic">{req.symptoms || "Standard Panel"}</span>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* History */}
          <div>
            <h3 className="text-lg font-bold text-gray-700 mb-4">Completed Orders</h3>
             <div className="space-y-3">
               {completedTasks.map(req => (
                 <div key={req.id} className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center opacity-75">
                    <div>
                      <h4 className="font-bold text-sm">{req.serviceType}</h4>
                      <p className="text-xs text-gray-500">{req.memberName}</p>
                    </div>
                    <div className="flex items-center gap-1 text-green-600 text-xs font-bold">
                      <CheckCircle className="w-4 h-4" /> Uploaded
                    </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      )}

      {activeTab === 'PROFILE' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-in fade-in duration-300">
           <div className="flex items-center justify-between mb-6 border-b pb-4">
              <div>
                <h3 className="text-xl font-bold text-[#4A148C]">Partner Registration & KYC</h3>
                <p className="text-sm text-gray-500">Manage your entity details and compliance documents.</p>
              </div>
              <div className="text-right">
                 <span className="text-xs text-gray-400 uppercase">Status</span>
                 <p className={`font-bold ${isVerified ? 'text-green-600' : 'text-orange-500'}`}>{isVerified ? 'Verified' : 'Pending Verification'}</p>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Form Section */}
              <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Registered Entity Name</label>
                   <input 
                     type="text" 
                     value={currentUser.name}
                     readOnly
                     className="w-full border-gray-300 bg-gray-50 rounded-lg shadow-sm p-2 border text-gray-600 cursor-not-allowed"
                   />
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Entity Type</label>
                   <select 
                     value={entityType}
                     onChange={(e) => setEntityType(e.target.value)}
                     className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#4A148C] focus:border-[#4A148C] p-2 border"
                   >
                     <option>Path Lab</option>
                     <option>Pharmacy</option>
                     <option>Clinic / Hospital</option>
                     <option>Diagnostic Center</option>
                   </select>
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Registration / License Number</label>
                   <input 
                     type="text" 
                     value={licenseNumber}
                     onChange={(e) => setLicenseNumber(e.target.value)}
                     placeholder="e.g. LAB-2024-998877"
                     className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#4A148C] focus:border-[#4A148C] p-2 border"
                   />
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                    <input type="email" placeholder="admin@lab.com" className="w-full border-gray-300 rounded-lg shadow-sm p-2 border" />
                 </div>

                 <div className="pt-4">
                    <button className="bg-[#4A148C] text-white font-bold py-2 px-6 rounded-lg shadow hover:bg-purple-800 transition-colors">
                       Save Details
                    </button>
                 </div>
              </div>

              {/* Document Upload Section */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                 <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                   <FileText className="w-5 h-5 text-[#4A148C]" /> Documents Repository
                 </h4>
                 
                 <div className="space-y-3 mb-6">
                    {docs.map(doc => (
                       <div key={doc.id} className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center shadow-sm">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-purple-100 text-[#4A148C] rounded flex items-center justify-center">
                                <FileText className="w-5 h-5" />
                             </div>
                             <div>
                                <p className="text-sm font-semibold text-gray-800">{doc.name}</p>
                                <p className="text-xs text-gray-500">{doc.type} • {doc.uploadDate}</p>
                             </div>
                          </div>
                          <div>
                            {doc.status === 'VERIFIED' && <span className="text-green-600 bg-green-50 px-2 py-1 text-xs rounded-full font-bold border border-green-100">Verified</span>}
                            {doc.status === 'PENDING' && <span className="text-orange-600 bg-orange-50 px-2 py-1 text-xs rounded-full font-bold border border-orange-100">Pending</span>}
                            {doc.status === 'REJECTED' && <span className="text-red-600 bg-red-50 px-2 py-1 text-xs rounded-full font-bold border border-red-100">Rejected</span>}
                          </div>
                       </div>
                    ))}
                 </div>

                 <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-white hover:border-[#4A148C] transition-colors relative">
                    <input 
                      type="file" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleFileUpload}
                    />
                    <div className="pointer-events-none">
                      <div className="w-12 h-12 bg-purple-100 text-[#4A148C] rounded-full flex items-center justify-center mx-auto mb-3">
                         <Plus className="w-6 h-6" />
                      </div>
                      <h5 className="font-bold text-gray-800">Upload New Document</h5>
                      <p className="text-xs text-gray-500 mt-1">Supports PDF, JPG, PNG (Max 5MB)</p>
                      <p className="text-xs text-blue-600 mt-2 font-medium">Required: Business Registration, Medical License</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};