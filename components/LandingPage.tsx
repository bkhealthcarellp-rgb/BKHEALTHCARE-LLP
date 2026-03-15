import React, { useState } from 'react';
import { UserRole, VerificationStatus, KYCDocument } from '../types';
import { 
  User, Building2, UploadCloud, CreditCard, 
  CheckCircle, ArrowRight, Shield, FileText,
  Users, Briefcase, HeartPulse, Stethoscope, GraduationCap
} from 'lucide-react';

interface LandingPageProps {
  onRegisterMember: (data: any) => void;
  onRegisterPartner: (data: any) => void;
  onRegisterManager: (data: any) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onRegisterMember, onRegisterPartner, onRegisterManager }) => {
  const [activeTab, setActiveTab] = useState<'MEMBER' | 'PARTNER' | 'MANAGER'>('MEMBER');

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px] flex flex-col md:flex-row">
      
      {/* Visual Side */}
      <div className={`md:w-5/12 p-8 text-white flex flex-col justify-between transition-colors duration-500 ${
        activeTab === 'MEMBER' ? 'bg-[#4A148C]' : 
        activeTab === 'PARTNER' ? 'bg-[#2D0C5E]' : 'bg-[#1A237E]'
      }`}>
        <div>
          <div 
            className="inline-block px-3 py-1 bg-white/20 rounded-full text-[14px] font-bold italic mb-6"
            style={{ fontFamily: '"Goudy Old Style", serif' }}
          >
            Sehat Ka Saathi...Companion to facilitate healthcare needs
          </div>
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            {activeTab === 'MEMBER' && 'Your Health,\nOur Priority.'}
            {activeTab === 'PARTNER' && 'Grow Your\nHealthcare Business.'}
            {activeTab === 'MANAGER' && 'Empower Patients,\nAdvance Your Career.'}
          </h2>
          <p className="text-purple-100 text-lg opacity-90">
            {activeTab === 'MEMBER' && 'Join thousands of families who trust us with their medical coordination. From home tests to insurance claims, we manage it all.'}
            {activeTab === 'PARTNER' && 'Connect with a vast network of patients. Streamline your appointments, report delivery, and payments in one secure platform.'}
            {activeTab === 'MANAGER' && 'Join our elite network of Care Coordinators. Manage patient portfolios, coordinate services, and earn securely.'}
          </p>
        </div>

        <div className="space-y-4">
           {activeTab === 'MEMBER' && (
             <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                   <HeartPulse className="w-6 h-6 text-[#FFD600]" />
                   <span className="font-bold">24/7 Health Manager</span>
                </div>
                <p className="text-sm text-purple-200">Dedicated support for every medical need.</p>
             </div>
           )}
           {activeTab === 'PARTNER' && (
             <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                   <Briefcase className="w-6 h-6 text-[#FFD600]" />
                   <span className="font-bold">Partner Ecosystem</span>
                </div>
                <p className="text-sm text-purple-200">Verified leads and automated service orders.</p>
             </div>
           )}
           {activeTab === 'MANAGER' && (
             <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                   <Stethoscope className="w-6 h-6 text-[#FFD600]" />
                   <span className="font-bold">Clinical Leadership</span>
                </div>
                <p className="text-sm text-purple-200">Tools to manage patient health records effectively.</p>
             </div>
           )}
        </div>
      </div>

      {/* Form Side */}
      <div className="md:w-7/12 bg-gray-50 flex flex-col">
        {/* Toggle Switch */}
        <div className="flex border-b border-gray-200 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('MEMBER')}
            className={`flex-1 py-6 px-4 text-center font-bold text-xs sm:text-sm uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === 'MEMBER' ? 'bg-white text-[#4A148C] border-b-4 border-[#FFD600]' : 'bg-gray-100 text-gray-500'}`}
          >
            For Members
          </button>
          <button 
            onClick={() => setActiveTab('MANAGER')}
            className={`flex-1 py-6 px-4 text-center font-bold text-xs sm:text-sm uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === 'MANAGER' ? 'bg-white text-[#4A148C] border-b-4 border-[#FFD600]' : 'bg-gray-100 text-gray-500'}`}
          >
            Health Managers
          </button>
          <button 
            onClick={() => setActiveTab('PARTNER')}
            className={`flex-1 py-6 px-4 text-center font-bold text-xs sm:text-sm uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === 'PARTNER' ? 'bg-white text-[#4A148C] border-b-4 border-[#FFD600]' : 'bg-gray-100 text-gray-500'}`}
          >
            Service Partners
          </button>
        </div>

        <div className="p-8 flex-grow overflow-y-auto">
          {activeTab === 'MEMBER' && <MemberRegistrationForm onSubmit={onRegisterMember} />}
          {activeTab === 'PARTNER' && <PartnerRegistrationForm onSubmit={onRegisterPartner} />}
          {activeTab === 'MANAGER' && <ManagerRegistrationForm onSubmit={onRegisterManager} />}
        </div>
      </div>
    </div>
  );
};

