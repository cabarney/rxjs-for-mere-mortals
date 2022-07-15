import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JokeResponse, PagedQuery } from '@joke-dadabase/api-interfaces';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap, share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JokeService {
  url = "http://localhost:3333/api";
  _querySubject: BehaviorSubject<PagedQuery> = new BehaviorSubject<PagedQuery>({ pageIndex: 0, pageSize: 10, category: '', searchTerm: '' });
  querySubject$ = this._querySubject.asObservable();
  constructor(private http: HttpClient) { }
  _loadJokes$ = this.querySubject$.pipe(
    switchMap(query => this.http.get<JokeResponse>(`${this.url}/jokes?${this.toQueryString(query)}`)),
    share()
  );
  public jokes$ = this._loadJokes$.pipe(map(response => response.result));
  public totalJokes$ = this._loadJokes$.pipe(map(response => response.total));
  public getJokes(query: PagedQuery) {
    this._querySubject.next(query);
  }
  toQueryString(query: PagedQuery) {
    return `pageIndex=${query.pageIndex}&pageSize=${query.pageSize}&category=${query.category}&searchTerm=${query.searchTerm}`;
  }
}
