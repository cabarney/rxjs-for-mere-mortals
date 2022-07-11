import { Joke, JokeResponse, PagedQuery } from '@joke-dadabase/api-interfaces';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { Observable } from 'rxjs';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('jokes')
  getData(@Query() query: PagedQuery): Observable<JokeResponse> {
    return this.appService.getJokes(query);
  }

  @Get('joke/:id')
  getJoke(@Param('id') id: number): Observable<Joke> {
    return this.appService.getJoke(+id);
  }

  @Get('joke/:id/related')
  getRelatedJokes(@Param('id') id: number): Observable<Joke[]> {
    return this.appService.getRelatedJokes(+id);
  }
}
