export interface UpdateClientContactRequest {
    contactId: string;
    firstName: string;
    lastName: string;
    fullName: string;
    designation?: string | null;
    department?: string | null;
    email?: string | null;
    phone?: string | null;
    mobile?: string | null;
    status: number;
    notes?: string | null;
}
