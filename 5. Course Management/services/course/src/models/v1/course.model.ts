import { RowDataPacket } from 'mysql2';

export interface Course extends RowDataPacket {
    code: string;
    course_name: string;
    course_description?: string;
    created_at: Date;
    updated_at?: Date;
}
