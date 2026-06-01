export interface ClientContactViewModel {
    id: string;
    clientId: string;
    firstName: string;
    lastName: string;
    fullName: string;
    designation?: string | null;
    department?: string | null;
    email?: string | null;
    phone?: string | null;
    mobile?: string | null;
    isPrimary: boolean;
    status: number;
    statusName: string;
    notes?: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string | null;
}
