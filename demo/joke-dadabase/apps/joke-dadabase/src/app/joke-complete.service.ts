import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Joke, JokeResponse, PagedQuery } from '@joke-dadabase/api-interfaces';
import { BehaviorSubject,forkJoin, of, Subject } from 'rxjs';
import { map, mergeMap, tap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JokeServiceComplete {
  url = "http://localhost:3333/api";
  selectedJokeId$ = new Subject<number>();
  _loading = new BehaviorSubject(false);
  loading$ = this._loading.asObservable();
  _detailLoading = new BehaviorSubject(false);
  detailLoading$ = this._detailLoading.asObservable();
  totalItems$ = new BehaviorSubject<number>(0);
  query$ = new BehaviorSubject<PagedQuery>({ pageIndex: 0, pageSize: 25, category: '', searchTerm: '' });

  jokes$ = this.query$.asObservable().pipe(
    tap(_ => this._loading.next(true)),
    switchMap(query => this.http.get<JokeResponse>(`${this.url}/jokes?${this.toQueryString(query)}`)),
    tap(response => this.totalItems$.next(response.total)),
    map(response => response.result),
    tap(_ => this._loading.next(false)),
  );

  jokeDetail$ = this.selectedJokeId$.asObservable().pipe(
    tap(() => this._detailLoading.next(true)),
    switchMap(id => this.http.get<Joke>(`${this.url}/joke/${id}`)),
    map(joke => forkJoin([
      of(joke),
      this.http.get<Joke[]>(`${this.url}/joke/${joke.id}/related`)
    ])),
    mergeMap(forkJoin => forkJoin),
    map(([joke, related]) => ({ ...joke, related } as JokeDetail)),
    tap(() => this._detailLoading.next(false)),
  );

  constructor(private http: HttpClient) { }

  loadJokes(query: PagedQuery) {
    this.query$.next(query);
  }

  selectJoke(id: number) {
    this.selectedJokeId$.next(id);
  }

  toQueryString(query: PagedQuery) {
    return `pageIndex=${query.pageIndex}&pageSize=${query.pageSize}&category=${query.category}&searchTerm=${query.searchTerm}`;
  }
}

interface JokeDetail extends Joke {
  related: Joke[];
}
