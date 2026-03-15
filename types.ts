export enum UserRole {
  MEMBER = 'MEMBER',
  HEALTH_MANAGER = 'HEALTH_MANAGER',
  VENDOR_LAB = 'VENDOR_LAB', // Service Partner
  ADMIN = 'ADMIN', // Super Admin
}

export enum RequestStatus {
  REQUESTED = 'REQUESTED',
  MANAGER_REVIEW = 'MANAGER_REVIEW',
  VENDOR_ASSIGNED = 'VENDOR_ASSIGNED',
  REPORT_UPLOADED = 'REPORT_UPLOADED',
  COMPLETED = 'COMPLETED',
}

export enum VerificationStatus {
  PENDING = 'PENDING_ADMIN_APPROVAL',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export interface KYCDocument {
  id: string;
  name: string;
  type: 'LICENSE' | 'REGISTRATION' | 'ACCREDITATION' | 'GST' | 'CHEQUE' | 'ID_PROOF' | 'ADDRESS_PROOF' | 'DEGREE';
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  uploadDate: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
  avatarUrl?: string;
  assignedManagerId?: string; // For Members
  
  // Health Manager Specifics
  specialization?: string;
  experienceYears?: number;

  // Member Specifics
  dob?: string;
  bloodGroup?: string;
  mobile?: string;
  aadharNumber?: string; // Encrypted in backend
  addressText?: string;
  membershipPlan?: string;
  subscriptionExpiry?: string;

  // Service Partner Specifics
  entityType?: string; // Path Lab, Pharmacy
  firmType?: string; // Proprietorship, LLP, Pvt Ltd
  licenseNumber?: string;
  gstNumber?: string;
  ownerName?: string;
  verificationStatus?: VerificationStatus;
  kycDocuments?: KYCDocument[];
  verified?: boolean;
}

export interface ServiceRequest {
  id: string;
  memberId: string;
  memberName: string;
  managerId: string;
  vendorId?: string;
  serviceType: string;
  status: RequestStatus;
  dateRequested: string;
  symptoms?: string;
  aiAnalysis?: string;
  reportUrl?: string;
  auditLog: AuditEntry[];
}

export interface AuditEntry {
  timestamp: string;
  actorId: string;
  action: string;
}

export interface Vendor extends User {
  type: 'PATH_LAB' | 'DOCTOR' | 'PHARMACY';
}