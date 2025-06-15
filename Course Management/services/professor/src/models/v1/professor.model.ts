import { RowDataPacket } from 'mysql2';

export interface Professor extends RowDataPacket {
    tax_code: string;
    first_name: string;
    last_name: string;
    birth_date?: Date;
    birth_place?: string;
    phone_id?: string;
    created_at?: Date;
    updated_at: Date;
}
