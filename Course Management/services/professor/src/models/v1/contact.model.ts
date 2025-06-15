import { RowDataPacket } from 'mysql2';

export interface Contact extends RowDataPacket {
    id: string;
    contact_prefix: string;
    contact_number: string;
    contact_type: string;
}
