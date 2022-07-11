import { Injectable, NotFoundException } from '@nestjs/common';
import { Joke, JokeResponse, PagedQuery } from '@joke-dadabase/api-interfaces';
import { from, Observable, of } from 'rxjs';
import { delay, filter, map, tap, take, toArray } from 'rxjs/operators';

import * as data from '../data/dadjokes.json';
import { buffer } from 'stream/consumers';

@Injectable()
export class AppService {
  getJokes(query: PagedQuery): Observable<JokeResponse> {
    return of(data as Joke[]).pipe(
      map(jokes => query.category ? jokes.filter(joke => joke.category.toLowerCase() === query.category?.toLowerCase()) : jokes),
      map(jokes => query.searchTerm ? jokes.filter(joke => joke.joke.toLowerCase().includes(query.searchTerm?.toLowerCase() ?? '')) : jokes),
      map(jokes => ({ total: jokes.length, result: jokes}) as JokeResponse),
      tap(response => response.result = response.result.slice(query.pageIndex * query.pageSize, (query.pageIndex + 1) * query.pageSize)),
      delay(1000),
    );
  }

  getJoke(id: number): Observable<Joke> {
    const joke = data.find((x: Joke) => x.id === id);

    if (!joke) {
      throw new NotFoundException('Joke not found');
    }

    return of(joke).pipe(delay(300));
  }

  getRelatedJokes(id: number): Observable<Joke[]> {
    const joke = data.find((x: Joke) => x.id === id);
    if(!joke) return of([]);

    return from(data).pipe(
      filter(item => item.category === joke.category),
      take(5),
      toArray(),
      delay(300),
    );
  }
}
