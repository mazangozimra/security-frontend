export interface ApiResponse<T = any> {
    id: number;
    name: string;
    description: string;
    status: string;
    data?: [any];
}
