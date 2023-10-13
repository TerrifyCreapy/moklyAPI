import { CreateProjectDto } from './create-project.dto';
declare const UpdateProjectDto_base: import("@nestjs/common").Type<Partial<CreateProjectDto>>;
export declare class UpdateProjectDto extends UpdateProjectDto_base {
    auth: boolean;
    register: true;
    uploads: true;
}
export {};
