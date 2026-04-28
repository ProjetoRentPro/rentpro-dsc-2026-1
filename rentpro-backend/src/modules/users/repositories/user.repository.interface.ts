import {User} from "../entities/user.entity";

export interface IUserRepository {
    create(user: User): Promise<User>;
    findById(user_id: number): Promise<User | null>;
    findAll(): Promise<User[]>;
    update(user: User): Promise<User>;
    delete(user_id: number): Promise<void>;
}