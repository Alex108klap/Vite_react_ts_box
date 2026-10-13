//  a = 6;
//  d= 6;
// console.log(a+d)
let arr = [
  { title: 'Капуста', id: 1 },
  { title: 'Чеснок', id: 2 },
  { title: 'Яблоко', id: 3 },
];

let newArr = arr.map(function (item) {
  return (item.title + '-' + "id=" + item.id)
})
console.log(newArr)
// let newArr = arr.map(item => ({
//   productId: item.id,
//   productName: item.title
// }))
//
// console.log(newArr)