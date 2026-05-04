export interface LoginRequest {
    usernameOrEmail: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    expiration: string;
    userId: string;
    fullName: string;
    roles: string[];
    permissions: string[];
    succeded: boolean;
    error?: string;
    statusCode: number;
}

export interface AuthUser {
    userId: string;
    fullName: string;
    roles: string[];
    permissions: string[];
    expiration: string;
}
