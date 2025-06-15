import { Observable } from 'rxjs';

export interface CRUDRepository<T, I extends T[keyof T]> {
    index(): Observable<Array<T>>;
    find(identifier: I): Observable<T>;
    save(value: T): Observable<T>;
    update(identifier: I, value: T): Observable<T>;
    delete(identifier: I): Observable<void>;
}
