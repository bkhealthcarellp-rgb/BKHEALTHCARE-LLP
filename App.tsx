import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { LandingPage } from './components/LandingPage';
import { MemberView } from './components/MemberView';
import { ManagerDashboard } from './components/ManagerDashboard';
import { VendorDashboard } from './components/VendorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { User, UserRole, RequestStatus, ServiceRequest, Vendor, VerificationStatus } from './types';

// Mock Initial Data
const MOCK_MANAGER: User = {
  id: 'mgr_1',
  name: 'Dr. Anjali Sharma',
  role: UserRole.HEALTH_MANAGER,
  avatarUrl: 'https://picsum.photos/id/64/200/200',
  specialization: 'Senior Care Coordinator',
  verified: true,
  verificationStatus: VerificationStatus.VERIFIED
};

const MOCK_EXISTING_VENDORS: User[] = [
  { 
    id: 'ven_1', 
    name: 'City Path Labs (Gold)', 
    role: UserRole.VENDOR_LAB,
    type: 'PATH_LAB', 
    verified: true,
    verificationStatus: VerificationStatus.VERIFIED 
  } as Vendor,
];

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // App Data
  const [users, setUsers] = useState<User[]>([...MOCK_EXISTING_VENDORS, MOCK_MANAGER]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);

  // Registration Handlers
  const handleMemberRegister = (data: any) => {
    const newMember: User = {
      id: `mem_${Date.now()}`,
      name: data.name,
      role: UserRole.MEMBER,
      email: data.email,
      mobile: data.mobile,
      dob: data.dob,
      membershipPlan: data.planType,
      assignedManagerId: MOCK_MANAGER.id, // Auto-assign for demo
      verified: true // Members auto-verified in this flow
    };
    setCurrentUser(newMember);
    setIsLoggedIn(true);
  };

  const handlePartnerRegister = (data: any) => {
    const newPartner: User = {
      id: `ven_${Date.now()}`,
      name: data.entityName,
      role: UserRole.VENDOR_LAB,
      ownerName: data.ownerName,
      firmType: data.firmType,
      entityType: 'Path Lab', // Defaulting for demo
      verificationStatus: VerificationStatus.PENDING,
      verified: false
    };
    setUsers([...users, newPartner]);
    setCurrentUser(newPartner);
    setIsLoggedIn(true);
  };

  const handleManagerRegister = (data: any) => {
    const newManager: User = {
      id: `mgr_${Date.now()}`,
      name: data.name,
      role: UserRole.HEALTH_MANAGER,
      email: data.email,
      mobile: data.mobile,
      specialization: data.specialization,
      experienceYears: data.experience,
      verificationStatus: VerificationStatus.PENDING,
      verified: false
    };
    setUsers([...users, newManager]);
    setCurrentUser(newManager);
    setIsLoggedIn(true);
  };

  // Workflow Handlers
  const handleCreateRequest = (type: string, date: string, symptoms: string, aiAnalysis: string) => {
    if (!currentUser) return;
    const newRequest: ServiceRequest = {
      id: `req_${Date.now()}`,
      memberId: currentUser.id,
      memberName: currentUser.name,
      managerId: MOCK_MANAGER.id,
      serviceType: type,
      dateRequested: date,
      symptoms: symptoms,
      aiAnalysis: aiAnalysis,
      status: RequestStatus.REQUESTED,
      auditLog: [{
        timestamp: new Date().toISOString(),
        actorId: currentUser.id,
        action: 'Created Request'
      }]
    };
    setRequests([newRequest, ...requests]);
  };

  const handleAssignVendor = (requestId: string, vendorId: string) => {
    if (!currentUser) return;
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          vendorId: vendorId,
          status: RequestStatus.VENDOR_ASSIGNED,
          auditLog: [...req.auditLog, {
            timestamp: new Date().toISOString(),
            actorId: currentUser?.id || 'sys',
            action: `Assigned Vendor: ${vendorId}`
          }]
        };
      }
      return req;
    }));
  };

  const handleUploadReport = (requestId: string) => {
    if (!currentUser) return;
    setTimeout(() => {
        setRequests(prev => prev.map(req => {
          if (req.id === requestId) {
            return {
              ...req,
              reportUrl: 'http://mock-url.com/report.pdf',
              status: RequestStatus.REPORT_UPLOADED,
              auditLog: [...req.auditLog, {
                timestamp: new Date().toISOString(),
                actorId: currentUser?.id || 'sys',
                action: 'Uploaded Report'
              }]
            };
          }
          return req;
        }));
    }, 1000);
  };

  const handleReleaseReport = (requestId: string) => {
     if (!currentUser) return;
     setRequests(prev => prev.map(req => {
       if (req.id === requestId) {
         return {
           ...req,
           status: RequestStatus.COMPLETED,
           auditLog: [...req.auditLog, {
             timestamp: new Date().toISOString(),
             actorId: currentUser?.id || 'sys',
             action: 'Released Report to Member'
           }]
         };
       }
       return req;
     }));
  };

  const handleVerifyUser = (userId: string, isApproved: boolean) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          verified: isApproved,
          verificationStatus: isApproved ? VerificationStatus.VERIFIED : VerificationStatus.REJECTED
        };
      }
      return u;
    }));
  };

  // Demo Switcher Logic
  const switchRole = (role: UserRole) => {
    setIsLoggedIn(true);
    if (role === UserRole.MEMBER) {
      setCurrentUser({
        id: 'mem_demo', name: 'Rajesh Kumar', role: UserRole.MEMBER, assignedManagerId: MOCK_MANAGER.id, verified: true
      });
    }
    if (role === UserRole.HEALTH_MANAGER) {
      // Find the first verified manager, or fallback to mock
      const mgr = users.find(u => u.role === UserRole.HEALTH_MANAGER && u.verified) || MOCK_MANAGER;
      setCurrentUser(mgr);
    }
    if (role === UserRole.VENDOR_LAB) {
      // Switch to the first verified vendor or create a dummy one
      const vendor = users.find(u => u.role === UserRole.VENDOR_LAB) || MOCK_EXISTING_VENDORS[0];
      setCurrentUser(vendor);
    }
    if (role === UserRole.ADMIN) {
      setCurrentUser({
        id: 'admin_1', name: 'Super Admin', role: UserRole.ADMIN, verified: true
      });
    }
  };

  return (
    <Layout 
      currentUserRole={currentUser?.role} 
      currentUserName={currentUser?.name}
      isLoggedIn={isLoggedIn}
      onLogout={() => { setIsLoggedIn(false); setCurrentUser(null); }}
      onRoleSwitch={switchRole}
    >
      {!isLoggedIn && (
        <LandingPage 
          onRegisterMember={handleMemberRegister}
          onRegisterPartner={handlePartnerRegister}
          onRegisterManager={handleManagerRegister}
        />
      )}

      {isLoggedIn && currentUser?.role === UserRole.MEMBER && (
        <MemberView 
          currentUser={currentUser} 
          requests={requests}
          onCreateRequest={handleCreateRequest}
          manager={MOCK_MANAGER}
        />
      )}

      {isLoggedIn && currentUser?.role === UserRole.HEALTH_MANAGER && (
        <ManagerDashboard 
          currentUser={currentUser}
          requests={requests}
          vendors={users.filter(u => u.role === UserRole.VENDOR_LAB && u.verificationStatus === VerificationStatus.VERIFIED) as Vendor[]}
          onAssignVendor={handleAssignVendor}
          onReleaseReport={handleReleaseReport}
        />
      )}

      {isLoggedIn && currentUser?.role === UserRole.VENDOR_LAB && (
        <VendorDashboard 
          currentUser={currentUser}
          requests={requests}
          onUploadReport={handleUploadReport}
        />
      )}

      {isLoggedIn && currentUser?.role === UserRole.ADMIN && (
        <AdminDashboard 
          users={users}
          onVerifyUser={handleVerifyUser}
        />
      )}

    </Layout>
  );
};

export default App;