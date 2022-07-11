import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, tap } from 'rxjs/operators';
import { PagedQuery } from '@joke-dadabase/api-interfaces';
import { JokeServiceComplete } from '../joke-complete.service';

@Component({
  selector: 'joke-dadabase-jokes-complete',
  templateUrl: './jokes-complete.component.html',
  styleUrls: ['./jokes-complete.component.scss'],
})
export class JokesCompleteComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  pageIndex$ = new BehaviorSubject(0);
  pageSize$ = new BehaviorSubject(25);
  category$ = new BehaviorSubject('');
  searchTerm$ = new BehaviorSubject('');
  pagedQuery$ = combineLatest([
    this.category$,
    this.searchTerm$,
    this.pageIndex$,
    this.pageSize$
  ]).pipe(
    map(([category, searchTerm, pageIndex, pageSize]) => ({
      category,
      searchTerm,
      pageIndex,
      pageSize
    }) as PagedQuery),
  );

  pageInfo$ = this.service.totalItems$.pipe(
    map(total => {
      const totalPages = Math.ceil(total/this.pageSize$.value);
      const pages = [];
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
      return {pages, totalPages, page: this.pageIndex$.value
      };
    }
  ));

  constructor(public service: JokeServiceComplete) { }

  ngOnInit() {
    const searchBox = document.getElementById('search-box') as HTMLInputElement;
    const category = document.getElementById('category') as HTMLInputElement;

    this.subscriptions.push(fromEvent(searchBox, 'input').pipe(
      map(event => (event.target as HTMLInputElement).value),
      filter(query => !query || query.length > 2),
      debounceTime(300),
      distinctUntilChanged(),
      tap(_ => this.pageIndex$.next(0)),
      ).subscribe(this.searchTerm$));

    this.subscriptions.push(fromEvent(category, 'change').pipe(
      map(event => (event.target as HTMLInputElement).value),
      distinctUntilChanged(),
      tap(_ => this.pageIndex$.next(0)),
    ).subscribe(this.category$));

    this.subscriptions.push(this.pagedQuery$.subscribe(query => this.service.loadJokes(query)));
  }

  onJokeSelect(id: number) {
    this.service.selectJoke(id);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
