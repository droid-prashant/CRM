export interface CreateUserRequest {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    roleIds: string[];
    password?: string;
    generatePassword: boolean;
}
