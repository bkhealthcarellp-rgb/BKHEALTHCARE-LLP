import React, { useState } from 'react';
import { User, ServiceRequest, RequestStatus } from '../types';
import { analyzeSymptoms } from '../services/geminiService';
import { MessageCircle, Stethoscope, FlaskConical, Pill, FileText, CheckCircle2, Clock, MapPin, Sparkles } from 'lucide-react';

interface MemberViewProps {
  currentUser: User;
  requests: ServiceRequest[];
  onCreateRequest: (type: string, date: string, symptoms: string, aiAnalysis: string) => void;
  manager: User | undefined;
}

export const MemberView: React.FC<MemberViewProps> = ({ currentUser, requests, onCreateRequest, manager }) => {
  const [showRequestForm, setShowRequestForm] = useState(false);
  
  // Form State
  const [serviceType, setServiceType] = useState('Home Blood Test');
  const [date, setDate] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!symptoms) return;
    setIsAnalyzing(true);
    const result = await analyzeSymptoms(symptoms);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateRequest(serviceType, date, symptoms, aiAnalysis);
    setShowRequestForm(false);
    // Reset
    setSymptoms('');
    setDate('');
    setAiAnalysis('');
  };

  // Status visualizer helper
  const getStatusColor = (status: RequestStatus) => {
    switch(status) {
      case RequestStatus.REQUESTED: return 'bg-blue-500';
      case RequestStatus.MANAGER_REVIEW: return 'bg-purple-500';
      case RequestStatus.VENDOR_ASSIGNED: return 'bg-yellow-500';
      case RequestStatus.REPORT_UPLOADED: return 'bg-orange-500';
      case RequestStatus.COMPLETED: return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Health Manager Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img 
              src={manager?.avatarUrl || "https://picsum.photos/100/100"} 
              alt="Manager" 
              className="w-16 h-16 rounded-full object-cover border-2 border-[#4A148C]"
            />
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">My Health Manager</h2>
            <p className="text-gray-600">{manager?.name || 'Assigning...'}</p>
            <p className="text-xs text-[#4A148C] font-semibold uppercase tracking-wider mt-1">Dedicated Support</p>
          </div>
        </div>
        <button className="bg-[#FFD600] text-black font-bold py-3 px-6 rounded-lg shadow-md hover:bg-yellow-400 transition-colors flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Chat Now
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. Service Grid */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-bold text-[#4A148C] flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> Request Services
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Doctor Visit', icon: Stethoscope },
              { label: 'Lab Test', icon: FlaskConical },
              { label: 'Pharmacy', icon: Pill },
              { label: 'Claims', icon: FileText },
            ].map((item) => (
              <button 
                key={item.label}
                onClick={() => {
                  setServiceType(item.label === 'Lab Test' ? 'Home Blood Test' : item.label);
                  setShowRequestForm(true);
                }}
                className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-[#4A148C] hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-[#4A148C] transition-colors">
                  <item.icon className="w-6 h-6 text-[#4A148C] group-hover:text-white" />
                </div>
                <span className="font-medium text-gray-700">{item.label}</span>
              </button>
            ))}
          </div>

          {/* New Request Form Modal/Inline */}
          {showRequestForm && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-[#4A148C] p-4 text-white flex justify-between items-center">
                <h3 className="font-bold">New Service Request</h3>
                <button onClick={() => setShowRequestForm(false)} className="hover:text-gray-200">Close</button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                    <select 
                      value={serviceType} 
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#4A148C] focus:border-[#4A148C] p-2 border"
                    >
                      <option>Home Blood Test</option>
                      <option>General Physician Home Visit</option>
                      <option>Video Consultation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                    <input 
                      type="date" 
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#4A148C] focus:border-[#4A148C] p-2 border"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms / Notes</label>
                  <div className="flex gap-2">
                    <textarea 
                      required
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="Describe what you are feeling..."
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#4A148C] focus:border-[#4A148C] p-2 border h-20"
                    />
                    <button 
                      type="button"
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || !symptoms}
                      className="shrink-0 bg-purple-100 text-[#4A148C] p-2 rounded-lg hover:bg-purple-200 disabled:opacity-50 flex flex-col items-center justify-center text-xs w-20"
                    >
                      <Sparkles className="w-5 h-5 mb-1" />
                      {isAnalyzing ? 'Thinking...' : 'AI Check'}
                    </button>
                  </div>
                  {aiAnalysis && (
                    <div className="mt-2 bg-blue-50 border border-blue-100 p-3 rounded-lg text-sm text-blue-800 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 mt-0.5 shrink-0" />
                      <p>{aiAnalysis}</p>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                   <button type="submit" className="w-full bg-[#FFD600] text-black font-bold py-3 rounded-lg shadow hover:bg-yellow-400">
                     Submit Request
                   </button>
                </div>
              </form>
            </div>
          )}

          {/* Active Requests List */}
          <div className="space-y-4">
             <h3 className="text-lg font-bold text-[#4A148C]">My Active Requests</h3>
             {requests.filter(r => r.memberId === currentUser.id && r.status !== RequestStatus.COMPLETED).length === 0 && (
                <p className="text-gray-500 italic">No active requests.</p>
             )}
             {requests.filter(r => r.memberId === currentUser.id).map(req => (
               <div key={req.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                 <div className="flex-grow">
                   <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-900">{req.serviceType}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(req.status)}`}>
                        {req.status.replace('_', ' ')}
                      </span>
                   </div>
                   <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                     <Clock className="w-4 h-4" /> Requested: {new Date(req.dateRequested).toLocaleDateString()}
                   </p>
                   {req.aiAnalysis && (
                     <p className="text-xs text-gray-500 italic mt-2 border-l-2 border-purple-200 pl-2">
                       "{req.aiAnalysis}"
                     </p>
                   )}
                   {req.reportUrl && req.status === RequestStatus.COMPLETED && (
                      <a href="#" className="mt-3 inline-flex items-center text-sm font-bold text-[#4A148C] hover:underline">
                        <FileText className="w-4 h-4 mr-1" /> Download Report
                      </a>
                   )}
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* 3. Timeline Visual */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
          <h3 className="text-lg font-bold text-[#4A148C] mb-6">Service Tracker</h3>
          
          {/* Mock Timeline for the most recent active request */}
          <div className="relative border-l-2 border-blue-100 ml-3 space-y-8 pb-2">
            {[
              { status: RequestStatus.REQUESTED, title: 'Requested', date: 'Today' },
              { status: RequestStatus.MANAGER_REVIEW, title: 'Manager Reviewing', date: 'In Progress' },
              { status: RequestStatus.VENDOR_ASSIGNED, title: 'Vendor Assigned', date: 'Pending' },
              { status: RequestStatus.COMPLETED, title: 'Completed', date: 'Pending' }
            ].map((step, idx) => (
              <div key={idx} className="relative pl-6">
                <span className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${
                  // Logic to highlight current step based on generic active request state
                  // Ideally would map to specific request. Just demoing style here.
                   idx === 0 ? 'bg-blue-500' : 'bg-gray-300'
                }`}></span>
                <h4 className="font-medium text-gray-900 text-sm">{step.title}</h4>
                <p className="text-xs text-gray-500">{step.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};