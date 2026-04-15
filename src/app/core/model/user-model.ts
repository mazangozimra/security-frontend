import { DepartmentModel } from "./department-model";

export interface UserModel {
    id: string;
    email: string;
    username: string;
    phone: string;
    departmentId: number;
    firstName: string;
    lastName: string;
    lastLoginDate?: string;
    passwordExpired?: boolean;
    department: DepartmentModel;
    active?: boolean;
}