// --- Member Registration Components ---

const MemberRegistrationForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', email: '', mobile: '', dob: '', bloodGroup: '', address: '',
    aadhar: '', planType: 'Single User', additionalMembers: 0
  });

  const plans = [
    { name: 'Single User', price: 1000, desc: 'Individual Care Plan' },
    { name: 'Family of 4', price: 3500, desc: 'Parents & Kids (Up to 4)' },
    { name: 'Organization', price: 5000, desc: 'Corporate Wellness (Base Fee)' },
  ];

  const calculateTotal = () => {
    let base = 0;
    if (formData.planType === 'Single User') base = 1000;
    if (formData.planType === 'Family of 4') base = 3500;
    if (formData.planType === 'Organization') base = 5000;
    
    // Additional member cost logic
    const additionalCost = formData.additionalMembers * 750;
    return base + additionalCost;
  };

  const handleNext = () => setStep(step + 1);

  return (
    <div className="max-w-md mx-auto">
      {/* Progress Bar */}
      <div className="flex justify-between mb-8">
        {[1,2,3,4].map(i => (
          <div key={i} className={`h-2 flex-1 mx-1 rounded-full ${step >= i ? 'bg-[#4A148C]' : 'bg-gray-200'}`} />
        ))}
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        {step === 1 && "Demographic Details"}
        {step === 2 && "Identity Verification"}
        {step === 3 && "Select Membership Plan"}
        {step === 4 && "Payment & Review"}
      </h3>

      <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
        
        {/* Step 1: Basics */}
        {step === 1 && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input 
                type="text" required
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                className="mt-1 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#4A148C]" 
                placeholder="e.g. Rajesh Kumar"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Mobile</label>
                <input 
                  type="tel" required
                  value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})}
                  className="mt-1 w-full border border-gray-300 rounded-lg p-3" 
                  placeholder="+91"
                />
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700">DOB</label>
                 <input 
                   type="date" 
                   value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})}
                   className="mt-1 w-full border border-gray-300 rounded-lg p-3" 
                 />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input 
                type="email" 
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                className="mt-1 w-full border border-gray-300 rounded-lg p-3" 
                placeholder="you@example.com"
              />
            </div>
            <button onClick={handleNext} className="w-full bg-[#4A148C] text-white font-bold py-3 rounded-lg mt-4 hover:bg-purple-800">
              Continue
            </button>
          </>
        )}

        {/* Step 2: KYC */}
        {step === 2 && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Aadhar Number</label>
              <input 
                type="text" 
                value={formData.aadhar} onChange={e => setFormData({...formData, aadhar: e.target.value})}
                className="mt-1 w-full border border-gray-300 rounded-lg p-3 tracking-widest" 
                placeholder="XXXX XXXX XXXX"
              />
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Upload Documents</label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#4A148C] cursor-pointer bg-white">
                <UploadCloud className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                <span className="text-sm text-gray-600">Government ID Proof (PDF/JPG)</span>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#4A148C] cursor-pointer bg-white">
                <UploadCloud className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                <span className="text-sm text-gray-600">Address Proof (Utility Bill)</span>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button onClick={() => setStep(1)} className="flex-1 text-gray-600 font-medium">Back</button>
              <button onClick={handleNext} className="flex-1 bg-[#4A148C] text-white font-bold py-3 rounded-lg hover:bg-purple-800">
                Next Step
              </button>
            </div>
          </>
        )}

        {/* Step 3: Plans */}
        {step === 3 && (
          <>
            <div className="space-y-4">
               <label className="block text-sm font-medium text-gray-700">Select Membership Type</label>
               <select 
                 value={formData.planType}
                 onChange={e => setFormData({...formData, planType: e.target.value, additionalMembers: 0})}
                 className="w-full border border-gray-300 rounded-lg p-3 text-lg font-medium text-[#4A148C]"
               >
                 {plans.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
               </select>

               {/* Plan Description Card */}
               <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h4 className="font-bold text-[#4A148C] text-lg">
                    {formData.planType} Plan
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {plans.find(p => p.name === formData.planType)?.desc}
                  </p>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-900">₹{plans.find(p => p.name === formData.planType)?.price}</span>
                    <span className="text-sm text-gray-500">/ year</span>
                  </div>
               </div>

               {/* Add-ons */}
               <div className="pt-2">
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   {formData.planType === 'Organization' ? 'Total Employees/Members' : 'Add Additional Members?'}
                 </label>
                 <div className="flex items-center gap-3">
                   <input 
                     type="number" 
                     min="0"
                     value={formData.additionalMembers}
                     onChange={e => setFormData({...formData, additionalMembers: parseInt(e.target.value) || 0})}
                     className="w-24 border border-gray-300 rounded-lg p-2 text-center"
                   />
                   <span className="text-sm text-gray-500">x ₹750/year</span>
                 </div>
                 {formData.planType === 'Organization' && (
                   <p className="text-xs text-gray-500 mt-1">Includes base fee + per member cost.</p>
                 )}
               </div>

               {/* Total */}
               <div className="border-t pt-4 mt-4 flex justify-between items-center">
                  <span className="font-medium text-gray-600">Total Payable</span>
                  <span className="text-2xl font-bold text-[#4A148C]">₹{calculateTotal()}</span>
               </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button onClick={() => setStep(2)} className="flex-1 text-gray-600 font-medium">Back</button>
              <button onClick={handleNext} className="flex-1 bg-[#4A148C] text-white font-bold py-3 rounded-lg hover:bg-purple-800">
                Proceed to Pay
              </button>
            </div>
          </>
        )}

        {/* Step 4: Payment */}
        {step === 4 && (
           <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                 <Shield className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800">Confirm Registration</h4>
                <p className="text-gray-500">Secure Payment Gateway</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg text-left text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-bold">{formData.planType}</span>
                </div>
                {formData.additionalMembers > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Additional Members:</span>
                    <span className="font-bold">{formData.additionalMembers}</span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2 text-[#4A148C]">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold text-lg">₹{calculateTotal()}</span>
                </div>
              </div>

              <button 
                onClick={() => onSubmit({...formData, totalPaid: calculateTotal()})}
                className="w-full bg-[#FFD600] text-black font-bold py-4 rounded-lg shadow-lg hover:bg-yellow-400 flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" /> Pay & Register
              </button>
              <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                <Shield className="w-3 h-3" /> 256-bit Secure Encryption
              </p>
           </div>
        )}

      </div>
    </div>
  );
};


// --- Partner Registration Components ---

const PartnerRegistrationForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const [formData, setFormData] = useState({
     entityName: '', firmType: 'Proprietorship', ownerName: '', 
     gst: '', email: '', phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-4">
         <h3 className="text-xl font-bold text-[#4A148C] mb-4">Entity Details</h3>
         
         <div>
           <label className="block text-sm font-medium text-gray-700">Name of Entity</label>
           <input 
             type="text" required
             value={formData.entityName} onChange={e => setFormData({...formData, entityName: e.target.value})}
             className="mt-1 w-full border border-gray-300 rounded-lg p-3" 
             placeholder="e.g. City Care Diagnostics"
           />
         </div>

         <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Firm Type</label>
              <select 
                value={formData.firmType} onChange={e => setFormData({...formData, firmType: e.target.value})}
                className="mt-1 w-full border border-gray-300 rounded-lg p-3"
              >
                <option>Proprietorship</option>
                <option>Partnership</option>
                <option>LLP</option>
                <option>Pvt Ltd</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Owner/Director Name</label>
              <input 
                 type="text" required
                 value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})}
                 className="mt-1 w-full border border-gray-300 rounded-lg p-3"
               />
            </div>
         </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-[#4A148C] mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" /> KYC Vault
        </h3>
        <p className="text-xs text-gray-500 mb-4">Upload secure documents for verification. All files are encrypted.</p>
        
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Registration Cert', icon: Building2 },
            { label: 'Owner ID Proof', icon: User },
            { label: 'GST Certificate', icon: FileText },
            { label: 'Cancelled Cheque', icon: CreditCard }
          ].map((item) => (
             <div key={item.label} className="border border-gray-200 bg-white p-4 rounded-lg flex flex-col items-center justify-center text-center hover:border-[#4A148C] hover:shadow-md cursor-pointer transition-all h-32">
                <item.icon className="w-8 h-8 text-gray-300 mb-2" />
                <span className="text-xs font-bold text-gray-600">{item.label}</span>
                <span className="text-[10px] text-blue-500 mt-1">Browse File</span>
             </div>
          ))}
        </div>
      </div>

      <button type="submit" className="w-full bg-[#FFD600] text-black font-bold py-4 rounded-lg shadow-lg hover:bg-yellow-400 mt-4">
        Submit for Admin Verification
      </button>
    </form>
  );
};

