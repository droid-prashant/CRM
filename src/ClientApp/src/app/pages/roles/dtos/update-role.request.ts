export interface UpdateRoleRequest {
    name: string;
    code?: string | null;
    description: string;
    isActive: boolean;
}
