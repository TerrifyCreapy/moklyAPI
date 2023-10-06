import { Injectable } from '@nestjs/common';
import { InjectClient } from 'nest-postgres';
import { Client } from 'pg';
import * as bcrypt from "bcrypt";

import { IUser } from './entities/user.entity';
import { IGetAllUsers } from './entities/query.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectClient() private readonly pg: Client) {}

  public async findByEmail(email: string): Promise<IUser | null> {
    const queryString = `SELECT * FROM users where email='${email}'`;
    const query = (await this.pg.query(queryString)).rows;
    return query.length?query[0]:null;
  }

  public async findAll(page: number = 1, limit: number = 0): Promise<IGetAllUsers> {

    if(page < 1) page = 1;
    if(limit < 0) limit = 0;

    const queryString = `SELECT * FROM users order by email OFFSET ${(page-1) * limit}${limit > 0?`LIMIT ${limit}`:''}`;
    const queryCount = "SELECT count(*) from users";

    const totalCount: number = (await this.pg.query<number>(queryCount)).rows[0].count;
    const users = await this.pg.query<IUser[]>(queryString);

    return {rows: users.rows, count: totalCount};
  }

  public async createUser(user: CreateUserDto): Promise<IUser | string> {
    
    let {email, password} = user;

    const exists = this.findByEmail(email);

    if(exists) return "User already exists";


    
    const saultCount = 10;
    password = await bcrypt.hash(password, saultCount);


    const token = "awdfawdf";
    const queryString = "INSERT INTO users(email, password, refresh) values($1, $2, $3) RETURNING *";

    const userDB: IUser = (await this.pg.query(queryString, [email, password, token])).rows[0];


    return userDB;
  }

}