// --- Manager Registration Components ---

const ManagerRegistrationForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const [formData, setFormData] = useState({
     name: '', email: '', mobile: '', 
     specialization: 'General Physician', experience: '0',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-4">
         <h3 className="text-xl font-bold text-[#4A148C] mb-4">Clinical Profile</h3>
         
         <div>
           <label className="block text-sm font-medium text-gray-700">Full Name (with Title)</label>
           <input 
             type="text" required
             value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
             className="mt-1 w-full border border-gray-300 rounded-lg p-3" 
             placeholder="e.g. Dr. Anjali Sharma"
           />
         </div>

         <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Specialization</label>
              <select 
                value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})}
                className="mt-1 w-full border border-gray-300 rounded-lg p-3"
              >
                <option>General Physician</option>
                <option>Care Coordinator</option>
                <option>Senior Nurse</option>
                <option>Health Administrator</option>
                <option>Ayurvedic Specialist</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Experience (Years)</label>
              <input 
                 type="number" required min="0"
                 value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})}
                 className="mt-1 w-full border border-gray-300 rounded-lg p-3"
               />
            </div>
         </div>

         <div className="grid grid-cols-2 gap-4">
           <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input 
                 type="email" required
                 value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                 className="mt-1 w-full border border-gray-300 rounded-lg p-3"
               />
           </div>
           <div>
              <label className="block text-sm font-medium text-gray-700">Mobile</label>
              <input 
                 type="tel" required
                 value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})}
                 className="mt-1 w-full border border-gray-300 rounded-lg p-3"
               />
           </div>
         </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-[#4A148C] mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" /> Onboarding Docs
        </h3>
        <p className="text-xs text-gray-500 mb-4">Mandatory documents for background verification.</p>
        
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Government ID', icon: User },
            { label: 'Degree / Cert', icon: GraduationCap },
            { label: 'Cancelled Cheque', icon: CreditCard }
          ].map((item) => (
             <div key={item.label} className="border border-gray-200 bg-white p-4 rounded-lg flex flex-col items-center justify-center text-center hover:border-[#4A148C] hover:shadow-md cursor-pointer transition-all h-32">
                <item.icon className="w-8 h-8 text-gray-300 mb-2" />
                <span className="text-xs font-bold text-gray-600">{item.label}</span>
                <span className="text-[10px] text-blue-500 mt-1">Browse File</span>
             </div>
          ))}
        </div>
      </div>

      <button type="submit" className="w-full bg-[#4A148C] text-white font-bold py-4 rounded-lg shadow-lg hover:bg-purple-800 mt-4">
        Submit Application
      </button>
    </form>
  );
};