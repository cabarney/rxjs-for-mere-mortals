import { Component, OnDestroy, OnInit } from '@angular/core';
import { PagedQuery } from '@joke-dadabase/api-interfaces';
import { fromEvent, Subscription } from 'rxjs';
import { filter, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { JokeService } from '../joke.service';

@Component({
  selector: 'joke-dadabase-jokes',
  templateUrl: './jokes.component.html',
  styleUrls: ['./jokes.component.scss']
})
export class JokesComponent implements OnInit, OnDestroy {
  jokes$ = this.service.jokes$;
  total$ = this.service.totalJokes$;
  query: PagedQuery = { pageIndex: 0, pageSize: 10, category: '', searchTerm: '' };
  subscription: Subscription | undefined;
  constructor(private service: JokeService) { }
  ngOnInit(): void {
    const searchBox = document.getElementById('search-box') as HTMLInputElement;
    this.subscription = fromEvent(searchBox, 'input').pipe(
      map(e => (e.target as HTMLInputElement).value),
      filter(value => !value || value.length > 2),
      debounceTime(400),
      distinctUntilChanged(),
      map(searchTerm => ({ ...this.query, searchTerm } as PagedQuery)),
    ).subscribe(query => this.service.getJokes(query));
    this.service.getJokes({ pageIndex: 0, pageSize: 10, category: '', searchTerm: '' });
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
