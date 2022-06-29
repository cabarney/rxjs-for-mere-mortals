import { Injectable } from '@nestjs/common';
import { Joke, JokeResponse, PagedQuery } from '@joke-dadabase/api-interfaces';

import * as data from '../data/dadjokes.json';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AppService {
  getJokes(query: PagedQuery): Observable<JokeResponse> {
    return of(data as Joke[]).pipe(
      map((jokes) => ({ total: jokes.length, result: jokes}) as JokeResponse),
    );
  }
}
