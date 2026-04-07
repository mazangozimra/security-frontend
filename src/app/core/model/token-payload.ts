export interface TokenPayload {
    //username?: string;
    sub?: string;
    iat?: number;
    claims?:string[];
    systemId?: string;
    systemName?:string;
    roles?: string[];
    exp?: number;
}
