import { deleteMetadata } from "reflect-metadata/no-conflict";

export class User {
    constructor(
        public user_id: number,
        public nome: string,
        public email: string,
        public senha_hash: string,
        public created_at: Date,
        public tipo: string,
        public updated_at: Date,
        public deleteMetadata: Date,
    ){}
}