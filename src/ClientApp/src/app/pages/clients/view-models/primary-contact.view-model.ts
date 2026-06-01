export interface PrimaryContactViewModel {
    contactId: string;
    fullName: string;
    email?: string | null;
    phone?: string | null;
    isPrimary: boolean;
}
