import { Observable, Subject, BehaviorSubject, ReplaySubject, interval, from } from 'rxjs';
import { map, filter, take, concatAll, mergeAll, exhaustAll } from 'rxjs/operators';

function demo1() {
  console.log('DEMO 1: Basic observable and subscriber - everything is synchronous');
  console.log('    A second subscriber executes after the first completes')
  const observable$ = new Observable(subscriber => {
    subscriber.next(1);
    subscriber.next(2);
    subscriber.next(3);
  });
  
  observable$.subscribe(value => console.log('A', value));
  // observable$.subscribe(value => console.log('B', value));
}

function demo2() {
  console.log("DEMO 2: Same as demo 1, but with an asynchronous value");
  console.log("    What happens when we add a second subscriber?")
  const observable$ = new Observable((subscriber) => {
    subscriber.next(1);
    subscriber.next(2);
    subscriber.next(3);
    setTimeout(() => {
      subscriber.next(4);
    }, 1000);
  });

  observable$.subscribe((value) => console.log('A', value));  
  // observable$.subscribe((value) => console.log('B', value));  
}

function demo3() {
  console.log('DEMO 3: Using an Observer in the subscription. Complete finishes a sequence before the async value');
  console.log('    Calling error will also cause the sequence to finish');
  const observable$ = new Observable((subscriber) => {
    subscriber.next(1);
    subscriber.next(2);
    subscriber.next(3);
    setTimeout(() => {
      subscriber.next(4);
    }, 1000);
    // subscriber.error('Whoops!');
    subscriber.complete();
  });

  const observer = {
    next: value => console.log('next', value),
    error: error => console.error('error', error),
    complete: () => console.log('complete'),
  };

  observable$.subscribe(observer);
}

function demo4() {
  console.log('DEMO 4: Using a basic Subject');
  console.log('    Observer B only gets values the subject receives after B subscribes');
  const subject = new Subject();

  const observer = {
    next: (value) => console.log("A", value)
  };

  subject.subscribe(observer);

  subject.next(1);
  subject.next(2);

  subject.subscribe(value => console.log("B", value));

  subject.next(3);
  subject.next(4);
}

function demo5() {
  console.log("DEMO 5: BehaviorSubject");
  console.log("    When B subscribes, it will get the most recent value from the Subject");
  const subject = new BehaviorSubject(0);

  subject.subscribe((value) => console.log("A", value));

  subject.next(1);
  subject.next(2);

  subject.subscribe((value) => console.log("B", value));

  subject.next(3);
  subject.next(4);
}

function demo6() {
  console.log("DEMO 6: ReplaySubject");
  console.log("    When B subscribes, it will get all values the subject has received so far");
  const subject = new ReplaySubject();

  subject.subscribe((value) => console.log("A", value));

  subject.next(1);
  subject.next(2);

  subject.subscribe((value) => console.log("B", value));

  subject.next(3);
  subject.next(4);
}

function demo7() {
  console.log("DEMO 7: Not unsubscribing from an observable will allow it to keep running");
  console.log("    Always make sure to unsubscribe!");
  const ticker = interval(500);
  
  const subscription = ticker.subscribe(value => console.log(value));
  // setTimeout(() => {
    //   subscription.unsubscribe();
    // }, 5000);
  }
  
function demo8() {
  console.log("DEMO 8: Subjects are Observables AND Observers");
  console.log("    They emit values like an Observable and can also subscribe to other Observables");
  const observable = from([1, 2, 3, 4, 5]);
  const subject = new Subject();
  subject.subscribe((value) => console.log(value));  
  observable.subscribe(subject);
}

function demo9() {
  console.log("DEMO 9: Operators transform Observables");
  console.log("    Values are piped through operators to create new Observables");

  const observable = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const subject = new Subject();
  
  subject.subscribe((value) => console.log("A", value));
  subject.pipe(
      filter((value) => value % 2 === 0),
      map((value) => Math.pow(value, 2))
    ).subscribe((value) => console.log("B", value));

  observable.subscribe(subject);
}

function demo10() {
  console.log("DEMO 10: Observables of Observables are called Higher Order Observables");
  console.log("    Operators like concatAll, mergeAll and exhaustAll can 'flatten' them");
  const observable = interval(500).pipe(take(5));
  const subject = new Subject();
  observable.subscribe(subject);
  const higherOrder = subject.pipe(
      map((value) => interval(300).pipe(take(5), map(x => ' '.repeat(value * 5) + x)))
    );
  const firstOrder = higherOrder.pipe(concatAll());
  // const firstOrder = higherOrder.pipe(mergeAll());
  // const firstOrder = higherOrder.pipe(exhaustAll());
    
  firstOrder.subscribe((value) => console.log(value));
}


const demoFunctions = { demo1, demo2, demo3, demo4, demo5, demo6, demo7, demo8, demo9, demo10 };
const demo = 'demo' + process.argv[2];
demoFunctions[demo]();
