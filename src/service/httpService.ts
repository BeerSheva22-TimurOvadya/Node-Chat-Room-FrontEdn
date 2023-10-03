import { AUTH_DATA_JWT } from './AuthServiceJwt';

async function getResponseText(response: Response): Promise<string> {
    let res = '';
    if (!response.ok) {
        const { status } = response;
        res = status === 401 || status === 403 ? 'Authentication' : await response.text();
    }
    return res;
}


function getHeaders(): HeadersInit {
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem(AUTH_DATA_JWT) || ''}`,
    };
}

export async function fetchRequest<T>(url: string, options: RequestInit, body?: T): Promise<Response> {
    options.headers = getHeaders();
    if (body) {
        options.body = JSON.stringify(body);
    }    
    let responseText = '';
    try {
         const response = await fetch(url, options);
        responseText = await getResponseText(response);
        if (responseText) {
            throw responseText;
        }
        return response;
    } catch (error: any) {
        
        throw responseText ? responseText : 'Server is unavailable. Repeat later on';
    }
}

