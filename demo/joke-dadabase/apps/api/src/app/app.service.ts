import { Injectable, NotFoundException } from '@nestjs/common';
import { Joke, JokeResponse, PagedQuery } from '@joke-dadabase/api-interfaces';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import * as data from '../data/dadjokes.json';

@Injectable()
export class AppService {
  getJokes(query: PagedQuery): Observable<JokeResponse> {
    return of(data as Joke[]).pipe(
      map(jokes => query.category ? jokes.filter(joke => joke.category.toLowerCase() === query.category?.toLowerCase()) : jokes),
      map(jokes => query.searchTerm ? jokes.filter(joke => joke.joke.toLowerCase().includes(query.searchTerm?.toLowerCase() ?? '')) : jokes),
      map(jokes => ({ total: jokes.length, result: jokes}) as JokeResponse),
      tap(response => response.result = response.result.slice(query.pageIndex * query.pageSize, (query.pageIndex + 1) * query.pageSize)),
    );
  }

  getJoke(id: number): Joke {
    const joke = data.find((x: Joke) => x.id === id);

    if (!joke) {
      throw new NotFoundException('Joke not found');
    }

    return joke;
  }

  getRelatedJokes(id: number): Joke[] {
    const joke = this.getJoke(id);

    return data.filter((x: Joke) => x.category.toLowerCase() === joke.category.toLowerCase()).slice(5);
  }
}
