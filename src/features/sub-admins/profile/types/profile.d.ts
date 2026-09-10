export interface ProfileData {
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

export interface ProfileResponse {
  statusCode: number;
  message: string;
  data: ProfileData;
}