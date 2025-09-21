function store(key: string, value: any, isSession: boolean = false): void {
    const storage = isSession ? sessionStorage : localStorage;
    storage.setItem(key, JSON.stringify(value));
}

function load<T = any>(key: string, defaultValue: T | null = null, isSession: boolean = false): T | null {
    const storage = isSession ? sessionStorage : localStorage;
    let value = storage.getItem(key) || JSON.stringify(defaultValue);
    return JSON.parse(value);
}

function remove(key: string, isSession: boolean = false): void {
    const storage = isSession ? sessionStorage : localStorage;
    storage.removeItem(key);
}

export const storageService = {
    store,
    load,
    remove,
};
