import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { toastService } from './toast.service';
import { storageService } from './storage.service';

interface ApiServiceResponse<T> {
    data: T;
    status: number;
}

// Function to retrieve the token from local storage
function getToken(): string {
    const token = localStorage.getItem('TOKEN_TASKIFY') || '';
    return token.replace(/^"|"$/g, ''); // This regex replaces quotes at the start and end of the string
}

function getTokenResturant(): string {
    const token = localStorage.getItem('TOKEN_RESTURANT') || '';
    return token.replace(/^"|"$/g, ''); // This regex replaces quotes at the start and end of the string
}
// Handle errors in a centralized function
function handleError(error: any): never {
    const status = error.response ? error.response.status : null;
    const message = error.response ? error.response.data : "An unknown error occurred";
    const url = error.request ? error.request.
        responseURL : "Unknown URL";
    console.log("error", error)
    switch (status) {
        case 400:
            console.error("Bad Request:", message);
            // toastService.showToast("Bad Request", message)
            break;
        case 401:
            if (url !== "https://app01.ms.lan-wan.net/auth/login") {
                storageService.remove('fullName_TASKIFY');
                storageService.remove('fullName_TASKIFY', true);
                storageService.remove('TOKEN_TASKIFY');
                storageService.remove('TOKEN_TASKIFY', true);
                window.location.href = '/'; // Redirect to login page
            }

            break;
        case 403:
            console.error("Forbidden:", message);
            break;
        case 404:
            console.error("Not Found:", message);
            break;
        case 500:
            console.error("Internal Server Error:", message);
            break;
        default:
            console.error("API request error:", message);
            break;
    }

    throw error.response ? error.response.data : error;
}

// Include token in headers for each request
function getRequestHeaders(additionalHeaders = {}): AxiosRequestConfig {
    const token = getToken();
    // console.log("getRequestHeaders")

    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            ...additionalHeaders
        }
    };
}

function getRequestHeadersResturant(additionalHeaders = {}): AxiosRequestConfig {
    // console.log("getRequestHeadersResturant")
    const token = getTokenResturant();
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            ...additionalHeaders
        }
    };
}

// GET request function
export async function getRequest<T>(url: string, headers = {}): Promise<ApiServiceResponse<T>> {
    try {
        const config = url.includes("voice-center") ? getRequestHeadersResturant(headers) : getRequestHeaders(headers);
        const response: AxiosResponse<T> = await axios.get(url, config);
        return { data: response.data, status: response.status };
    } catch (error) {
        handleError(error);
    }
}

// POST request function
export async function postRequest<T>(url: string, data: any, headers = {}): Promise<ApiServiceResponse<T>> {
    try {
        // console.log("postRequest")
        const config = url.includes("haat-insert-prod") ? getRequestHeadersResturant(headers) : getRequestHeaders(headers);

        // const config = getRequestHeaders(headers);
        const response: AxiosResponse<T> = await axios.post(url, data, config);
        return { data: response.data, status: response.status };
    } catch (error) {
        handleError(error);
    }
}

// PUT request function
export async function putRequest<T>(url: string, data: any, headers = {}): Promise<ApiServiceResponse<T>> {
    try {
        const config = getRequestHeaders(headers);
        const response: AxiosResponse<T> = await axios.put(url, data, config);
        return { data: response.data, status: response.status };
    } catch (error) {
        handleError(error);
    }
}

// DELETE request function
export async function deleteRequest<T>(url: string, headers = {}): Promise<ApiServiceResponse<T>> {
    try {
        const config = getRequestHeaders(headers);
        const response: AxiosResponse<T> = await axios.delete(url, config);
        return { data: response.data, status: response.status };
    } catch (error) {
        handleError(error);
    }
}
