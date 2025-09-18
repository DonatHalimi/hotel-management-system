export const getToken = (): string | null => {
    return localStorage.getItem('accessToken');
};

function normalizeBase64(input: string) {
    let str = input.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4 !== 0) str += '=';
    return str;
}

function b64DecodeUnicode(str: string) {
    try {
        const binary = atob(str);
        const percentEncoded = Array.prototype.map
            .call(binary, (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('');
        return decodeURIComponent(percentEncoded);
    } catch {
        try { return atob(str); } catch { return null; }
    }
}

export const decodeJwt = (token: string | null | undefined): any | null => {
    if (!token) return null;
    try {
        const parts = token.split('.');
        if (parts.length < 2) return null;
        const payloadRaw = normalizeBase64(parts[1]);
        const payloadDecoded = b64DecodeUnicode(payloadRaw);
        if (!payloadDecoded) return null;
        return JSON.parse(payloadDecoded);
    } catch {
        return null;
    }
};

/**
 * Returns the user's role string (first found) or undefined.
 * First checks the Microsoft role claim URI provided, then falls back to common keys.
 */
export const getRoleFromToken = (token?: string): string | undefined => {
    const tok = token ?? getToken();
    if (!tok) return undefined;
    const payload = decodeJwt(tok);
    if (!payload) return undefined;

    const msRoleKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
    const xmlRoleKey = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role';

    const tryKeys = [
        msRoleKey,
        xmlRoleKey,
        'role',
        'roles',
        'Role'
    ];

    for (const k of tryKeys) {
        const v = payload[k];
        if (v === undefined || v === null) continue;
        if (Array.isArray(v) && v.length > 0) return String(v[0]);
        return String(v);
    }

    // sometimes roles are inside a "claims" array
    if (Array.isArray(payload.claims)) {
        const claim = payload.claims.find((c: any) => (c.type || '').toLowerCase().includes('role'));
        if (claim?.value) return String(claim.value);
    }

    return undefined;
};

/**
 * Returns the user identifier (nameidentifier claim) if present.
 * Example key from your JWT: http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier
 */
export const getUserIdFromToken = (token?: string): string | undefined => {
    const tok = token ?? getToken();
    if (!tok) return undefined;
    const payload = decodeJwt(tok);
    if (!payload) return undefined;

    const nameIdKeys = [
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
        'sub',
        'nameid',
    ];

    for (const k of nameIdKeys) {
        const v = payload[k];
        if (v) return String(v);
    }

    return undefined;
};

export const isAuthenticated = (): boolean => {
    const tok = getToken();
    if (!tok) return false;
    return !!decodeJwt(tok);
};

/**
 * hasRole(allowed)
 * - allowed: string | string[] | undefined
 * - semantics: if allowed is falsy => returns true (no role restriction).
 * - if allowed provided, returns true if the token contains a role that matches one of allowed (case-insensitive).
 */
export const hasRole = (allowed?: string | string[]): boolean => {
    if (!allowed) return true;
    const allowedArr = Array.isArray(allowed) ? allowed : [allowed];

    const tok = getToken();
    if (!tok) return false;

    const role = getRoleFromToken(tok);
    if (!role) return false;
    return allowedArr.some(a => String(a).toLowerCase() === role.toLowerCase());
};
