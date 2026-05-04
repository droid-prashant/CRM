export interface CreateRoleRequest {
    name: string;
    code?: string | null;
    description: string;
    isSystemRole: boolean;
    isActive: boolean;
}
