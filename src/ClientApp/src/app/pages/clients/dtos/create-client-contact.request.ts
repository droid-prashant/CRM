export interface CreateClientContactRequest {
    clientId: string;
    firstName: string;
    lastName: string;
    designation?: string | null;
    department?: string | null;
    email?: string | null;
    phone?: string | null;
    mobile?: string | null;
    isPrimary: boolean;
    notes?: string | null;
}
