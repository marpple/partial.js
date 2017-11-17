# Functional Javascript Library - Partial.js

[Site](https://marpple.github.io/partial.js) |
[Docs](https://marpple.github.io/partial.js/docs)

Partial.js는 함수형 자바스크립트를 더 많은 영역에서 사용하고자, 몇 가지 기능을 확장한 라이브러리입니다. Partial.js는 부분 적용, 파이프라인, 불변적인 값 다루기, 가변적인 값 다루기, 템플릿 엔진, 비동기 제어, 이벤트 등의 기능을 제공하고 있습니다. 이 문서는 Partial.js의 주요 기능과 스타일을 소개합니다.

```javascript
/* Others */
fetch('/api/products')
    .then(res => res.json())
    .then(products => _(products)
        .filter(p => p.price > p.discounted_price)
        .minBy(p => p.price - p.discounted_price))
    .then(_.flow(
      p => p.price - p.discounted_price,
      commify,
      console.log)); // 1,000

/* Partial.js */
_.go(fetch('/api/products'),
    _('json'),
    _.filter(p => p.price > p.discounted_price),
    _.min(p => p.price - p.discounted_price),
    p => p.price - p.discounted_price,
    commify,
    console.log); // 1,000
```

## 설치하기

### Partial.js 설치

##### 다운로드는 아래에서:

소스코드는 https://github.com/marpple/partial.js 에서 받을 수 있습니다. Partial.js는 48kb(compressed) 정도로 작지만 아주 쓸모 있습니다.

##### 브라우저에서:

```html
<script src="partial.js"></script>
```

##### npm:
```shell
$ npm intall --save partial-js
```

##### Node.js에서:
```javascript
var _ = require('partial-js');
```

### 다른 함수형 라이브러리와 함께 사용하기

함수형 자바스크립트 라이브러리들은 `_`를 네임스페이스로 사용하는 경우 많습니다. Partial.js 역시 `_`를 네임스페이스로 사용합니다. Partial.js는 Underscore.js나 Lodash의 주요 기능을 모두 가지고 있습니다. 해당 라이브러리를 함께 사용해야 한다면 Partial.js의 네임스페이스 관련 기능을 이용하면 됩니다. 기존 프로젝트에서 Lodash 등을 사용하고 있는데, Partial.js를 함께 사용하고 싶을 때 유용한 기능입니다.

#### 1. Node.js나 AMD의 경우 원래의 방식대로 네임스페이스를 원하는 대로 지정하면 됩니다.

#### 2. 브라우저이고 AMD를 사용하지 않는다면 아래와 같은 순으로 불러오면 됩니다.

아래처럼 불러오면 `_p.each`는 Partial.js의 `each`이고 `_.each`는 Lodash의 `each`가 됩니다.

```html
<script src="partial.js"></script>
<script src="lodash.js"></script>
```

만일 `_p`가 맘에 들지 않으면 `window.p = _p;`처럼 원하는 대로 바꿔서 사용하면 됩니다.

```html
<script>window.p = _p;</script>
```

#### 2. 부득이하게 불러오는 순서를 보장하지 못하는 경우라면 다음과 같이하면 됩니다.

```javascript
var lodash = _previous_underscore(); // 다른 라이브러리의 _
var partial = _partial_namespace(); // Partial.js의 _
```

전역에 선언된 `_previous_underscore`함수를 실행하면 Partial.js가 불려지기전에 전역에 있던 `_`를 얻을 수 있고, 마찬가지로 전역에 선언된 `_partial_namespace` 함수를 실행하면 Partial.js의 `_`를 얻을 수 있습니다.

## 더 나은 부분 적용 (Partial application)

Partial.js는 이름처럼 부분 적용(Partial application)을 중요하게 생각합니다. 기존의 `_.partial` 함수는 왼쪽에서부터만 인자를 적용해둘 수 있습니다. Partial.js의 `_.partial` 함수는 맨 오른쪽 인자나 맨 오른쪽에서 두 번째에만 인자를 적용해두는 것도 가능하며, 새로운 구분자인 `___`를 활용하여 중간 지점에 인자가 가변적으로 적용되도록 비워둘 수 있습니다.

### _.partial의 일반적 사용

`_.partial`을 실행하면서 인자 자리에 `_`를 넘기면 부분 적용할 인자를 건너띌 수 있습니다. `_`를 이용하면 원하는 곳에만 인자를 부분 적용해둘 수 있습니다. `_`가 있는 자리는 이후 실행시 채워집니다.

```javascript
var pc = _.partial(console.log, 1);
pc(2);
// 결과: 1 2
// 2 가 오른쪽으로 들어갑니다.
pc(2, 3);
// 결과: 1 2 3
// 2, 3이 오른쪽으로 들어갑니다.

var pc = _.partial(console.log, _, 2);
pc(1);
// 결과: 1 2
// 1이 왼쪽의 _ 자리에 들어갑니다.
pc(1, 3);
// 결과: 1 2 3
// 1이 왼쪽의 _ 자리에 들어가고 3이 오른쪽으로 들어갑니다.

var pc = _.partial(console.log, _, _, 3);
pc(1);
// 결과: 1 undefined 3
// 1이 왼쪽의 _ 자리에 들어가고 두 번째 _는 들어오지 않아 undefined가 됩니다.
pc(1, 2);
// 결과: 1 2 3
// 1과 2가 순서대로 _, _를 채웁니다.
pc(1, 2, 4);
// 결과: 1 2 3 4
// 1과 2가 순서대로 _, _를 채우고 3의 오른쪽으로 4가 들어갑니다.

var pc = _.partial(console.log, _, 2, _, 4);
pc(1, 3, 5);
// 결과: 1 2 3 4 5
// 1을 _ 자리에 채우고 2를 넘겨서 _에 3을 채우고 4의 오른쪽에 5가 들어갑니다.

var pc = _.partial(console.log, _, 2, _, _, 5);
pc(1, 3, 4, 6);
// 결과: 1 2 3 4 5 6
// 1을 _ 자리에 채우고 2를 넘겨서 _에 3을 채우고 다음 _에 4를 채우고 5의 오른쪽에 6이 들어갑니다.
```

### 오른쪽에서부터 인자 적용해두기

`_.partial`을 실행하면 `___`를 기준으로 왼편의 인자들을 왼쪽부터 적용하고 오른편의 인자들을 오른쪽부터 적용할 준비를 해둔 함수를 리턴합니다. 부분 적용된 함수를 나중에 실행하면 그때 받은 인자들로 왼쪽과 오른쪽을 먼저 채운 후, 남은 인자들로 가운데 `___` 자리를 채웁니다.

```javascript
var pc = _.partial(console.log, ___, 2, 3);
pc(1);
// 결과: 1 2 3
// ___ 자리에 1이 들어가고 2, 3은 맨 오른쪽에 들어갑니다.
pc(1, 4, 5, 6);
// 결과: 1 4 5 6 2 3
// ___ 자리에 1, 4, 5, 6이 들어가고 2, 3은 맨 오른쪽에 들어갑니다.

var pc = _.partial(console.log, _, 2, ___, 6);
pc(1, 3, 4, 5);
// 결과: 1 2 3 4 5 6
// _에 1이 들어가고 2를 넘어가고 ___ 자리에 3, 4, 5가 채워지고 6이 맨 오른쪽에 들어갑니다.
pc(1, 3, 4, 5, 7, 8, 9);
// 결과: 1 2 3 4 5 7 8 9 6
// _에 1이 들어가고 2를 넘어가고 ___ 자리에 3, 4, 5, 7, 8, 9가 채워지고 6이 맨 오른쪽에 들어갑니다.

var pc = _.partial(console.log, _, 2, ___, 5, _, 7);
pc(1);
// 결과: 1 2 5 undefined 7
// _ 자리에 1이 들어가고 2와 5사이는 유동적이므로 모이고 5가 들어간 후 _가 undefined로 대체 되고 7이 들어갑니다.
pc(1, 3, 4);
// 결과: 1 2 3 5 4 7
// _ 자리에 1이 들어가고 2와 5사이에 3이 들어가고 _ 를 4로 채운 후 7이 들어갑니다.
// 왼쪽의 _ 들이 우선 순위가 제일 높고 ___ 보다 오른쪽의 _ 들이 우선순위가 높습니다.
pc(1, 3, 4, 6, 8);
// 결과: 1 2 3 4 6 5 8 7
// _ 자리에 1이 들어가고 2와 5사이에 3, 4, 6이 들어가고 _ 를 8로 채운 후 7이 들어갑니다.
```

### 간결하게 사용하기

`_ == _.partial`입니다. `_.partial`을 `_`로 간결하게 표현할 수 있습니다.

```javascript
function add(a, b) {
  return a + b;
}
var add10 = _(add, 10);
console.log( add10(5) );
// 15
```

## 파이프라인

파이프라인 함수인 `_.pipe`, `_.go` 등은 작은 함수들을 모아 큰 함수를 만드는 함수입니다. 파이프라인으로 함수를 조합하면 왼쪽에서부터 오른쪽, 위에서부터 아래로 표현되어 읽기 쉬운 코드가 됩니다. 체인 방식과 다르게 아무 함수나 사용할 수 있어 자유도가 높습니다. 작은 함수들을 인자와 결과만을 생각하면서 조합하면 됩니다.

### 즉시 실행과 Multiple Results

`_.go`는 파이프라인의 즉시 실행 버전입니다. 첫 번째 인자로 받은 값을 두 번째 인자로 받은 함수에게 넘겨주고 두 번째 인자로 받은 함수의 결과는 세 번째 함수에게 넘겨주는 것을 반복하다가 마지막 함수의 결과를 리턴해줍니다.

```javascript
_.go(10, // 첫 번째 함수에서 사용할 인자
  function(a) { return a * 10 }, // 연속 실행할 함수 1
  // 100
  function(a) { return a - 50 }, // 연속 실행할 함수 2
  // 50
  function(a) { return a + 10 }); // 연속 실행할 함수 3
  // 60
```

`_.go`는 Multiple Results를 지원합니다. `_.mr` 함수를 함께 사용하면 다음 함수에게 2개 이상의 인자들을 전달할 수 있습니다.

```javascript
_.go(10, // 첫 번째 함수에서 사용할 인자
  function(a) { return _.mr(a * 10, 50) }, // 두 개의 값을 리턴
  function(a, b) { return a - b }, // 두 개의 인자 받기
  function(a) { return a + 10 });
  // 60
```

`_.go`의 첫 번째 인자는 두 번째 인자인 함수가 사용할 인자고 두 번째 부터는 파이프라인에서 사용할 함수들입니다. `_.go`의 두 번째 인자인 함수, 즉 최초 실행될 함수에게 2개 이상의 인자를 넘기고자 한다면 `_.mr`을 사용하면 됩니다. `_.mr`로 인자들을 감싸서 넘겨주면, 다음 함수는 인자를 여러 개로 펼쳐서 받게 됩니다.

```javascript
_.go(_.mr(2, 3),
  function(a, b) {
    return a + b; // 2 + 3
  },
  function(a) {
    return a * a;
  });
  // 25
```

`_.go`를 이미 정의되어 있는 함수와 조합하거나 화살표 함수와 사용하면 더욱 읽기 좋아집니다.

```javascript
function add(a, b) {
  return a + b;
}
function square(a) {
  return a * a;
}
_.go(_.mr(2, 3), add, square);
// 25

_.go(_.mr(2, 3), (a, b) => a + b, a => a * a);
// 25
```

### 파이프라인 함수를 리턴하는 _.pipe

`_.go`가 즉시 실행하는 파이프라인이라면 `_.pipe`는 실행할 준비가 된 함수를 리턴하는 파이프라인 함수입니다. 그외 모든 기능은 `_.go`와 동일합니다.

```javascript
var f1 = _.pipe(add, square);
f1(2, 3);
// 25

var f2 = _.pipe((a, b) => a + b, a => a * a);
f2(2, 3);
// 25
```

## 부분 커링

### 커링이 부분적으로 동작하는 함수

Partial.js의 주요 함수들은 커링이 부분적으로 동작하도록 지원하고 있습니다. 아래는 일반적인 사용 모습입니다.

##### 일반적인 방식:

```javascript
var values = function(list) {
  return _.map(list, function(v) { return v; })
};
console.log(values({ a: 1, b: 2, c: 4 }));
// [1, 2, 4]

var take3 = function(list) {
  return _.take(list, 3);
};
take3([1, 2, 3, 4, 5]);
// [1, 2, 3]
```

Partial.js의 주요 함수들은 부분 커링이 적용되어 위와 동일한 동작을 아래와 같이 간결하게 표현할 수 있습니다.

##### 부분 커링이 지원될 경우:

```javascript
var values = _.map(function(v) { return v; });
console.log(values({ a: 1, b: 2, c: 4 }));
// [1, 2, 4]

var take3 = _.take(3);
take3([1, 3, 5, 7, 9]);
// [1, 3, 5]
```

### 파이프라인과 함께

부분 커링이 지원되면 파이프라인과 함께 사용할 때, 체인처럼 간결한 표현이 가능합니다.

```javascript
var users = [
  { id: 1, name: "ID", age: 32 },
  { id: 2, name: "HA", age: 25 },
  { id: 3, name: "BJ", age: 32 },
  { id: 4, name: "PJ", age: 28 },
  { id: 5, name: "JE", age: 27 },
  { id: 6, name: "JM", age: 32 },
  { id: 7, name: "JI", age: 31 }
];

/* 일반적인 사용 */
_.go(users,
  function(users) {
    return _.filter(users, function(u) { return u.age < 30; });
  },
  function(users) {
    return _.pluck(users, 'name');
  },
  console.log);
// ["HA", "PJ", "JE"]

/* 부분 커링이 된다면 */
_.go(users,
  _.filter(function(u) { return u.age < 30; }),
  _.pluck('name'),
  console.log);
// ["HA", "PJ", "JE"]

/* Underscore.js 체인 */
underscore.chain(users)
  .filter(function(u) { return u.age < 30; })
  .pluck('name')
  .tap(console.log);
// ["HA", "PJ", "JE"]
```

`_.go`, `_.pipe` 등의 파이프라인이 받는 재료는 함수이기 때문에 아무 함수나 조합할 수 있습니다. 체인처럼 메서드 등으로 준비되어있지 않아도 되며 Partial.js의 함수만 사용할 필요도 없습니다. Partial.js의 파이프라인은 결과를 여러 개로 리턴할 수 있고, 여러 개의 인자를 받을 수 있고, 다른 라이브러리에 있는 함수든, 직접 만든 함수든, 익명 함수든 모두 쉽게 사용할 수 있습니다.

```javascript
var products = [
  { id: 1, name: "후드 집업", discounted_price: 6000, price: 10000  },
  { id: 2, name: "코잼 후드티", discounted_price: 8000, price: 8000  },
  { id: 3, name: "A1 반팔티", discounted_price: 6000, price: 6000  },
  { id: 4, name: "코잼 반팔티", discounted_price: 5000, price: 6000  }
];

// 할인 상품들을 가격이 낮은 순으로 정렬한 상품 이름들
_.go(products,
  _.filter(p => p.price > p.discounted_price),
  _.sortBy('discounted_price'),
  _.pluck('name'),
  console.log);
  // ["코잼 반팔티", "후드 집업"]

// 할인이 없는 상품들의 id들
_.go(products,
  _.reject(p => p.price > p.discounted_price),
  _.pluck('id'),
  console.log);
  // [2, 3]

// 할인 상품 중 할인액이 가장 낮은 상품의 이름
_.go(products,
  _.filter(p => p.price > p.discounted_price),
  _.min(p => p.price - p.discounted_price),
  _.val('name'),
  console.log);
  // 코잼 반팔티

// 할인액이 가장 높은 상품의 이름
_.go(products,
  _.max(p => p.price - p.discounted_price),
  _.val('name'),
  console.log);
  // 후드 집업
```

## 비동기

Promise가 지원되지 않는 환경에서도 Partial.js만으로 다양한 비동기 상황을 간단히 제어할 수 있습니다.

### 파이프라인으로 비동기 제어 하기

`_.go`, `_.pipe` 등의 파이프라인 함수들은 비동기 제어를 지원합니다. `_.go`는 함수들을 순차적으로 실행해나가다가 비동기 함수의 결과를 재귀 함수로 꺼낸 후, 다음 함수에게 전달하는 식으로 비동기 상황을 제어합니다. Partial.js의 파이프라인에서는 일반 콜백 함수와 Promise를 모두 지원합니다. `_.go`와 `_.pipe`는 파이프라인의 함수들을 실행하는 도중, `Promise` 객체를 만나거나, jQuery의 Deferred Object를 만나면 자동으로 비동기를 제어하는 파이프라인으로 변합니다. 중간에서 비동기를 만나지 않으면 예정대로 결과를 즉시 리턴합니다.

##### Promise와 사용:

```javascript
_.go(10,
  function(a) {
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve(a + 10);
      }, 1000);
    });
  },
  function(a) { // 1초 뒤 실행
    console.log(a);
    // 20
  });
```

##### 일반 콜백 패턴의 함수:

```javascript
_.go(10,
  _.callback(function(a, next) {
    setTimeout(function() {
      next(a + 10);
    }, 100)
  }),
  function(a) { // next를 통해 받은 결과 a
    console.log(a);
    // 20
  });
```

파이프라인은 `_.callback`으로 감싸진 익명 함수에게 마지막 인자로 `next` 함수를 전달합니다. `next` 함수에게 결과를 전달하면 다음 함수로 넘어가게 됩니다. 만약에 원래 마지막 인자로 `callback` 함수를 받고 있던 함수일 경우, `_.callback`으로 감싸주기만 하면 파이프라인과 사용할 수 있습니다.

`_.callback`으로 감싸진 익명 함수는 `Promise` 객체를 리턴합니다. 정확히는 `Promise`가 지원되는 환경에서는 `Promise` 객체를 리턴하고, `Promise`가 지원되지 않는 환경에서는 약식 `Promise`를 리턴합니다. 약식 `Promise`를 받아도 파이프라인이 비동기를 제어하기 때문에 `Promise`를 지원하지 않는 환경에서도 파이프라인식의 비동기 제어가 가능합니다. 브라우저에서도 별도의 `Promise` 라이브러리를 가져올 필요가 없습니다.

### 컬렉션을 다루는 비동기 제어 함수

Partial.js의 `_.each`, `_.map`, `_.reduce` 등의 주요 함수들은 `_.go`와 `_.pipe`처럼 동기와 비동기 상황이 모두 대응되도록 되어 있습니다. Partial.js의 함수를 이용하면 비동기 상황에서도 동기 상황과 동일한 코드를 작성할 수 있고, 비동기 함수와 동기 함수의 조합도 가능합니다.

```javascript
function syncDate() {
  return new Date();
}

function promiseDate() {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(new Date());
    }, 1000);
  });
}

_.go([1, 2, 3],
  _.map(syncDate),
  _.map(d => d.toString()),
  console.log);
// 결과:
//  ["Sun Feb 05 2017 03:33:36 GMT+0900 (KST)",
//   "Sun Feb 05 2017 03:33:36 GMT+0900 (KST)",
//   "Sun Feb 05 2017 03:33:36 GMT+0900 (KST)"]

_.go([1, 2, 3],
  _.map(promiseDate),
  _.map(d => d.toString()),
  console.log);
// 결과:
//  ["Sun Feb 05 2017 03:33:37 GMT+0900 (KST)",
//   "Sun Feb 05 2017 03:33:38 GMT+0900 (KST)",
//   "Sun Feb 05 2017 03:33:39 GMT+0900 (KST)"]
```

위 사례처럼 Partial.js는 `_.go`, `_.pipe`, `_.each`, `_.map`, `_.find`, `_.filter`, `_.reject`, `_.reduce`, `_.some`, `_.every`, `_.if().else_if().else()` 등의 함수들에서 자동 비동기 제어 로직을 지원합니다.

## 값 다루기

### 불변적으로 다루기

```javascript
var users = [
  { name: "ID", age: 32 },
  { name: "HA", age: 25 },
  { name: "BJ", age: 32 },
  { name: "PJ", age: 28 },
  { name: "JE", age: 27 }
];

var sortedUsers = _.sortBy(users, 'age');

console.log(users == sortedUsers);
// false

console.log(_.pluck(sortedUsers, 'age'));
// [25, 27, 28, 32, 32]

console.log(_.pluck(users, 'age'));
// [32, 25, 32, 28, 27]
```

`sortedUsers`는 새로운 객체입니다. `sortedUsers`는 나이순으로 정렬이 되었는데, `users`는 원본 그대로 유지됩니다. 다른 곳에서 `users`에 의존하는 곳이 있다면 `sortedUsers`처럼 새로운 객체를 만들어 정렬을 하는 방식이 부수효과가 없고 유리합니다.

`sortedUsers`는 새로운 값이지만 배열안의 값은 기존 값을 공유합니다.

```javascript
console.log(users[1] == sortedUsers[0]);
// true
```

두 배열 안에 있는 모든 값들은 새로운 값이 아닌 기존의 값입니다. 항상 배열 내의 모든 값을 새롭게 만든다면 메모리 사용량이 높아지겠지만 `_.sortBy`는 내부의 값은 기존의 값을 그대로 공유하고 배열만 새로 만들어 정렬하기 때문에 효율적입니다. 이런 전략을 잘 이용하면 부수효과를 줄이면서도 메모리 사용량 증가는 최소화할 수 있습니다.

`_.reject` 등의 함수도 동일한 방식으로 동작합니다.

```javascript
var rejectedUsers = _.reject(users, function(user) { return user.age < 30; });
console.log(rejectedUsers);
// [{ name: "ID", age: 32 }, { name: "BJ", age: 32 }]

console.log(rejectedUsers == users);
// false
console.log(rejectedUsers.length, users.length);
// 2 5
console.log(rejectedUsers[0] == users[0]);
// true
```

함수형 자바스크립트 라이브러리의 함수들은 값을 직접 변경하는 것이 아닌, 변경된 새로운 값을 만드는 방식으로 데이터를 변형해나갑니다.

```javascript
var b1 = [1, 2, 3, 4, 5];
var b2 = _.initial(b1, 2); // 뒤에서 2개 제거한 새로운 배열 리턴
console.log(b1 == b2, b1, b2);
// false [1, 2, 3, 4, 5] [1, 2, 3]

var b3 = _.without(b1, 1, 5); // 1과 5를 제거한 새로운 배열 리턴
var b4 = _.without(b3, 2); // 2를 제거한 새로운 배열 리턴
console.log(b1 == b3, b3 == b4, b3, b4);
// false false [2, 3, 4] [3, 4]
</script>```

### 깊은 값 찾기와 JSON Selector

Partial.js에는 중첩된 기본 객체에 대한 조회와 변형을 돕는 함수들이 있습니다. Partial.js에서는 깊은 값을 찾아가기 위한 JSON Selector를 만들었습니다. JSON Selector는 문자열로 작성하며, 함수적인 기능도 지원하여 다양한 조건으로 데이터를 찾아갈 수 있습니다.

```javascript
var users = [
  {
    id: 1,
    name: 'BJ',
    post_count: 3,
    posts: [
      { id: 1, body: '하이', comments: [{ id: 3, body: '코멘트3' }] },
      { id: 2, body: '하이2', comments: [{ id: 1, body: '코멘트1' }, { id: 2, body: '코멘트2' }] },
      { id: 4, body: '하이4', comments: [{ id: 4, body: '코멘트4' }, { id: 5, body: '코멘트5' }] }
    ]
  },
  {
    id: 2,
    name: 'PJ',
    post_count: 1,
    posts: [
      { id: 3, body: '하이3', comments: [] }
    ]
  }
];

// key로만 찾기
console.log(
  _.sel(users, '0->name'), // BJ
  _.sel(users, '1->name'), // PJ
  _.sel(users, '0->post_count'), // 3
  _.sel(users, '1->post_count'), // 1
  _.sel(users, '0->posts->1->body') // 하이2
);

// 괄호로 내부적으로 find + predicate 실행하기
console.log(
  _.sel(users, '(u=>u.id==1) -> name'), // BJ
  _.sel(users, '(u=>u.id==1) -> posts -> (p=>p.id==4) -> body') // 하이4
);

// 위 코드는 아래와 같습니다.
_.go(users,
  _.find(function(u) { return u.id == 1; }),
  function(user) { return user.name; },
  console.log); // BJ

_.go(users,
  _.find(function(u) { return u.id == 1; }),
  function(user) { return user.posts; },
  _.find(function(p) { return p.id == 4; }),
  function(user) { return user.body; },
  console.log); // 하이4

// 동일 코드를 아래처럼 더 짧게 표현할 수 있습니다.
console.log(
  _.sel(users, '($.id==1) -> name'), // BJ
  _.sel(users, '(#1) -> posts -> (#4) -> body') // 하이4
);

// ($.id==1)는 function($) { return $.id == 1 }와 같습니다.
// (#4)는 function($) { return $.id == 4 } 와 같습니다.
```

`()`를 사용할 때 `id`로 비교하는 경우에는 `#`을 사용하는 방식이 성능이 가장 좋습니다. JSON Selector는 `()`를 통해 `find(predicate)`를 작성할 수 있어 단순히 key들로 찾아가는 방법보다 유용합니다. JSON Selector의 `()`는 함수이므로, `id` 비교외에 다른 조건도 얼마든지 만들 수 있습니다.

### 깊은 값 가변적으로 변경하기

JSON Selector를 지원하는 Partial.js의 함수들을 이용하면 중첩 구조 객체의 안쪽 값을 찾고 변경하기 편합니다.

```javascript
var user = {
  id: 1,
  name: 'BJ',
  post_count: 3,
  posts: [
    { id: 1, body: '하이', comments: [{ id: 3, body: '코멘트3' }] },
    { id: 2, body: '하이2', comments: [{ id: 1, body: '코멘트1' }, { id: 2, body: '코멘트2' }] },
    { id: 4, body: '하이4', comments: [{ id: 4, body: '코멘트4' }, { id: 5, body: '코멘트5' }] }
  ]
};

_.go(
  _.set(user, 'posts -> (#4) -> comments -> (#4) -> body', '코멘트4를 수정'),
  console.log);
// arguments { ... }
// [0] 내부가 변경된 user 전체
// [1] "코멘트4를 수정"
// [2] "body"
// [3] { id: 4, body: '코멘트4를 수정' }

console.log( user.posts[2].comments[0].body );
// 코멘트4를 수정
```

`_.set`을 사용하면 깊은 값을 JSON Selector로 찾아간 다음, 마지막 key에 해당하는 값을 변경하게 됩니다.

### 깊은 값을 불변적으로 변경하기

```javascript
_.go(
  _.im.set(user, 'posts -> (#4) -> comments -> (#4) -> body', '코멘트4를 새롭게 수정'),
  function(user2) {
    console.log(
      user == user2, // false
      user.posts[2].comments[0].body, // 코멘트4를 수정
      user2.posts[2].comments[0].body, // 코멘트4를 새롭게 수정

      user.posts == user2.posts, // false
      user.posts[0] == user2.posts[0], // true 기존 값 공유
      user.posts[1] == user2.posts[1], // true 기존 값 공유
      user.posts[2] == user2.posts[2], // false 부모 라인이므로 새로운 값
      user.posts[2].comments[0] == user2.posts[2].comments[0], // false 새로운 값
      user.posts[2].comments[1] == user2.posts[2].comments[1] // true 기존 값 공유
    )
  });
```

`_.set`의 immutable 버전인 `_.im.set`은 안쪽 값이 변경된 새로운 부모 객체를 리턴합니다. `start` 객체인 `user`는 새로운 객체인 `user2`가 되고, 중첩 구조를 파고들면서, 새로 만들어야 하는 값만 새로 만들고, 그대로 재활용해도 되는 데이터는 이전 값을 공유합니다. immutable.js 처럼 값 복사에 있어 재활용할 수 있는 객체를 최대한 남겨 불필요한 메모리 사용을 줄였습니다.

다음은 좀 더 다양한 사례입니다.

### 다양한 깊은 값 다루기 함수

JSON Selector를 통해 깊은 값을 변경할 수 있는 함수는 `_.set`, `_.unset`, `_.remove2`, `_.pop`, `_.shift`, `_.push`, `_.unshift` 등이 있고 그 외에 `_.extend2`, `_.defaults2` 등도 있습니다. 각각의 모든 함수는 `_.im.set`과 같이 `_.im`를 붙이면 immutable 버전으로 동작하여 부모 객체의 복사본을 리턴합니다.

```javascript
var users = [
  {
    id: 1,
    name: 'BJ',
    post_count: 3,
    posts: [
      { id: 1, body: '하이', comments: [{ id: 3, body: '코멘트3' }] },
      { id: 2, body: '하이2', comments: [{ id: 1, body: '코멘트1' }, { id: 2, body: '코멘트2' }] },
      { id: 4, body: '하이4', comments: [{ id: 4, body: '코멘트4' }, { id: 5, body: '코멘트5' }] }
    ]
  },
  {
    id: 2,
    name: 'PJ',
    post_count: 1,
    posts: [
      { id: 3, body: '하이3', comments: [] }
    ]
  }
];

_.unset(users, '(#2)->name');
console.log(users[1]); // {id: 2, post_count: 1, posts: Array[1]}

_.remove2(users, '(#1)->posts->(#2)');
console.log(_.pluck(users[0].posts, 'body')); // ["하이", "하이4"]

_.go(_.im.remove2(users, '(#2)->posts->(#3)'), // immutable
  function(users2) {
    console.log(users2[1].posts); // []
    console.log(users[1].posts); // [{ id: 3, body: '하이3', comments: [] }]
  });

_.extend2(users, '(#2)->posts->(#3)', { body: "하이3 수정함", updated_at: new Date() });
console.log(users[1].posts[0]);
// {id: 3, body: "하이3 수정함", comments: Array[0], updated_at: Sun Mar 05 ... }

_.push(users, '(#2)->posts->(#3)->comments', { id: 6, body: '코멘트6' });
console.log(users[1].posts[0].comments[0].body); // 코멘트6
```

### 함수로 값 변경하기

안쪽의 값 변경을 함수로도 할 수 있어 지원되지 않는 기능이 있어도 내가 원하는 기능으로 변경할 수 있습니다.

```javascript
var users = [
  {
    id: 1,
    name: 'BJ',
    post_count: 3,
    posts: [
      { id: 1, body: '하이', comments: [{ id: 3, body: '코멘트3' }] },
      { id: 2, body: '하이2', comments: [{ id: 1, body: '코멘트1' }, { id: 2, body: '코멘트2' }] },
      { id: 4, body: '하이4', comments: [{ id: 4, body: '코멘트4' }, { id: 5, body: '코멘트5' }] }
    ]
  },
  {
    id: 2,
    name: 'PJ',
    post_count: 1,
    posts: [
      { id: 3, body: '하이3', comments: [] }
    ]
  }
];

_.set(users, '(#1)->posts', function(posts) {
  return _.reject(posts, function(post) {
    return post.comments.length < 2;
  });
});
console.log(_.sel(users, '(#1)->posts').length);  // 2
```

## 함수 스타일의 템플릿 함수

Partial.js는 함수 스타일의 템플릿 엔진으로 함수 실행, 코드 실행, 인자 선언, Jade 스타일 문법 지원, 일반 HTML 문법 지원, 비동기 제어 등의 기능을 지원합니다.

### Jade 스타일 문법 지원

Partial.js의 템플릿 함수 종류에는 인자를 여러 개 받아 사용할 수 있는 `_.template`, 인자를 `$`로 한 개만 받아 사용하는 `_.template$` 등이 있습니다. `_.template` 시리즈는 모두 Jade 스타일의 문법을 지원하며, 짧은 이름인 `_.t`, `_.t$`로 사용 가능합니다.

```html
<script>
_.pipe(
  _.template$('\
    .product_list\
      ul\
        li 티셔츠\
        li 핸드폰 케이스\
        li 쿠션\
        li 담요'),
  function(html) {
    $('body').append(html);
  })();
</script>

<!-- 결과 -->
<div class="product_list">
  <ul>
    <li>티셔츠</li>
    <li>핸드폰 케이스</li>
    <li>쿠션</li>
    <li>담요</li>
  </ul>
</div>
```

ES5에서는 아직 멀티 라인이 지원되지 않기에 \ 를 사용합니다. 위 코드는 템플릿 엔진 Jade 스타일의 문법이며 CSS Selector와 비슷합니다. 지금은 Jade의 이름이 Pug로 변경되었습니다. 간결하게 HTML을 표현할 수 있습니다. 다음과 같은 문법들을 지원합니다.

```html
<script>
_.pipe(
  _.template$('\
    div[style="border: 1px solid #000; padding: 20px;"]\
      #id1.class1.class2[class="class3 class4"] hi <em>ho</em>\
      .service\
        a[href="http://www.marpple.com" target="_blank"] http://www.marpple.com\
      br'),
  function(html) {
    $('body').append(html);
  })();
</script>

<!-- 결과 -->
<div style="border: 1px solid #000; padding: 20px;">
  <div id="id1" class="class1 class2 class3 class4">hi <em>ho</em></div>
  <div class="service"><a href="http://www.marpple.com" target="_blank">http://www.marpple.com</a></div>
  <br>
</div>
```

### 데이터 치환

Partial.js의 템플릿 함수들은 Handlebars나 Underscore.js의 템플릿 함수들처럼 함수를 리턴하는 함수입니다. 다음과 같은 방법으로 문자열 안에서 데이터를 치환할 수 있습니다.

```html
<script>
_.go(
  { name: "Hanah", age: 25 },
  _.template$('\
    .user\
      .name {{$.name}}\
      .age {{$.age}}'),
  function(html) {
    $('body').append(html);
  });
</script>

<!-- 결과 -->
<div class="user">
  <div class="name">Hanah</div>
  <div class="age">25</div>
</div>
```

### 일반 HTML 전용 _.string

일반 HTML만 사용할 때는 Jade 파싱 절차가 생략되는 `_.string`, `_.string$`, `_.s`, `_.s$` 등을 사용하는 것이 좋습니다.

```html
<script>
_.go(
  { name: "Dool", age: 25 },
  _.string$('\
    <div class="user">\
      <div class="name">{{$.name}}</div>\
      <div class="age">{{$.age}}</div>\
    </div>'),
  function(html) {
    $('body').append(html);
  });
</script>

<!-- 결과 -->
<div class="user">
  <div class="name">Dool</div>
  <div class="age">25</div>
</div>
```

### escape

<code>&#123;&#123;&#125;&#125;</code>과 <code>&#123;&#123;&#123;&#125;&#125;&#125;</code>를 사용하여 출력 모드를 변경할 수 있습니다.

```html
<script>
var t1 = _.template('html', '\
  div\
    {{html}} {{{html}}}');

$('body').append(t1('<h3>하이</h3>'));
</script>

<!-- 결과 -->
<div>
  <h3>하이</h3> &lt;h3&gt;하이&lt;/h3&gt;
</div>
```

### 코드 실행

<code>&#123;&#123;&#125;&#125;</code>나 <code>&#123;&#123;&#123;&#125;&#125;&#125;</code>안에서는 자바스크립트 코드(표현식 expression)를 작성할 수 있습니다.

```html
<script>
var t2 = _.template('a, b, bool', '\
  div\
    {{ a + b }} {{ bool ? "참" : "거짓" }}');

$('body').append(t2(10, 5, true));
</script>

<!-- 결과 -->
<div>15 참</div>
```

함수를 실행할 수도 있습니다. 전역에 정의된 함수나, 직접 넘긴 함수나 메서드를 실행할 수 있습니다.

```html
<script>
function add(a, b) {
  return a + b;
}

var t3 = _.template('a, b, sub, d', '\
  div\
    {{ add(a, b) }}, {{ sub(add(a, b), 7) }}, {{ d.getFullYear() }}');

$('body').append(
  t3(10, 5, function(a, b) { return a - b }, new Date()));
</script>

<!-- 결과 -->

<div>15, 8, 2017</div>
```

코드를 실행하는 방법이 한가지 더 있습니다. 템플릿 함수를 정의하는 과정에서 문자열과 함께 함수를 넘겨줄 수 있습니다.

```html
<script>
var t4 = _.template('list', '\
  ul\
    li {{add(list[0], list[1])}}\
    li\
      {{_.map(list, ', function(v) {
        var r = v * 10;
        return r;
      }, ').join(", ")}}\
    li\
      {{_.reduce(list, ', function(memo, v) {
        return memo + v;
      },')}}');

$('body').append(
  t4([1, 2, 3, 4, 5]));
</script>

<!-- 결과 -->
<ul>
  <li>3</li>
  <li>10, 20, 30, 40, 50</li>
  <li>15</li>
</ul>
```

위와 같이 코딩하면 두 줄 이상의 코드도 실행이 가능하고 중첩 따옴표 등의 문제로부터 자유로워집니다. 아무 함수나 실행 가능하고 아무 메서드나 실행 가능합니다. 전역에 선언된 함수나, 인자로 넘긴 함수나, 미리 익명 함수 등으로 선언한 함수도 사용이 가능하며, 클로저, 스코프 등의 특성도 모두 이용이 가능합니다. Handlebars 등은 Helper 등록이 까다롭고, 사용하기 불편한 편입니다. Helper 들의 중첩 활용도 지원하지 않고 그것을 해결하고자 한 오픈소스들도 잘 동작하지 않아 사용이 어렵습니다.

### _.sum

Partial.js의 {{}}에서는 표현식을 자유롭게 사용할 수 있으므로 Partial.js의 함수인 _.sum을 함께 사용하여 배열을 통해 반복된 문자열을 만들 수 있습니다.

```html
<script>
_.sum([1, 2, 3], function(v) {
  return v * 10;
});
// 60

var users = [
  { name: "Cojamm", age: 32 },
  { name: "JIP", age: 31 }
];

_.go(users,
  _.template('users', '\
    ul.users\
      {{_.sum(users, ', _.t('user', '\
        li.user\
          .name {{user.name}}\
          .age {{user.age}}'), ')}}'),
  function(html) {
    $('body').append(html)
  });
</script>

<!-- 결과 -->
<ul class="users">
  <li class="user">
    <div class="name">Cojamm</div>
    <div class="age">32</div>
  </li>
  <li class="user">
    <div class="name">JIP</div>
    <div class="age">31</div>
  </li>
</ul>
```

### 비동기 제어

템플릿 함수들은 Partial.js의 비동기 제어 콘셉트를 그대로 지원합니다. 중간에 비동기 상황을 만나면 결과를 기다린 후 문자열을 조합합니다.

```html
<script>
_.go(null,
  _.template$('\
    ul.users\
      {{_.go($.get("/users"), ', _.sum(_.t('user', '\
        li.user\
          .name {{user.name}}\
          .age {{user.age}}')), ')}}'),
  function(html) {
    $('body').append(html)
  });
</script>

<!-- 약 1초 쯤 뒤 -->
<ul class="users">
  <li class="user">
    <div class="name">Cojamm</div>
    <div class="age">32</div>
  </li>
  <li class="user">
    <div class="name">JIP</div>
    <div class="age">31</div>
  </li>
</ul>
```

## 지연 평가 L

Partial.js의 `L`을 이용하면, 파이프라인 내부에서 함수들의 실행 순서를 재배치하여 적절하게 평가를 지연합니다. 사용법은 간단합니다. 지연 평가하고 싶은 함수의 네임스페이스를 `_` 에서 `L`로 바꿔주면 됩니다. `L`을 통해 지연 평가할 영역을 명시적으로 선택할 수 있습니다. `_.go, _.pipe`등의 파이프라인이 `L`로 시작하여 `L`로 끝날 때까지의 함수들을 재배치하여 성능을 개선합니다.

### 비교

##### 엄격한 평가:
```javascript
var count = 0; // 루프 카운트
var list = [1, 2, 3, 4, 5, 6];
_.go(list,
  _.map(function(v) {
    count++;
    return v * v;
  }),
  _.filter(function(v) {
    count++;
    return v < 20;
  }),
  _.take(2),
  console.log);
// [1, 4]

console.log(count);
// 12 (12번 반복)
```

##### 지연 평가:
```javascript
var count = 0; // 루프 카운트
var list = [1, 2, 3, 4, 5, 6];
_.go(list,
  L.map(function(v) {
    count++;
    return v * v;
  }),
  L.filter(function(v) {
    count++;
    return v < 20;
  }),
  L.take(2),
  console.log);
// [1, 4]

console.log(count);
// 4 (4번 반복)
```

### 지원 함수들

Partial.js의 지연 평가 지원 함수로는 `L.map`, `L.filter`, `L.reject`, `L.find`, `L.some`, `L.every`, `L.take`, `L.loop`가 있습니다. 이 함수들을 순서대로 나열하면 파이프라인이 평가 시점을 변경하여 성능을 개선합니다.

다음과 같은 상황 등에서 동작합니다.

- map->map->map
- map->take
- filter->take
- map->filter->take
- map->filter->map->map
- map->filter->map->take
- map->reject->map->map->filter->map
- map->some
- map->every
- map->find
- map->filter->some
- map->filter->every
- map->filter->find
- filter->map->some
- filter->map->every
- filter->map->reject->find

지연 평가를 시작시키고 유지 시키는 함수는 `map`, `filter`, `reject`이고 끝을 내는 함수는 `take`, `some`, `every`, `find`, `loop` 입니다.

```javascript
var users = [
  { id: 1, name: "ID", age: 12 },
  { id: 2, name: "BJ", age: 28 },
  { id: 3, name: "HA", age: 13 },
  { id: 4, name: "PJ", age: 23 },
  { id: 5, name: "JE", age: 29 },
  { id: 6, name: "JM", age: 32 },
  { id: 7, name: "JE", age: 31 },
  { id: 8, name: "HI", age: 15 },
  { id: 9, name: "HO", age: 28 },
  { id: 10, name: "KO", age: 34 }
];

// 10대 2명까지만 찾아내기
_.go(users,
  L.filter(user => user.age < 20),
  L.take(2),
  console.log);
// [{ id: 1, name: "ID", age: 12 }, { id: 3, name: "HA", age: 13 }]
// 3번만 반복

// 10대 2명까지만 찾아내서 이름 수집하기
_.go(users,
  L.filter(user => user.age < 20),
  L.map(v => v.name),
  L.take(2),
  console.log);
// ["ID", "HA"]
// 3번만 반복
```

### L.strict

`L.strict`를 이용하여 지연 평가를 동작시킬 것인가를 동적으로 변경할 수 있습니다.

##### 숫자로 하기:
```javascript
var strict_or_lazy1 = __(
  _.range,
  L.strict(100),
  L.map(v => v * v),
  L.filter(v => !!(v % 2)),
  L.take(10),
  console.log);

strict_or_lazy1(50);
// [1, 9, 25, 49, 81, 121, 169, 225, 289, 361]
// 50 번 반복 (염격)

strict_or_lazy1(100);
// [1, 9, 25, 49, 81, 121, 169, 225, 289, 361]
// 20 번 반복 (지연)

strict_or_lazy1(15);
// [1, 9, 25, 49, 81, 121, 169]
// 15 번 반복 (엄격)
```

##### 함수로 하기:
```javascript
var strict_or_lazy2 = __(
  _.range,
  L.strict(list => list.length < 100),
  L.map(v => v * v),
  L.filter(v => !!(v % 2)),
  L.take(10),
  console.log);

strict_or_lazy2(50);
// [1, 9, 25, 49, 81, 121, 169, 225, 289, 361]
// 50 번 반복 (염격)

strict_or_lazy2(100);
// [1, 9, 25, 49, 81, 121, 169, 225, 289, 361]
// 20 번 반복 (지연)

strict_or_lazy2(15);
// [1, 9, 25, 49, 81, 121, 169]
// 15 번 반복 (엄격)
```

## Underscore

Partial.js의 15% 정도의 코드는 Underscore.js에서 그대로 가져왔습니다. 우리는 Underscore.js를 만든 개발자들의 코드와 글에서 많은 것을 배웠습니다.

##### 관련 링크:
 - http://underscorejs.org
 - http://documentcloud.github.io/underscore-contrib
 - https://github.com/fogus/lemonad