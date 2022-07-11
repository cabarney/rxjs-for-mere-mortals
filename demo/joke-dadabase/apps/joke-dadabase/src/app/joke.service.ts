import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Joke, JokeResponse, PagedQuery } from '@joke-dadabase/api-interfaces';
import { BehaviorSubject,forkJoin, of, Subject } from 'rxjs';
import { map, mergeMap, tap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JokeService {
  url = "http://localhost:3333/api";

}
