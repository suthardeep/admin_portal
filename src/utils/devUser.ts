import { User } from "@/types/user";

export const DEV_USER: User = {
  id: "dev-user-001",
  email: "dev.admin@example.com",
  firstName: "Dev",
  lastName: "Admin",
  role: "ADMIN",
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  imageUrl: "https://i.pravatar.cc/150?img=12", 
}