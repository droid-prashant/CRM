import { environment } from 'src/environments/environment';

const apiPath = '/api';

export function apiUrl(path: string): string {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const baseUrl = environment.apiUrl?.trim() || apiPath;

    return `${baseUrl.replace(/\/$/, '')}${normalizedPath}`;
}

export function isApiUrl(url: string): boolean {
    const configuredBaseUrl = environment.apiUrl?.trim();

    if (configuredBaseUrl) {
        return url.startsWith(configuredBaseUrl);
    }

    return url.startsWith(`${apiPath}/`);
}
