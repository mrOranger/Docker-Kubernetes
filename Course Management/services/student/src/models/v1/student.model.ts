export interface Student {
    tax_code: string;
    first_name: string;
    last_name: string;
    birth_date?: Date;
    birth_place?: string;
    gender?: boolean;
    created_at: Date;
    updated_at?: Date;
}
