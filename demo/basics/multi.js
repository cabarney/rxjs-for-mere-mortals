import { interval } from 'rxjs';
import { combineLatestWith, mergeAll, concatAll, map, take } from 'rxjs/operators';

const int1 = interval(200);
const int2 = interval(200);
const sub = int1.pipe(map(() => interval(100).pipe(take(4))))
  .pipe(mergeAll())
  .subscribe(x => console.log(x));
// const sub = int2.pipe(mergeAll(int1)).subscribe(x => console.log(x));

setTimeout(() => {
  sub.unsubscribe();
}, 5000);