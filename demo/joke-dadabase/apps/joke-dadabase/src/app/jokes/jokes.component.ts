import { Component, OnInit } from '@angular/core';
import { Joke, JokeResponse } from '@joke-dadabase/api-interfaces';
import { JokeService } from '../joke.service';

@Component({
  selector: 'joke-dadabase-jokes',
  templateUrl: './jokes.component.html',
  styleUrls: ['./jokes.component.scss']
})
export class JokesComponent implements OnInit {
  jokes: Joke[] = [];

  constructor(private service: JokeService) { }

  ngOnInit(): void {
    this.service.getJokes({ pageIndex: 0, pageSize: 10, category: '', searchTerm: '' })
      .subscribe((jokes: JokeResponse) => this.jokes = jokes.result);
  }
}
