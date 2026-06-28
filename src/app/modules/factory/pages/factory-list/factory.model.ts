export interface Factory {
    id: number;
    name: string;
    location: string;
    status: string;
    employeeCount: number;
    establishedYear: number;
    verified: boolean;
}

export interface Region {
    name: string;
    code: string;
}

export interface FactoryStatus {
    label: string;
    value: string;
}