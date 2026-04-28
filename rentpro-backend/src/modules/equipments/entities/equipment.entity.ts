export class Equipment {
    constructor(
        public equipamento_id: number,
        public nome: string,
        public proprietario_id: number,
        public descricao: string,
        public categoria: string,
        public preco_diaria: number,
        public status: boolean,
        public created_at: Date,
        public updated_at: Date
    ) {}
}