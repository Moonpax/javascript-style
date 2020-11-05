// Airbnb JavaScript Style Guide()
// * https://github.com/airbnb/javascript

// Руководство по стилю JavaScript от Airbnb не рекомендует использовать итераторы.
// Вместо циклов for-in и for-of следует использовать функции высшего порядка,
// такие как map(), every(), filter(), find(), findIndex(), reduce(), some() для итерации
// по массивам и Object.keys(), Object.values(), Object.entries()
// для итерации по массивам из объектов

// * https://github.com/airbnb/javascript#iterators-and-generators


// Google JavaScript Style Guide
// * https://google.github.io/styleguide/jsguide.html

// Руководство по стилю JavaScript от Goggle советует отдавать
// предпочтение циклу for-of там, где это возможно.
// * https://google.github.io/styleguide/jsguide.html#features-for-loops

const users = ['John', 'Jane', 'Bob', 'Alice']

// вспомогательная функция
log = value => console.log(value)

// for
for (let i = 0; i < users.length; i++) {
  log(users[i]) // John Jane Bob Alice
}

// for-in
for (const item in users) {
  log(users[item])
}

// for-of
for (const item of users) {
  log(item)
}

// forEach()
users.forEach(item => log(item))

// map()
// побочный эффект - возвращает новый массив
// поэтому в данном случае лучше использовать forEach()
users.map(item => log(item))

// ##########################

const person = {
  name: 'John',
  age: 30,
  job: 'developer',
}

// for
for (let i = 0; i < Object.keys(person).length; i++) {
  log(Object.values(person)[i]) // John 30 developer
}

// for-in
for (const i in person) {
  log(person[i])
}

// for-of & Object.values()
for (const i of Object.values(person)) {
  log(i)
}

// Object.keys() & forEach()
Object.keys(person).forEach(i => log(person[i]))

// Object.values() & forEach()
Object.values(person).forEach(i => log(i))

// Object.entries() & forEach()
Object.entries(person).forEach(i => log(i[1]))

// * https://learn.javascript.ru/iterable
// Перебираемые (или итерируемые) объекты
// – это концепция, которая позволяет использовать любой объект в цикле for..of.
// for (const value of person) {
//   log(value) // TypeError: person is not iterable
// }

// имеется такой объект
const range = {
  from: 1,
  to: 5,
}

// * https://learn.javascript.ru/iterable
// добавляем ему свойство Symbol.iterator
range[Symbol.iterator] = function () {
  return {
    // текущее значение
    current: this.from,
    // последнее значение
    last: this.to,

    // обязательный для итератора метод
    next() {
      // если текущее значение меньше последнего
      if (this.current <= this.last) {
        // возвращаем такой объект, увеличивая значение текущего значения
        return { done: false, value: this.current++ }
      } else {
        // иначе сообщаем о том, что значений для перебора больше нет
        return { done: true }
      }
    },
  }
}

for (const num of range) log(num) // 1 2 3 4 5
// работает!

// Функция для превращения обычного объекта в итерируемый
const makeIterator = obj => {
  // добавляем неперечисляемое свойство "size", аналогичное свойству "length" массива
  Object.defineProperty(obj, 'size', {
    value: Object.keys(obj).length,
  })

  obj[Symbol.iterator] = (i = 0, values = Object.values(obj)) => ({
    next: () =>
      i < obj.size ? { done: false, value: values[i++] } : { done: true },
  })
}

makeIterator(person)
for (const value of person) {
  log(value) // John 30 developer
}

const arr = Array.from(person)
log(arr) // ["John", 30, "developer"]
log(arr.size) // 3

// #########################

const makeGenerator = obj => {
  // другое неперечисляемое свойство
  // возвращающее логическое значение
  Object.defineProperty(obj, 'isAdult', {
    value: obj['age'] > 18,
  })

  obj[Symbol.iterator] = function* () {
    for (const i in this) {
      yield this[i]
    }
  }
}

makeGenerator(person)

for (const value of person) {
  log(value) // John 30 developer
}

const arr = [...person]
log(arr) // ["John", 30, "developer"]
log(person.isAdult) // true

// ###########################
// log(person.next().value); // TypeError: person.next is not a function
const iterablePerson = person[Symbol.iterator]()

log(iterablePerson.next()) // { value: "John", done: false }
log(iterablePerson.next().value) // 30
log(iterablePerson.next().value) // developer
log(iterablePerson.next().done) // true

const person = {
  name: 'John',
  age: 30,
  job: 'developer',

  [Symbol.iterator]: function* () {
    for (const i in this) {
      yield this[i]
    }
  },
}

// #####################################################

const makeProxy = (obj, values = Object.values(obj)) =>
  new Proxy(obj, {
    get(target, key) {
      // преобразуем ключ в целое число
      key = parseInt(key, 10)
      // если ключ является числом, если он больше или равен 0 и меньше длины объекта
      if (key !== NaN && key >= 0 && key < target.size) {
        // возвращаем соответствующее свойство
        return values[key]
      } else {
        // иначе сообщаем, что такого свойства нет
        throw new Error('no such property')
      }
    },
    set(target, prop, value) {
      // при попытке перезаписать свойство "name" или свойство "age"
      if (prop === 'name' || prop === 'age') {
        // выбрасываем исключение
        throw new Error(`this property can't be changed`)
      } else {
        // иначе добавляем свойство в объект
        target[prop] = value
        return true
      }
    },
  })

const proxyPerson = makeProxy(person)
// получаем свойство
log(proxyPerson[0]) // John
// пытаемся получить несуществующее свойство
log(proxyPerson[2]) // Error: no such property
// добавляем новое свойство
log((proxyPerson[2] = 'coding')) // true
// пытаемся перезаписать иммутабельное свойство
log((proxyPerson.name = 'Bob')) // Error: this property can't be changed
