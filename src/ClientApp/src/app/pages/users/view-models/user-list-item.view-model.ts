export interface UserListItemViewModel {
    id: string;
    fullName: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    roles: string[];
    roleIds: string[];
    rolesDisplay: string;
    phoneNumber?: string;
    departmentId?: string;
    managerId?: string;
    isActive: boolean;
}
