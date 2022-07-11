import { Observable, Subject, BehaviorSubject, ReplaySubject, interval } from 'rxjs';
import { map, filter } from 'rxjs/operators';

const observable$ = new Observable(subscriber => {
  subscriber.next(1);
  subscriber.next(2);
  // setTimeout(() => {
  //   subscriber.next(2.5);
  // }, 1000);
  subscriber.next(3);
});

observable$.subscribe(value => console.log('A', value));

const observer = {
  next: value => console.log('B', value),
  error: error => console.error(error),
  complete: () => console.log('complete'),
};

observable$.subscribe(observer);

const subject = new Subject();
// const subject = new BehaviorSubject();
// const subject = new ReplaySubject();
subject.subscribe(observer);

subject.next(10);
subject.next(20);
subject.next(30);

subject.subscribe(x => console.log('C', x));

subject.next(40);


const ticker = interval(500);
// const subscription = ticker.subscribe(observer);
const subscription = ticker.subscribe(subject);

setTimeout(() => {
  subscription.unsubscribe();
}, 5000);

const squares$ = subject.pipe(
  map(x => x * x),
  filter(x => x > 20)
);

squares$.subscribe(x=> console.log('D', x));
