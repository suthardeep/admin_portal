export interface AdminProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl?: string;
  customRoles?: Array<{
    id: string;
    name: string;
  }>;
  allowSensitiveInfo?: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProfileResponse {
  statusCode: number;
  message: string;
  data: AdminProfileData;
}