export interface UpdateUserRequest {
    firstName: string;
    lastName: string;
    phoneNumber?: string | null;
    departmentId?: string | null;
    managerId?: string | null;
    roleIds: string[];
    isActive: boolean;
}
