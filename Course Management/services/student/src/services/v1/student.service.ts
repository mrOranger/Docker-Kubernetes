import { Student } from 'models';
import { Observable } from 'rxjs';

import { database } from '../../database';
import { StudentRepository } from 'services/student-repository.interface';

export class StudentService implements StudentRepository {
    public index(): Observable<Student[]> {
        return new Observable<Student[]>((subscriber) => {
            database
                .query<Student[]>(`CALL select_students()`)
                .then(([rows, _]) => subscriber.next(rows))
                .catch(subscriber.error);
        });
    }

    public find(identifier: string): Observable<Student> {
        return new Observable<Student>((subscriber) => {
            database
                .query<Student[]>(`CALL select_student(?)`, [identifier])
                .then(([rows, _]) => subscriber.next(rows[0]))
                .catch(subscriber.error);
        });
    }

    public save(value: Student): Observable<Student> {
        return new Observable<Student>((subscriber) => {
            const { first_name, last_name, tax_code } = value;
            database
                .query(`CALL insert_student(?, ?, ?)`, [
                    tax_code,
                    first_name,
                    last_name,
                ])
                .then(() => subscriber.next(value))
                .catch(subscriber.error);
        });
    }

    public update(identifier: string, value: Student): Observable<Student> {
        return new Observable<Student>((subscriber) => {
            const { first_name, last_name } = value;
            database
                .query(`CALL update_student(?, ?, ?)`, [
                    identifier,
                    first_name,
                    last_name,
                ])
                .then(() => subscriber.next(value))
                .catch(subscriber.error);
        });
    }

    public delete(identifier: string): Observable<void> {
        return new Observable<void>((subscriber) => {
            database
                .query(`CALL delete_student(?)`, [identifier])
                .then(() => subscriber.next())
                .catch(subscriber.error);
        });
    }
}
