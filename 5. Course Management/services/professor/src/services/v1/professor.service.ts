import { Contact, Professor } from 'models';
import { Observable } from 'rxjs';

import { database } from '../../database';
import { ProfessorRepository } from 'services/professor-repository.interface';

export class ProfessorService implements ProfessorRepository {
    public index(): Observable<Array<Professor & { contact: Contact }>> {
        return new Observable<Array<Professor & { contact: Contact }>>(
            (subscriber) => {
                database
                    .query<Array<Professor & { contact: Contact }>>(
                        `CALL select_professors()`
                    )
                    .then(([rows, _]) => subscriber.next(rows))
                    .catch(subscriber.error);
            }
        );
    }

    public find(
        identifier: string
    ): Observable<Professor & { contact: Contact }> {
        return new Observable<Professor & { contact: Contact }>(
            (subscriber) => {
                database
                    .query<Array<Professor & { contact: Contact }>>(
                        `CALL select_professor(?)`,
                        [identifier]
                    )
                    .then(([rows, _]) => subscriber.next(rows[0]))
                    .catch(subscriber.error);
            }
        );
    }
}
