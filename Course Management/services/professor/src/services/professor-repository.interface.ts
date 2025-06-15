import { CRUDRepository } from './crud-repository.interface';

import { Contact, Professor } from 'models';

export interface ProfessorRepository
    extends CRUDRepository<
        Professor & { contact: Contact },
        Professor['tax_code']
    > {}
