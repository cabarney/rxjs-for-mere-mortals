const items = [
  { name: 'Apple', rating: 3.5 },
  { name: 'Orange', rating: 4.2 },
  { name: 'Banana', rating: 3.9 },
  { name: 'Pear', rating: 2.8 },
  { name: 'Grape', rating: 4.9 },
];

items.map(item => item.name).forEach(name => {
  console.log(name);
});

const bestItems = items.filter(item => item.rating >= 4.0);
console.log(bestItems);

const apple = items.find(item => item.name === 'Apple');
console.log(apple);
