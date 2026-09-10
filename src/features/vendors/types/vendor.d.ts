import { PaginationMeta } from "@/types/baseApi";

// --- Base Types ---
interface BaseApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

// --- Vendor Types ---
export interface VendorListItem {
  id: string;
  keycloakUserId: string;
  fullName: string | null;
  email: string | null;
  mobile: string;
  businessName: string | null;
  city?: string | null;
  state?: string | null;
  verificationStatus: 'pending' | 'under_review' | 'verified' | 'rejected';
  onboardingStep: number;
  isCompleted: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedVendorList {
  data: VendorListItem[];
  meta: PaginationMeta;
}

// --- Vendor Details Types ---
export interface BusinessDetails {
  name: string;
  addressLine1: string;
  addressLine2: string | null;
  pinCode: string;
  city: string;
  state: string;
  panCard: string;
  registrationCertificate: string;
}

export interface AuthorisedPersonDetails {
  name: string;
  mobileNumber: string;
  email: string;
  panCard: string;
  aadharCard: string;
}

export interface BankDetails {
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  bankProof: string;
}

export interface BrandDocument {
  url: string;
  name: string;
}

export interface BrandDocumentGroup {
  documents: BrandDocument[];
  groupName: string;
}

export interface SelectedCategory {
  id: string;
  name: string;
  image: string;
}

export interface Brand {
  website: string;
  brandLogo: string;
  brandName: string;
  socialMedia: string;
  brandDocuments: BrandDocumentGroup[];
  natureOfBusiness: string;
  selectedCategoryIds: string[];
  selectedCategories: SelectedCategory[];
}

export interface OnboardingStep {
  step: number;
  name: string;
  description: string;
  completed: boolean;
  required: boolean;
  missingRequirements: string[];
  completedAt?: string;
}

export interface Onboarding {
  isCompleted: boolean;
  currentStep: number;
  completedSteps: number;
  totalSteps: number;
  steps: OnboardingStep[];
  completionPercentage: number;
  nextStep: string;
  canProceedToVerification: boolean;
}

export interface VendorDetails {
  id: string;
  aavakUserId: string;
  phone: string;
  email: string;
  fullName: string;
  phoneVerified: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  gstNumber: string | null;
  selfDeclared: boolean;
  gstCertificate: string | null;
  brands: Brand[];
  verificationStatus: 'pending' | 'under_review' | 'verified' | 'rejected';
  isActive: boolean;
  isCompleted: boolean;
  onboardingStep: number;
  businessDetails: BusinessDetails;
  authorisedPersonDetails: AuthorisedPersonDetails;
  bankDetails: BankDetails;
  rejectionStep: number | null;
  rejectionReason: string | null;
  rejectionHistory: any | null;
  lastRejectionAt: string | null;
  hasVendorProfile: boolean;
  onboarding: Onboarding;
  platforms: any[];
  deviceId: string | null;
  fcmToken: string | null;
  hashToken: string | null;
  isNewProfile: boolean;
}

// --- API Response Types ---
export type GetAllVendorsResponse = BaseApiResponse<PaginatedVendorList>;
export type GetVendorDetailsResponse = BaseApiResponse<VendorDetails>;
export type DeleteVendorResponse = BaseApiResponse<null>;
export type ApproveVendorResponse = BaseApiResponse<VendorDetails>;
export type RejectVendorResponse = BaseApiResponse<VendorDetails>;

// --- Query Parameters ---
export interface GetAllVendorsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  verificationStatus?: string;
  isActive?: boolean;
}

export interface UpdateVendorParams {
  vendorId: string;
  data: Partial<VendorListItem>;
}

export interface ApproveVendorPayload {
  // Add any fields needed for approval
}

export interface RejectVendorPayload {
  rejectionTitle: string;
  rejectionDescription: string;
}