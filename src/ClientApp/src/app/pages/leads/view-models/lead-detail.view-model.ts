export interface LeadDetailViewModel {
    id: string;
    leadNumber: string;
    companyName: string;
    contactPersonName: string;
    hasDuplicateWarning: boolean;
    duplicateWarning?: string;
}
