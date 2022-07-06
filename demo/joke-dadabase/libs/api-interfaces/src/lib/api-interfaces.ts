export interface Joke {
  id: number;
  joke: string;
  category: string;
}

export interface JokeResponse {
  total: number;
  result: Joke[];
}

export interface PagedQuery {
  pageIndex: number;
  pageSize: number;
  searchTerm?: string;
  category?: string;
}
