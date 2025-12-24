export interface ProductRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  approved: boolean;
  verifiedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}
