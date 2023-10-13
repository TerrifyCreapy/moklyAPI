"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
const nest_postgres_1 = require("nest-postgres");
const uid = require("uuid");
let ProjectService = class ProjectService {
    constructor(pg) {
        this.pg = pg;
    }
    async findAll(email) {
        const query = `SELECT * FROM projects where "userEmail"='${email}'`;
        const result = await this.pg.query(query);
        return {
            rows: result.rows,
            count: result.rows.length,
        };
    }
    async findOne(link) {
        const query = `SELECT * FROM projects where "link"='${link}'`;
        const result = await this.pg.query(query);
        if (!result.rows.length)
            throw new common_1.BadRequestException("Unknown link");
        return Object.assign({}, result.rows[0]);
    }
    async create(createProjectDto, email) {
        const { name, description } = createProjectDto;
        const link = uid.v4();
        const query = `INSERT INTO projects(link, name, description, "useremail") VALUES($1, $2, $3, $4) RETURNING link, name, description, auth, register, uploads`;
        const result = (await this.pg.query(query, [link, name, description, email])).rows[0];
        return Object.assign({}, result);
    }
    async update(link, updateProjectDto) {
        const { name, description, auth, register, uploads } = updateProjectDto;
        const query = `UPDATE projects SET name='${name}', description='${description}', auth='${auth}', register='${register}', uploads='${uploads}' where link='${link}' RETURNING link, name, description, auth, register, uploads`;
        const result = (await this.pg.query(query)).rows[0];
        return Object.assign({}, result);
    }
    async remove(link) {
        const query = `DELETE FROM projects WHERE link='${link}'`;
        const result = (await this.pg.query(query)).rowCount;
        if (!result)
            throw new common_1.BadRequestException("Unknown link");
        return Boolean(result);
    }
};
ProjectService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nest_postgres_1.InjectClient)()),
    __metadata("design:paramtypes", [typeof (_a = typeof pg_1.Client !== "undefined" && pg_1.Client) === "function" ? _a : Object])
], ProjectService);
exports.ProjectService = ProjectService;
//# sourceMappingURL=project.service.js.map