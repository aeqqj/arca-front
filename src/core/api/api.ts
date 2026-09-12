const BASE_URL = import.meta.env.VITE_API_URL;

function getStoredTokens() {
    return {
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
    };
}

function storeTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
}

function clearTokens() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
}

async function tryRefreshToken() {
    const { refreshToken } = getStoredTokens();
    if (!refreshToken) return false;

    try {
        const response = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({refreshToken}),
        });

        if (!response.ok) return false;
        
        const data = await response.json();
        storeTokens(data.accessToken, data.refreshToken);
        return true;
    } catch {
        return false;
    }
}

async function request<T>(path: string, options: RequestInit ={}): Promise<T> {
    const { accessToken } = getStoredTokens(); 

    const headers: Record<string, string> = {
        "Content-Type": "application/json"
    }

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${BASE_URL}${path}`, {...options, headers });

    if (response.status === 401) {
        const refreshed = await tryRefreshToken();
        if (refreshed) {
            return request<T>(path, options);
        }
        clearTokens();
        window.location.href = "/auth/signin";
        throw new Error("Session Expired");
    }

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message ?? `Request Failed: ${response.status}`);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json();
}

export const api = {
    get: <T>(path: string) => request<T>(path, { method: "GET" }),
    post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
    put: <T>(path: string, body?: unknown) => request<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
    delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),

}
