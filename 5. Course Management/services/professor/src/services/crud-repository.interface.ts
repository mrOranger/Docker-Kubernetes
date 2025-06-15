import { Observable } from 'rxjs';

export interface CRUDRepository<T, I extends T[keyof T]> {
    index(): Observable<Array<T>>;
    find(identifier: I): Observable<T>;
}
