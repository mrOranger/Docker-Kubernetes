import { Student } from "models";

import { CRUDRepository } from "./crud-repository.interface";

export interface StudentRepository extends CRUDRepository<Student, Student['tax_code']>{}
