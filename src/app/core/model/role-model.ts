import { SystemModel } from "./system-model";

export interface RoleModel {
    id?: number;
    name: string;
    system: SystemModel;
}
