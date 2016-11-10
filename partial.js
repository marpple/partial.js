// partial.js
// History - lmn.js -> lego.js -> L.js -> abc.js -> partial.js
// Project Lead - Indong Yoo
// Maintainers - Piljung Park, Hanah Choi
// Contributors - Byeongjin Kim, Joeun Ha, Hoonil Kim
// (c) 2015-2016 Marpple. MIT Licensed.
!function(G) {
  var window = typeof window != 'object' ? G : window;
  window._ ? window.__ = _ : window._ = _;
  var ___ = window.___ = ___;

  /* Partial */
  function _(fn) {
    fn = Lambda(fn);
    var args1 = [], args3, len = arguments.length, ___idx = len;
    for (var i = 1; i < len; i++) {
      var arg = arguments[i];
      if (arg == ___ && (___idx = i) && (args3 = [])) continue;
      if (i < ___idx) args1.push(arg);
      else args3.push(arg);
    }
    var f = function() { return fn.apply(this, merge_args(args1, arguments, args3)); };
    f._p_async = fn._p_async;
    f._p_cb = fn._p_cb;
    return f;
  }
  _.partial = _;
  function _to_unde(args1, args2, args3) {
    if (args2) args1 = args1.concat(args2);
    if (args3) args1 = args1.concat(args3);
    for (var i = 0, len = args1.length; i < len; i++) if (args1[i] == _) args1[i] = undefined;
    return args1;
  }
  function merge_args(args1, args2, args3) {
    if (!args2.length) return args3 ? _to_unde(args1, args3) : _to_unde(_.clone(args1));
    var n_args1 = _.clone(args1), args2 = _.to_array(args2), i = -1, len = n_args1.length;
    while (++i < len) if (n_args1[i] == _) n_args1[i] = args2.shift();
    if (!args3) return _to_unde(n_args1, args2.length ? args2 : undefined);
    var n_arg3 = _.clone(args3), i = n_arg3.length;
    while (i--) if (n_arg3[i] == _) n_arg3[i] = args2.pop();
    return args2.length ? _to_unde(n_args1, args2, n_arg3) : _to_unde(n_args1, n_arg3);
  }
  _.right = function() {
    var len = --arguments.length, fn = arguments[len];
    delete arguments[len];
    return fn.apply(this == _ ? null : this, arguments);
  };
  _.righta = function(args, fn) { return fn.apply(this == _ ? null : this, args); };

  /* Pipeline */
  _.pipe = pipe, _.pipec = pipec, _.pipea = pipea, _.pipea2 = pipea2;
  _.mr = mr, _.to_mr = to_mr, _.is_mr = is_mr;
  function pipe(v) {
    var i = 0, f;
    while (f = arguments[++i]) v = (v && v._mr) ? f.apply(undefined, v) : f(v);
    return v;
  }
  function pipec(self, v) {
    var i = 1, f;
    while (f = arguments[++i]) v = (v && v._mr) ? f.apply(self, v) : f.call(self, v);
    return v;
  }
  function pipea(self, v, fs) {
    var i = 0, f;
    while (f = fs[i++]) v = (v && v._mr) ? f.apply(self, v) : f.call(self, v);
    return v;
  }
  function pipea2(v, fs) {
    var i = 0, f;
    while (f = fs[i++]) v = (v && v._mr) ? f.apply(undefined, v) : f(v);
    return v;
  }
  function mr() {
    arguments._mr = true;
    return arguments;
    //var args = _.toArray(arguments);
    //args._mr = true;
    //return args;
  }
  function to_mr(args) {
    //if (args.length < 2) return args;
    args._mr = true;
    return args;
  }
  function is_mr(v) { return v && v._mr; }

  _.Pipe = function() {
    var fs = arguments;
    return function() {
      return this == undefined ? pipea2(to_mr(arguments), fs) : pipea(this, to_mr(arguments), fs);
    }
  };

  _.Indent = function() {
    var fs = arguments;
    return function() { return pipea(ithis(this, arguments), to_mr(arguments), fs); }
  };
  function ithis(self, args) { return { parent: self, args: args }; }

  // _.Tap = function() {
    // var fns = C.toArray(arguments);
    // return function() { return A(arguments, fns.concat([J(arguments), to_mr]), this); };
  // };

  _.Tap = function(func) {
    return function(arg) {
      if (arguments.length > 1) {
        func.apply(null, _.to_mr(arguments));
        return _.to_mr(arguments);
      }
      func(arg);
      return arg;
    }
  };

  // B.boomerang = function() { // fork
  //   var fns = arguments;
  //   return _.async.jcb(function(res, cb) {
  //     cb(res);
  //     A([res], fns, this);
  //   });
  // };
  // B.delay = function(time) {
  //   return CB(function() {
  //     var args = arguments, cb = args[args.length-1];
  //     args.length = args.length - 1;
  //     setTimeout(function() { cb.apply(null, args); }, time || 0);
  //   });
  // };

  _.Err = function() {};
  // function isERR(err) {
  //   err = is_mr(err) ? err[0] : err;
  //   return err && err.constructor == Error && err._ABC_is_err;
  // }


  _.async = function() {
    var fs = arguments;
    var f = function() {
      return this == undefined ? _.async.pipea2(to_mr(arguments), fs) : _.async.pipea(this, to_mr(arguments), fs);
    };
    f._p_async = true;
    return f;
  };
  _.async.Pipe = _.async;
  _.async.Indent = function() {
    var fs = arguments;
    var f = function() { return _.async.pipea(ithis(this, arguments), to_mr(arguments), fs); };
    f._p_async = true;
    return f;
  };
  _.async.pipe = function (v) {
    return async_pipe(void 0, v, arguments, 1);
  };
  _.async.pipec = function(self, v) {
    return async_pipe(self, v, arguments, 2);
  };
  _.async.pipea = function(self, v, fs) {
    return async_pipe(self, v, fs, 0);
  };
  _.async.pipea2 = function(v, fs) {
    return async_pipe(void 0, v, fs, 0);
  };
  _.cb = _.callback = _.async.callback = _.async.cb = function(f) {
    f._p_cb = true;
    return f;
  };
  _.async.jcb = function(f) {
    f._p_jcb = true;
    return f;
  };


  function has_promise() { return has_promise.__cache || (has_promise.__cache = !!_.val(window, 'Promise.prototype.then')); }
  function maybe_promise(res) { return _.isObject(res) && res.then && _.isFunction(res.then); }
  function unpack_promise(res, callback) {
    var is_r = is_mr(res);
    return (function u(i, res, length, has_promise) {
      if (i == length) {
        has_promise && callback(is_r ? res : res[0]);
        return;
      }
      return maybe_promise(res[i]) && (has_promise = true) ? (function(i) {
        res[i].then(function(v) {
          res[i] = v;
          u(i + 1, res, length, has_promise);
        });
        return true;
      })(i) : u(i + 1, res, length, has_promise);
    })(0, (res = is_r ? res : [res]), res.length, false);
  }
  function async_pipe(self, v, args, i) {
    var args_len = args.length, promise = null, resolve = null;
    function cp() { return has_promise() ? new Promise(function(rs) { resolve = rs; }) : { then: function(rs) { resolve = rs; } } }
    return (function c(res) {
      do {
        if (i === args_len) return !promise ? res : resolve ? resolve(fpro(res)) : setTimeout(function() { resolve && resolve(fpro(res)); }, 0);
        if (unpack_promise(res, c)) return promise || (promise = cp());
        if (!args[i]._p_cb && !args[i]._p_jcb) res = is_mr(res) ? _.Lambda(args[i++]).apply(self, res) : _.Lambda(args[i++]).call(self, res);
        else if (!args[i]._p_cb) is_mr(res) ?
          _.Lambda(args[i++]).apply(self, (res[res.length++] = function() { res = to_mr(arguments); }) && res) :
          _.Lambda(args[i++]).call(self, res, function() { res = to_mr(arguments); });
      } while (i == args_len || i < args_len && !args[i]._p_cb);
      if ((promise || (promise = cp())) && unpack_promise(res, c)) return promise;
      is_mr(res) ?
        _.Lambda(args[i++]).apply(self, (res[res.length++] = function() { c(to_mr(arguments)); }) && res) :
        _.Lambda(args[i++]).call(self, res, function() { c(to_mr(arguments)); });
      return promise;
    })(v);
  }

  function fpro(res) { return is_mr(res) && res.length == 1 ? res[0] : res; }

  _.async.pipe = function (v) {
    return async_pipe(void 0, v, arguments, 1);
  };

  //_.async.pipe(100, _.cb(function(v, cb){
  //  setTimeout(function() {
  //    cb(v+11111111);
  //  }, 1000)
  //})).then(function(res) { console.log("결과는 ", res) });




  function Iter(iter, args, rnum) {
    for (var args2 = [], i = 0, l = args.length; i < l; i++) args2[i+rnum] = args[i];
    if (iter._p_cb) args2.length++;
    var f = function() {
      args2[0] = arguments[0];
      args2[1] = arguments[1];
      if (rnum === 3) args2[2] = arguments[2];
      if (iter._p_cb) args2[args2.length-1] = arguments[arguments.length-1];
      return iter.apply(null, args2);
    };
    f._p_async = iter._p_async, f._p_cb = iter._p_cb;
    return f;
  }



  _.async.reduce = function(data, iteratee, memo, limiter) {
    //if (this != G) {                         //요기 _를 _.async로 바꿨음
    //  iteratee = iteratee.bind(this);
    //  if (_.isFunction(limiter)) limiter = limiter.bind(this);
    //}

    if (_.is_mr(data)) {
      iteratee = Iter(iteratee, data, 3);
      if (_.isFunction(limiter)) limiter = Iter(limiter, data, 3);
      data = data[0];
    }

    var i = -1, keys = _.isArrayLike(data) ? null : _.keys(data);
    memo = (arguments.length > 2) ? memo : data[keys ? keys[++i] : ++i];

    return (function f(i, memo) {
      if (++i == (keys || data).length) return memo;
      var args = keys ? _.mr(memo, data[keys[i]], keys[i], data) : _.mr(memo, data[i], i, data);

      //console.log(data);
      if (limiter == 0 || _.isEmpty(data)) {
        console.log("짠!!!");
        return { then : function(f) { return f(memo); } }; // 이렇게해두 되나
      }

      return _.async.pipe(args, iteratee).then(function(res) {
        args[0] = res; // iter 직후, limiter에서의 memo를 갱신시켜서 보내줘야 함
        return (_.isFunction(limiter) ? limiter.apply(null, args) : limiter == i+1) ? res : f(i, res); // f가 res를 안받아도 되나?
      });



    })(i, memo);

  };







  // memo 필요없는 애들 공통 limiter
  function _limiter(limiter) {
    if (!_.isFunction(limiter)) return limiter;
    return function() {
      return limiter.apply(null, _.rest(arguments));
    }
  }


  /* async, each */
  _.async.each = function(data, iteratee, limiter) {
    //var memo = null;
    var memo = _.is_mr(data) ? data[0] : data; // 구리다 고치고싶다
    var new_iter = _.cb(each_iter(iteratee));
    return (arguments.length > 2) ? _.async.reduce(data, new_iter, memo, _limiter(limiter)) : _.async.reduce(data, new_iter, memo);
  };

  function each_iter(iteratee) {
    return function(m, v, k, l) {
      console.log("===================");
      var cb = _.last(arguments);
      var args = _.initial(_.rest(arguments));
      args.push(function() { cb(l); }); // 두줄 pipe로 어떻게 합칠 수 있낭..
      return _.async.pipe(_.to_mr(args), iteratee);
    }
  }



  /* async, map */
  _.async.map = function(data, iteratee, limiter) { // map은 안뱉어도 undefined 들어감
    var memo = [];
    var new_iter = _.cb(map_iter(iteratee));
    return (arguments.length > 2) ? _.async.reduce(data, new_iter, memo, _limiter(limiter)) : _.async.reduce(data, new_iter, memo);
  };

  function map_iter(iteratee) {
    return function(m) {
      console.log("===================");
      var cb = _.last(arguments);
      var args = _.initial(_.rest(arguments));
      args.push(function(res) { m.push(res); cb(m); });
      return _.async.pipe(_.to_mr(args), iteratee);
    }
  }


  /* async, filter */
  _.async.filter = function(data, iteratee, limiter) {
    var memo = [];
    var new_iter = _.cb(filter_iter(iteratee));
    return (arguments.length > 2) ? _.async.reduce(data, new_iter, memo, _limiter(limiter)) : _.async.reduce(data, new_iter, memo);
  };

  function filter_iter(iteratee) {
    return function(m, v) {
      console.log("===================");
      var cb = _.last(arguments);
      var args = _.initial(_.rest(arguments));
      args.push(function(res) { if (res) m.push(v); cb(m); });
      return _.async.pipe(_.to_mr(args), iteratee);
    }
  }


  /* async, reject */
  _.async.reject = function(data, iteratee, limiter) {
    var memo = [];
    var new_iter = _.cb(reject_iter(iteratee));
    return (arguments.length > 2) ? _.async.reduce(data, new_iter, memo, _limiter(limiter)) : _.async.reduce(data, new_iter, memo);
  };

  function reject_iter(iteratee) {
    return function(m, v) {
      console.log("===================");
      var cb = _.last(arguments);
      var args = _.initial(_.rest(arguments));
      args.push(function(res) { if (!res) m.push(v); cb(m); }); // res랑  m이랑 똑같은값 아님????
      return _.async.pipe(_.to_mr(args), iteratee);
    }
  }




  // limiter도 비동기여야 하는가.........

  // 끝까지 못찾을 경우 undefined
  /* async, find */
  _.async.find = function(data, iteratee) { // 얘는 limiter가 없음. 나중에 합칠꺼니까 이름 일단 iteratee로.
    var memo = undefined;
    var new_iter = _.cb(find_iter(iteratee));
    return _.async.reduce(data, new_iter, memo,
      function(m) {
        if (m !== undefined) return true;
      });
  };

  function find_iter(iteratee) {
    return function(m, v) {
      var cb = _.last(arguments);
      var args = _.initial(_.rest(arguments));
      args.push(function(res) { cb(res ? v : undefined); }); // 그럼 찾고자 하는 v가 undefined 일 때..
      // 결과는 맞아보이게 나오는데, 찾아서 undefined가 나온게 아니라 못찾아서 undefined가 나온 것
      // undefined 찾아도 끝까지 다 돔.
      return _.async.pipe(_.to_mr(args), iteratee);
    }
  }




  // 끝까지 true일 경우 true // return 값이 falsy값이어도 false로 취급 !!!!!!!!!!!!
  // falsy값 잘 조사 = null

  /* async, every */
  _.async.every = function(data, iteratee) {
    var memo = true;
    var new_iter = _.cb(every_iter(iteratee));
    return _.async.reduce(data, new_iter, memo,
      function(m) {
        return m == false;
      })
  };

  function every_iter(iteratee) {
    return function(m, v) {
      var cb = _.last(arguments);
      var args = _.initial(_.rest(arguments));
      args.push(function(res) { cb(res); });
      return _.async.pipe(_.to_mr(args), iteratee);
    }
  }



  // 끝까지 못찾을 경우 false
  /* async, some */
  _.async.some = function(data, iteratee) {
    var memo = false;
    var new_iter = _.cb(some_iter(iteratee));
    return _.async.reduce(data, new_iter, memo,
      function(m) {
        return m == true;
      })
  };
  function some_iter(iteratee) {
    return function(m, v) {
      var cb = _.last(arguments);
      var args = _.initial(_.rest(arguments));
      args.push(function(res) { cb(res); });
      return _.async.pipe(_.to_mr(args), iteratee);
    }
  }






  /* Ice cream */
  _.noop = function() {};
  _.this = function() { return this; };
  _.i = _.identity = function(v) { return v; };
  _.args0 = _.identity;
  _.args1 = function() { return arguments[1]; };
  _.args2 = function() { return arguments[2]; };
  _.args3 = function() { return arguments[3]; };
  _.args4 = function() { return arguments[4]; };
  _.args5 = function() { return arguments[5]; };
  _.Always = _.always = _.constant = function(v) { return function() { return v; }; };
  _.true = _.Always(true);
  _.false = _.Always(false);
  _.null = _.Always(null);
  _.not = function(v) { return !v; };
  _.nnot = function(v) { return !!v; };
  _.log = window.console && window.console.log ? console.log.bind ? console.log.bind(console) : function() { console.log.apply(console, arguments); } : _.i;
  _.loge = window.console && window.console.error ? console.error.bind ? console.error.bind(console) : function() { console.error.apply(console, arguments); } : _.i;
  _.Hi = _.Tap(_.log);

  _.f = function(nodes) {
    var f = _.val(G, nodes);
    var err = Error('warning: ' + nodes + ' is not defined');
    return f || setTimeout(function() { (f = f || _.val(G, nodes)) || _.loge(err) }, 500)
      && function() { return (f || (f = _.val(G, nodes))).apply(this, arguments); }
  };
  _.val = function(obj, key, keys) {
    return (function v(obj, i, keys, li) {
      return (obj = obj[keys[i]]) ? li == i ? obj : v(obj, i + 1, keys, li) : li == i ? obj : void 0;
    })(obj, 0, keys = key.split('.'), keys.length - 1);
  };

  // <respect _>
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is_' + name.toLowerCase()] = _['is' + name] = function(obj) { return Object.prototype.toString.call(obj) === '[object ' + name + ']'; }
  });
  if (typeof /./ != 'function' && typeof Int8Array != 'object') _.isFunction = function(obj) { return typeof obj == 'function' || false; };
  _.is_object = _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };
  _.has = function(obj, key) {
    return obj != null && obj.hasOwnProperty(key);
  };
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  _.is_array_like = _.isArrayLike = function(collection) {
    var length = collection && collection.length;
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };
  var slice = Array.prototype.slice;
  _.rest = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };
  _.values = function(obj) {
    var keys = _.keys(obj), length = keys.length, values = Array(length);
    for (var i = 0; i < length; i++) values[i] = obj[keys[i]];
    return values;
  };
  _.toArray = _.to_array = _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    return _.values(obj);
  };
  _.object = function(list, values) {
    for (var result = {}, i = 0, length = list.length; i < length; i++) {
      if (values) result[list[i]] = values[i];
      else result[list[i][0]] = list[i][1];
    }
    return result;
  };

  var _keys = function(obj) { return _.isObject(obj) ? Object.keys(obj) : []; };
  var _invert = function(obj) {
    var keys = _keys(obj), l = keys.length, res = {};
    for (var i = 0; i < l; i++) res[obj[keys[i]]] = keys[i]
    return res;
  };

  var escapeMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '`': '&#x60;' };
  var unescapeMap = _invert(escapeMap);

  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    var source = '(?:' + _keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  var idCounter = 0;
  _.unique_id = _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };
  _.clone = function(obj) { return !_.isObject(obj) ? obj : _.isArray(obj) ? obj.slice() : _.extend({}, obj); };
  // </respect _>

  function each(list, iter, start) {
    if (!list) return list;
    for (var i = start || 0, length = list.length; i < length ;i++) iter(list[i], i, list);
    return list;
  }
  function map(list, iter) {
    if (!list) return [];
    for (var l2 = [], i = 0, length = list.length; i < length ;i++) l2.push(iter(list[i], i, list));
    return l2;
  }
  //function times(len, func) { for (var i = 0; i < len; i++) func(i); }
  function times2(len, func) { for (var i = 1; i <= len; i++) func(i); }

  /* is Series */
  _.is_array = _.isArray = Array.isArray;
  _.is_match = _.isMatch = function(obj, attrs) {
    var keys = _.keys(attrs);
    for (var i = 0, l = keys.length, key; i < l && (key = keys[i]); i++) {
      if (obj[key] !== attrs[key]) return false;
    }
    return true;
  };

  _.is_empty = _.isEmpty = function(obj) { return !(obj && obj.length) };
  _.is_arguments = _.isArguments = function(obj) { return !!(obj && obj.callee) };
  _.is_element = _.isElement = function(obj) { return !!(obj && obj.nodeType === 1) };
  _.is_equal = _.isEqual = function(a, b) {
    if (a.length !== b.length || a.constructor !== b.constructor) return false;
    if (_.isArray(a) || _.isArguments(a)) {
      for (var i = 0, l = a.length; i < l; i++) { if (a[i] !== b[i]) return false; }
      return true;
    }
    if (typeof a === 'object') {
      return !_.find(a, function(value, key) {
        if (_.isArrayLike(value) || _.isObject(value)) { return !_.isEqual(value, b[key]); }
        return value !== b[key];
      });
    }
    return a === b;
  };

  _.keys = _keys;
  _.wrapArray = _.wrap_arr = function(v) { return _.isArray(v) ? v : [v]; };
  _.parseInt = _.parse_int = function(v) { return parseInt(v, 10); };
  try { var has_lambda = true; eval('a=>a'); } catch (err) { var has_lambda = false; }
  function Lambda(str) {
    if (typeof str !== 'string') return str;
    if (Lambda[str]) return Lambda[str];
    if (!str.match(/=>/)) return Lambda[str] = new Function('$', 'return (' + str + ')');
    if (has_lambda) return Lambda[str] = eval(str); // es6 lambda
    var ex_par = str.split(/\s*=>\s*/);
    return Lambda[str] = new Function(
      ex_par[0].replace(/(?:\b[A-Z]|\.[a-zA-Z_$])[a-zA-Z_$\d]*|[a-zA-Z_$][a-zA-Z_$\d]*\s*:|this|arguments|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/g, '').match(/([a-z_$][a-z_$\d]*)/gi) || [],
      'return (' + ex_par[1] + ')');
  }
  _.Lambda = Lambda;
  function bexdf(setter, obj1/* objs... */) {
    for (var i = 2, len = arguments.length; i < len; i++) setter(obj1, arguments[i]);
    return obj1;
  }
  function setter(r, s) { for (var key in s) r[key] = s[key]; }
  function dsetter(r, s) { for (var key in s) if (!_.has(r, key)) r[key] = s[key]; }
  _.extend = function() { return bexdf.apply(null, [setter].concat(_.toArray(arguments))); };
  _.defaults = function() { return bexdf.apply(null, [dsetter].concat(_.toArray(arguments))); };

  function flat(new_arr, arr, noDeep, start) {
    each(arr, function(v) {
      if (!_.isArrayLike(v) || (!_.isArray(v) && !_.isArguments(v))) return new_arr.push(v);
      noDeep ? each(v, function(v) { new_arr.push(v); }) : flat(new_arr, v, noDeep);
    }, start);
    return new_arr;
  }
  _.flatten = function (arr, noDeep, start) { return flat([], arr, noDeep, start); };
  _.method = function(obj, method) { return obj[method].apply(obj, _.rest(arguments, 2)); };

  /* mutable */
  _.set = function(obj, key, valueOrFunc) {
    if (!_.isFunction(valueOrFunc)) return _.mr(obj[key] = valueOrFunc, key, obj);
    return _.async.pipe(_.mr(obj, key), valueOrFunc, function(_value) { return _.mr(obj[key] = _value, key, obj) });
  };
  _.unset = function(obj, key) { var val = obj[key]; delete obj[key]; return _.mr(val, key, obj); };
  _.remove = function(arr, remove) { return _.mr(remove, _.removeByIndex(arr, arr.indexOf(remove)), arr); };
  _.pop = function(arr) { return _.mr(arr.pop(), arr.length, arr); };
  _.shift = function(arr) { return _.mr(arr.shift(), 0, arr); };
  _.push = function(arr, itemOrFunc) {
    if (!_.isFunction(itemOrFunc)) return _.mr(itemOrFunc, arr.push(itemOrFunc), arr);
    return _.async.pipe(arr, itemOrFunc, function(_item) { return _.mr(_item, arr.push(_item), arr); });
  };
  _.unshift = function(arr, itemOrFunc) {
    if (!_.isFunction(itemOrFunc)) return _.mr(itemOrFunc, arr.unshift(itemOrFunc), arr);
    return _.async.pipe(arr, itemOrFunc, function(_item) { return _.mr(_item, arr.unshift(_item), arr); });
  };
  _.removeByIndex = function(arr, from) {
    if (from !== -1) {
      var rest = arr.slice(from + 1 || arr.length);
      arr.length = from;
      arr.push.apply(arr, rest);
    }
    return from;
  };

  /* mutable/immutable with selector */
  _.sel = _.select = _.extend(function(start, selector) {
    return _.reduce(selector.split(/\s*->\s*/), function (mem, key) {
      return !key.match(/^\((.+)\)/) ? !key.match(/\[(.*)\]/) ? mem[key] : function(mem, numbers) {
        if (numbers.length > 2 || numbers.length < 1 || _.filter(numbers, function(v) { return isNaN(v); }).length) return _.Err('[] selector in [num] or [num ~ num]');
        var s = numbers[0], e = numbers[1]; return !e ? mem[s<0 ? mem.length+s : s] : slice.call(mem, s<0 ? mem.length+s : s, e<0 ? mem.length+e : e + 1);
      }(mem, _.map(RegExp.$1.replace(/\s/g, '').split('~'), _.parseInt)) : _.find(mem, _.Lambda(RegExp.$1));
    }, start);
  }, {
    set: function(start, selector, value) {
      var _arr = selector.split(/\s*->\s*/), last = _arr.length - 1;
      return _.to_mr([start].concat(_.set(_arr.length == 1 ? start : _.sel(start, _arr.slice(0, last).join('->')), _arr[last], value)));
    },
    unset: function(start, selector) {
      var _arr = selector.split(/\s*->\s*/), last = _arr.length - 1;
      return _.to_mr([start].concat(_.unset(_arr.length == 1 ? start : _.sel(start, _arr.slice(0, last).join('->')), _arr[last])));
    },
    remove: function(start, selector, remove) {
      if (remove) return _.to_mr([start].concat(_.remove(_.sel(start, selector), remove)));
      var _arr = selector.split(/\s*->\s*/);
      return _.to_mr([start].concat(_.remove(_.sel(start, _arr.slice(0, _arr.length - 1).join('->')), _.sel(start, selector))));
    },
    extend: function(start, selector/*, objs*/) {
      return _.to_mr([start].concat(_.extend.apply(null, [_.sel(start, selector)].concat(_.toArray(arguments).slice(2, arguments.length)))));
    },
    defaults: function(start, selector/*, objs*/) {
      return _.to_mr([start].concat(_.defaults.apply(null, [_.sel(start, selector)].concat(_.toArray(arguments).slice(2, arguments.length)))));
    },
    pop: function(start, selector) { return _.to_mr([start].concat(_.pop(_.sel(start, selector)))); },
    shift: function(start, selector) { return _.to_mr([start].concat(_.shift(_.sel(start, selector)))); },
    push: function(start, selector, item) { return _.to_mr([start].concat(_.push(_.sel(start, selector), item))); },
    unshift: function(start, selector, item) { return _.to_mr([start].concat(_.unshift(_.sel(start, selector), item))); },
    im: _.extend(function(start, selector) {
      var im_start = _.clone(start);
      return {
        start: im_start,
        selected: _.reduce(selector.split(/\s*->\s*/), im_start, function(clone, key) {
          return !key.match(/^\((.+)\)/) ? /*start*/(!key.match(/\[(.*)\]/) ? clone[key] = _.clone(clone[key]) : function(clone, numbers) {
            if (numbers.length > 2 || numbers.length < 1 || _.filter(numbers, [I, isNaN]).length) return ERR('[] selector in [num] or [num ~ num]');
            var s = numbers[0], e = numbers[1]; return !e ? clone[s] = _.clone(clone[s<0 ? clone.length+s : s]) : function(clone, oris) {
              return each(oris, function(ori) { clone[clone.indexOf(ori)] = _.clone(ori); });
            }(clone, slice.call(clone, s<0 ? clone.length+s : s, e<0 ? clone.length+e : e + 1));
          }(clone, _.map(RegExp.$1.replace(/\s/g, '').split('~'), [I, parseInt])))/*end*/ :
            function(clone, ori) { return clone[clone.indexOf(ori)] = _.clone(ori); } (clone, _.find(clone, _.Lambda(RegExp.$1)))
        })
      };
    }, {
      set: function(start, selector, value) {
        var _arr = selector.split(/\s*->\s*/), last = _arr.length - 1, im = _.sel.im(start, _arr.slice(0, _arr.length == 1 ? void 0 : last).join('->'));
        return _.to_mr([im.start].concat(_.set(_arr.length == 1 ? im.start : im.selected, _arr[last], value)));
      },
      unset: function(start, selector) {
        var _arr = selector.split(/\s*->\s*/), last = _arr.length - 1, im = _.sel.im(start, _arr.slice(0, last).join('->'));
        return _.to_mr([im.start].concat(_.unset(_arr.length == 1 ? im.start : im.selected, _arr[last])));
      },
      remove: function(start, selector, remove) {
        var _arr = selector.split(/\s*->\s*/), im = _.sel.im(start, selector);
        if (remove) return _.to_mr([start].concat(_.remove(im.selected, remove)));
        return _.to_mr([im.start].concat(_.remove(_.sel(im.start, _arr.slice(0, _arr.length - 1).join('->')), im.selected)));
      },
      extend: function(start, selector/*, objs*/) {
        var im = _.sel.im(start, selector);
        return _.to_mr([im.start].concat(_.extend.apply(null, [im.selected].concat(_.toArray(arguments).slice(2, arguments.length)))));
      },
      defaults: function(start, selector/*, objs*/) {
        var im = _.sel.im(start, selector);
        return _.to_mr([im.start].concat(_.defaults.apply(null, [im.selected].concat(_.toArray(arguments).slice(2, arguments.length)))));
      },
      pop: function(start, selector) {
        var im = _.sel.im(start, selector);
        return _.to_mr([im.start].concat(_.pop(im.selected)));
      },
      shift: function(start, selector) {
        var im = _.sel.im(start, selector);
        return _.to_mr([im.start].concat(_.shift(im.selected)));
      },
      push: function(start, selector, item) {
        var im = _.sel.im(start, selector);
        return _.to_mr([im.start].concat(_.push(im.selected, item)));
      },
      unshift: function(start, selector, item) {
        var im = _.sel.im(start, selector);
        return _.to_mr([im.start].concat(_.unshift(im.selected, item)));
      }
    })
  });

  /* Notification, Event */
  !function(_, notices) {
    _.noti = _.Noti = _.notice =  {
      on: on,
      once: _(on, _, _ , _, true),
      off: off,
      emit: emit,
      emitAll: emitAll
    };

    function on(name1, name2, func, is_once) {
      var _notice = notices[name1];
      func.is_once = !!is_once;
      if (!_notice) _notice = notices[name1] = {};
      (_notice[name2] = _notice[name2] || []).push(func);
      return func;
    }

    function off(name1, n2_or_n2s) {
      var _notice = notices[name1];
      if (arguments.length == 1) _.unset(notices, name1);
      else if (_notice && arguments.length == 2) each(_.isString(n2_or_n2s) ? [n2_or_n2s] : n2_or_n2s, _(_.unset, _notice));
    }

    function emitAll(name1, emit_args) {
      var key, _notice = notices[name1];
      if (_notice) for(key in _notice) emit_loop(emit_args, _notice, key);
    }

    function emit(name, keys, emit_args) {
      !function(_notice, keys) {
        if (!_notice) return ;
        if (_.isString(keys)) return emit_loop(emit_args, _notice, keys);
        if (_.isArray(keys)) each(keys, _(emit_loop, emit_args, _notice));
      }(notices[name], _.isFunction(keys) ? keys() : keys);
    }

    function emit_loop(emit_args, _notice, key) {
      _.set(_notice, key, _.reject(_notice[key], function(func) {
        func.apply(null, emit_args);
        return func.is_once;
      }));
    }
  }(_, {});


  _.each = function(data, iteratee, limiter) {
    //if (this != _ && this != G) {
    //  iteratee = iteratee.bind(this);
    //  if (_.isFunction(limiter)) limiter = limiter.bind(this);
    //}
    if (iteratee._p_async || iteratee._p_cb) return _.async.each.apply(null, arguments);

    if (_.is_mr(data)) iteratee = Iter(iteratee, data, 2), limiter = Iter(limiter, data, 2), data = data[0]; // 밑으로

    if (_.isFunction(limiter)) {
      if (_.isArrayLike(data))
        for (var i = 0, l = data.length; i < l; i++) {
          iteratee(data[i], i, data);
          if (limiter(data[i], i, data)) break;
        }
      else
        for (var keys = _.keys(data), i = 0, l = keys.length; i < l; i++) {
          iteratee(data[keys[i]], keys[i], data);
          if (limiter(data[keys[i]], keys[i], data)) break;
        }
    } else {
      if (limiter == 0) return data;
      if (_.isArrayLike(data))
        for (var i = 0, l = limiter || data.length; i < l; i++)
          iteratee(data[i], i, data);
      else
        for (var keys = _.keys(data), i = 0, l = limiter || keys.length; i < l; i++)
          iteratee(data[keys[i]], keys[i], data);
    }
    return data;
  };

  _.map = function(data, iteratee, limiter) {
    //if (this != _ && this != G) {
    //  iteratee = iteratee.bind(this);
    //  if (_.isFunction(limiter)) limiter = limiter.bind(this);
    //}
    if (iteratee._p_async || iteratee._p_cb) return _.async.map.apply(null, arguments);

    if (_.is_mr(data)) iteratee = Iter(iteratee, data, 2), limiter = Iter(limiter, data, 2), data = data[0];
    if (limiter && _.isFunction(limiter)) {
      if (_.isArrayLike(data))
        for (var i = 0, res = [], l = data.length; i < l; i++) {
          res.push(iteratee(data[i], i, data));
          if (limiter(data[i], i, data)) break;
        }
      else
        for (var i = 0, res = [], keys = _.keys(data), l = keys.length; i < l; i++) {
          res.push(iteratee(data[keys[i]], keys[i], data));
          if (limiter(data[keys[i]], keys[i], data)) break;
        }
    } else {
      if (limiter == 0) return [];
      if (_.isArrayLike(data))
        for (var i = 0, l = limiter || data.length, res = Array(l); i < l; i++)
          res[i] = iteratee(data[i], i, data);
      else
        for (var i = 0, keys = _.keys(data), l = limiter || keys.length, res = Array(l); i < l; i++)
          res[i] = iteratee(data[keys[i]], keys[i], data);
    }
    return res;
  };



  _.reduce = function(data, iteratee, memo, limiter) {
    if (iteratee._p_async || iteratee._p_cb) return _.async.reduce.apply(this, arguments);

    //if (this != _ && this != G) {
    //  iteratee = iteratee.bind(this);
    //  if (_.isFunction(limiter)) limiter = limiter.bind(this);
    //}

    if (_.is_mr(data)) {
      iteratee = Iter(iteratee, data, 3);
      if (_.isFunction(limiter)) limiter = Iter(limiter, data, 3);
      data = data[0];
    }

    if (limiter && _.isFunction(limiter)) {
      if (_.isArrayLike(data))
        for (var i = 0, res = (arguments.length > 2 ? memo : data[i++]), l = data.length; i < l; i++) {
          res = iteratee(res, data[i], i, data);
          if (limiter(res, data[i], i, data)) break;
        }
      else
        for (var i = 0, keys = _.keys(data), res = (arguments.length > 2 ? memo : data[keys[i++]]), l = keys.length; i < l; i++) {
          res = iteratee(res, data[keys[i]], i, data);
          if (limiter(res, data[keys[i]], keys[i], data)) break;
        }
    } else {
      if (limiter == 0) return void 0;
      if (_.isArrayLike(data))
        for (var i = 0, res = (arguments.length > 2 ? memo : data[i++]), l = limiter || data.length; i < l; i++)
          res = iteratee(res, data[i], i, data);
      else
        for (var i = 0, keys = _.keys(data), res = (arguments.length > 2 ? memo : data[keys[i++]]), l = limiter || keys.length; i < l; i++)
          res = iteratee(res, data[keys[i]], i, data);
    }
    return res;
  };

  _.reduceRight = _.reduce_right = function(data, iteratee, memo, limiter) {
    if (_.is_mr(data)) { iteratee = Iter(iteratee, data, 3); data = data[0]; }

    if (limiter && _.isFunction(limiter)) {
      if (_.isArrayLike(data))
        for (var i = data.length - 1, res = (arguments.length > 2 ? memo : data[i--]); i >= 0; i--) {
          res = iteratee(res, data[i], i, data);
          if (limiter(res, data[i], i, data)) break;
        }
      else
        for (var keys = _.keys(data), i = keys.length - 1, res = (arguments.length > 2 ? memo : data[keys[i--]]); i >= 0; i--) {
          res = iteratee(res, data[keys[i]], i, data);
          if (limiter(res, data[keys[i]], keys[i], data)) break;
        }
    } else {
      if (limiter == 0) return void 0;
      if (_.isArrayLike(data))
        for (var i = data.length - 1, res = (arguments.length > 2 ? memo : data[i--]), end = (data.length - limiter) || 0; i >= end; i--)
          res = iteratee(res, data[i], i, data);
      else
        for (var keys = _.keys(data), i = keys.length - 1, res = (arguments.length > 2 ? memo : data[keys[i--]]), end = (data.length - limiter) || 0; i >= end; i--)
          res = iteratee(res, data[keys[i]], i, data);
    }
    return res;
  };

  _.find = function(data, predicate) { // find에는 limiter가 없다.
    //if (this != _ && this != G) {
    //  iteratee = iteratee.bind(this);
    //  if (_.isFunction(limiter)) limiter = limiter.bind(this);
    //}
    if (predicate._p_async || predicate._p_cb) return _.async.find.apply(null, arguments);

    if (_.is_mr(data)) { predicate = Iter(predicate, data, 2); data = data[0]; }

    if (_.isArrayLike(data)) {
      for (var i = 0, l = data.length; i < l; i++)
        if (predicate(data[i], i, data)) return data[i];
    } else {
      for (var keys = _.keys(data), i = 0, l = keys.length; i < l; i++)
        if (predicate(data[keys[i]], keys[i], data)) return data[keys[i]];
    }
  };

  _.filter = function(data, predicate, limiter) {
    //if (this != _ && this != G) {
    //  iteratee = iteratee.bind(this);
    //  if (_.isFunction(limiter)) limiter = limiter.bind(this);
    //}
    if (iteratee._p_async || iteratee._p_cb) return _.async.filter.apply(null, arguments);

    if (_.is_mr(data)) { predicate = Iter(predicate, data, 2); data = data[0]; }

    if (!limiter) {
      if (_.isArrayLike(data))
        for (var i = 0, res = [], l = data.length; i < l; i++) {
          if (predicate(data[i], i, data)) res.push(data[i]);
        }
      else
        for (var keys = _.keys(data), i = 0, res = [], l = keys.length; i < l; i++) {
          if (predicate(data[keys[i]], keys[i], data)) res.push(data[keys[i]]);
        }
    } else if (_.isFunction(limiter)) {
      if (_.isArrayLike(data)) {
        for (var i = 0, res = [], l = data.length; i < l; i++) {
          if (predicate(data[i], i, data)) res.push(data[i]);
          if (limiter(res, data[i], i, data)) break;
        }
      }
      else
        for (var i = 0, res = [], keys = _.keys(data), l = keys.length; i < l; i++) {
          if (predicate(data[keys[i]], keys[i], data)) res.push(data[keys[i]]);
          if (limiter(res, data[keys[i]], keys[i], data)) break;
        }
    } else {
      if (limiter == 0) return [];
      if (_.isArrayLike(data))
        for (var i = 0, res = [], l = data.length; i < l; i++) {
          if (predicate(data[i], i, data)) res.push(data[i]);
          if (res.length == limiter) break;
        }
      else
        for (var keys = _.keys(data), i = 0, res = [], l = keys.length; i < l; i++) {
          if (predicate(data[keys[i]], keys[i], data)) res.push(data[keys[i]]);
          if (res.length == limiter) break;
        }
    }
    return res;
  };

  _.where = function(list, attrs) { return _.filter(list, function(obj) { return _.is_match(obj, attrs) })};

  _.findWhere = _.find_where = function(list, attrs) { return _.find(list, function(obj) { return _.is_match(obj, attrs) }); };

  _.reject = function(data, predicate, limiter) {
    //if (this != _ && this != G) {
    //  iteratee = iteratee.bind(this);
    //  if (_.isFunction(limiter)) limiter = limiter.bind(this);
    //}
    if (iteratee._p_async || iteratee._p_cb) return _.async.reject.apply(null, arguments);

    if (_.is_mr(data)) { predicate = Iter(predicate, data, 2); data = data[0]; }

    if (!limiter) {
      if (_.isArrayLike(data))
        for (var i = 0, res = [], l = data.length; i < l; i++) {
          if (!predicate(data[i], i, data)) res.push(data[i]);
        }
      else
        for (var keys = _.keys(data), i = 0, res = [], l = keys.length; i < l; i++) {
          if (!predicate(data[keys[i]], keys[i], data)) res.push(data[keys[i]]);
        }
    } else if (_.isFunction(limiter)) {
      if (_.isArrayLike(data))
        for (var i = 0, res = [], l = data.length; i < l; i++) {
          if (!predicate(data[i], i, data)) res.push(data[i]);
          if (limiter(res, data[i], i, data)) break;
        }
      else
        for (var i = 0, res = [], keys = _.keys(data), l = keys.length; i < l; i++) {
          if (!predicate(data[keys[i]], keys[i], data)) res.push(data[keys[i]]);
          if (limiter(res, data[keys[i]], keys[i], data)) break;
        }
    } else {
      if (limiter == 0) return [];
      if (_.isArrayLike(data))
        for (var i = 0, res = [], l = data.length; i < l; i++) {
          if (!predicate(data[i], i, data)) res.push(data[i]);
          if (res.length == limiter) break;
        }
      else
        for (var keys = _.keys(data), i = 0, res = [], l = keys.length; i < l; i++) {
          if (!predicate(data[keys[i]], keys[i], data)) res.push(data[keys[i]]);
          if (res.length == limiter) break;
        }
    }
    return res;
  };

  _.every = function(data, predicate) {
    //if (this != _ && this != G) {
    //  iteratee = iteratee.bind(this);
    //  if (_.isFunction(limiter)) limiter = limiter.bind(this);
    //}
    if (iteratee._p_async || iteratee._p_cb) return _.async.every.apply(null, arguments);

    if (_.is_mr(data)) { predicate = Iter(predicate, data, 2); data = data[0]; }
    if (_.isArrayLike(data)) {
      for (var i = 0, l = data.length; i < l; i++)
        if (!predicate(data[i], i, data)) return false;
    } else {
      for (var keys = _.keys(data), i = 0, l = keys.length; i < l; i++)
        if (!predicate(data[keys[i]], keys[i], data)) return false;
    }
    return true;
  };

  _.some = function(data, predicate) {
    //if (this != _ && this != G) {
    //  iteratee = iteratee.bind(this);
    //  if (_.isFunction(limiter)) limiter = limiter.bind(this);
    //}
    if (iteratee._p_async || iteratee._p_cb) return _.async.some.apply(null, arguments);

    if (_.is_mr(data)) { predicate = Iter(predicate, data, 2); data = data[0]; }
    if (_.isArrayLike(data)) {
      for (var i = 0, l = data.length; i < l; i++)
        if (predicate(data[i], i, data)) return true;
    } else {
      for (var keys = _.keys(data), i = 0, l = keys.length; i < l; i++)
        if (predicate(data[keys[i]], keys[i], data)) return true;
    }
    return false;
  };

  _.contains = function(data, value, fromIndex) {
    if (typeof fromIndex == 'number') data = _.rest(data, fromIndex);
    if (_.isArrayLike(data)) return data.indexOf(value) !== -1;
    else return _.isMatch(data, value);
  };

  _.invoke = function(data, method) {
    var args = _.rest(arguments, 2), isFunc = _.isFunction(method);
    return _.map(data, function(value) {
      var func = isFunc ? method : value[method];
      return func && func.apply(value, args);
    });
  };

  _.pluck = function(data, key) { return _.map(data, _(_.val, _,key))};

  _.max = function(data, iteratee) {
    if (_.is_mr(data)) { iteratee = Iter(iteratee, data, 2); data = data[0]; }
    var tmp, cmp, res;
    if (_.isArrayLike(data)) {
      if (isNaN(tmp = iteratee(data[0], 0, data))) return -Infinity;
      for (var i = 1, l = data.length; i < l; i++) {
        cmp = iteratee(data[i], i, data);
        if (cmp > tmp) { tmp = cmp; res = data[i]; }
      }
    } else {
      var keys = _.keys(data);
      if (isNaN(tmp = iteratee(data[keys[0]], keys[0], data))) return -Infinity;
      for (var i = 1, l = keys.length; i < l; i++) {
        cmp = iteratee(data[keys[i]], keys[i], data);
        if (cmp > tmp) { tmp = cmp; res = data[keys[i]]; }
      }
    }
    return res;
  };

  _.min = function(data, iteratee) {
    if (_.is_mr(data)) { iteratee = Iter(iteratee, data, 2); data = data[0]; }
    var tmp, cmp, res;
    if (_.isArrayLike(data)) {
      if (isNaN(tmp = iteratee(data[0], 0, data))) return -Infinity;
      for (var i = 1, l = data.length; i < l; i++) {
        cmp = iteratee(data[i], i, data);
        if (cmp < tmp) { tmp = cmp; res = data[i]; }
      }
    } else {
      var keys = _.keys(data);
      if (isNaN(tmp = iteratee(data[keys[0]], keys[0], data))) return -Infinity;
      for (var i = 1, l = keys.length; i < l; i++) {
        cmp = iteratee(data[keys[i]], keys[i], data);
        if (cmp < tmp) { tmp = cmp; res = data[keys[i]]; }
      }
    }
    return res;
  };

  // <respect _>
  _.sortBy = _.sort_by = function(obj, iteratee) {
    if (_.is_mr(obj)) { iteratee = Iter(iteratee, obj, 2); obj = obj[0]; }
    return _.pluck(_.map(obj, function(value, index, list) {
      return { value: value, index: index, criteria: iteratee(value, index, list) };
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };
  // </respect _>

  _.groupBy = _.group_by = function(data, iteratee) {
    if (_.isString(iteratee)) iteratee = _(_.val, _, iteratee);
    var res = {}, arr = _.map(data, iteratee);
    for (var i = 0, l = arr.length; i < l ; i++) { _.has(res, arr[i]) ? res[arr[i]].push(data[i]) : (res[arr[i]] = [data[i]]) }
    return res;
  };

  _.indexBy = _.index_by = function(data, iteratee) {
    if (_.isString(iteratee)) iteratee = _(_.val, _, iteratee);
    var res = {}, arr = _.map(data, iteratee);
    for (var i = 0, l = arr.length; i < l; i++) { res[arr[i]] = data[i]; }
    return res;
  };

  _.countBy = _.count_by = function(data, iteratee) {
    if (_.isString(iteratee)) iteratee = _(_.val, _, iteratee);
    var res = {}, arr = _.map(data, iteratee);
    for (var i = 0, l = arr.length; i < l; i++) { res[arr[i]]++ || (res[arr[i]] = 1); }
    return res;
  };

  _.shuffle = function(data) {
    var res = [], arr = _.toArray(data); res[0] = arr[0];
    for (var i = 1, l = arr.length, r; i < l; i++) { r = random(0, i); res[i] = res[r]; res[r] = arr[i];  }
    return res;
  };

  function random(start, end) { return Math.floor(Math.random() * (start - end)) + end;  }
  _.random = random;

  _.sample = function(data, num) { return num ? _.shuffle(data).slice(0, num) : _.shuffle(data)[0]; };

  _.size = function(data) { return _.isArrayLike(data) ? data.length : _.values(data).length;  };

  _.partition = function(arr, predicate) {
    if (_.is_mr(arr)) { predicate = Iter(predicate, arr, 2); arr = arr[0]; }
    var filter = [], reject = [];
    _.each(arr, function(v, k, l) { (predicate(v, k, l) ? filter : reject).push(v); });
    return [filter, reject];
  };

  /* Arrays */
  _.first = _.head = _.take = function(ary, n, guard) {
    if (ary == null) return void 0;
    if (n == null || guard) return ary[0];
    return _.initial(ary, ary.length - n);
  };

  _.initial = function(ary, n, guard) { return slice.call(ary, 0, Math.max(0, ary.length - (n == null || guard ? 1 : n))); };

  _.last = function(ary, n, guard) {
    if (ary == null) return void 0;
    if (n == null || guard) return ary[ary.length - 1];
    return _.rest(ary, Math.max(0, ary.length - n));
  };

  _.compact = function(ary) { return _.filter(ary, _.identity); };
  // _.flatten
  _.without = function(ary) { return _.difference(ary, slice.call(arguments, 1)); };
  _.union = function() { return _.uniq(flatten(arguments, true, true)); };

  _.intersection = function(ary) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(ary); i < length; i++) {
      var item = ary[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  _.difference = function(ary) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(ary, function (value) {
      return !_.contains(rest, value);
    });
  };

  _.uniq = function(arr, iteratee) {
    var res = [], tmp = [], cmp = iteratee ? _.map(arr, iteratee) : arr;
    for (var i = 0, l = arr.length; i < l; i++)
      if (tmp.indexOf(cmp[i]) == -1) { tmp.push(cmp[i]); res.push(arr[i]); }
    return res;
  };

  _.zip = function() { return _.unzip(arguments); };

  _.unzip = function(ary) {
    var length = ary && _.max(ary, getLength).length || 0, result = Array(length);
    for (var index = 0; index < length; index++) result[index] = _.pluck(ary, index);

    return result;
  };

  var getLength = _(_.val, _, 'length');

  _.object = function(list, values) {
    for (var i = 0, result = {}, length = getLength(list); i < length; i++)
      values ? result[list[i]] = values[i] : result[list[i][0]] = list[i][1];

    return result;
  };

  _.indexOf = _.index_of = function(ary, val) {
    for (var i= 0, l = ary.length; i<l; i++) { if (ary[i] == val) return i; }
    return -1;
  };

  _.lastIndexOf = _.last_index_of = function(ary, val) {
    for (var i = ary.length; i >= 0; i--) { if (ary[i] == val) return i; }
    return -1;
  };

  _.sortedIndex = _.sorted_idx = _.sorted_i = function(ary, obj, iteratee) {
    // Iter 지움
    var value = iteratee(obj);
    var low = 0, high = getLength(ary);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(ary[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  _.find_i = _.find_idx = _.findIndex = function(ary, predicate) {
    if (_.is_mr(ary)) { predicate = Iter(predicate, ary, 2); ary = ary[0]; }
    for (var i = 0, l = ary.length; i < l; i++)
      if (predicate(ary[i], i, ary)) return i;
    return -1;
  };

  _.findLastIndex = _.find_last_idx = _.find_last_i = function(ary, predicate) {
    if (_.is_mr(ary)) { predicate = Iter(predicate, ary, 2); ary = ary[0]; }
    for(var i = ary.length; i >= 0; i--) {
      if (predicate(ary[i], i, ary)) return i;
    }
  };

  _.range = function(start, stop, step) {
    if (stop == null) { stop = start || 0; start = 0; }
    step = step || 1;
    var length = Math.max(Math.ceil((stop - start) / step), 0), range = Array(length);
    for (var idx = 0; idx < length; idx++, start += step) range[idx] = start;

    return range;
  };


  /* Object */
  // _.keys (clear)
  // _.values (clear)

  _.mapObject = _.map_object = function(obj, iteratee) {
    if (_.is_mr(obj)) { iteratee = Iter(iteratee, obj, 2); obj = obj[0]; }
    var res = {};
    for (var keys = _.keys(obj), i = 0, l = keys.length; i < l; i++) {
      res[keys[i]] = iteratee(obj[keys[i]], keys[i], obj);
    }
    return res;
  };

  _.pairs = function(obj) {
    var keys = _.keys(obj), l = keys.length, res = Array(l);
    for (var i = 0; i < l; i++) res[i] = [keys[i], obj[keys[i]]];
    return res;
  };

  _.invert = _invert;

  _.functions = function(obj) {
    var keys = _.keys(obj), res = [];
    for (var i = 0, l = keys.length; i < l; i++) { if (_.isFunction(obj[keys[i]])) res.push(keys[i]); }
    return res;
  };

  _.find_k = _.find_key = _.findKey = function(obj, predicate) {
    if (_.is_mr(obj)) { predicate = Iter(predicate, obj, 2); obj = obj[0]; }
    for (var keys = _.keys(obj), key, i = 0, l = keys.length; i < l; i++)
      if (predicate(obj[key = keys[i]], key, obj)) return key;
  };

  // _.extend (clear)
  // _.defaults (clear)

  _.pick = function(obj, iteratee) {
    var res = {};
    if (_.isString(iteratee)) {
      for (var keys = _.rest(arguments), i = 0, l = keys.length; i < l; i++)
        res[keys[i]] = obj[keys[i]];
    } else {
      if (_.is_mr(obj)) { iteratee = Iter(iteratee, obj, 2); obj = obj[0]; }
      for (var keys = _.keys(obj), i = 0, l = keys.length; i < l; i++)
        if (iteratee(obj[keys[i]], keys[i], obj)) res[keys[i]] = obj[keys[i]];
    }
    return res;
  };

  _.omit = function(obj, iteratee) {
    var res = {};
    if (_.isString(iteratee)) {
      var oKeys = _.keys(obj), keys = _.rest(arguments);
      for (var i = 0, l = oKeys.length; i < l; i++)
        if (keys.indexOf(oKeys[i]) == -1) res[oKeys[i]] = obj[oKeys[i]];
    } else {
      if (_.is_mr(obj)) { iteratee = Iter(iteratee, obj, 2); obj = obj[0]; }
      for (var keys = _.keys(obj), i = 0, l = keys.length; i < l; i++)
        if (!iteratee(obj[keys[i]], keys[i], obj)) res[keys[i]] = obj[keys[i]];
    }
    return res;
  };

  // _.clone (clear)
  // _.has (clear)

  _.all = function(args) {
    var res = [], tmp;
    for (var i = 1, l = arguments.length; i < l; i++) {
      tmp = _.is_mr(args) ? arguments[i].apply(null, args) : arguments[i](args);
      if (_.is_mr(tmp))
        for (var j = 0, l = tmp.length; j < l; j++) res.push(tmp[j]);
      else
        res.push(tmp);
    }
    return _.to_mr(res);
  };

  _.spread = function(args) {
    var fns = _.rest(arguments, 1), res = [], tmp;
    for (var i = 0, fl = fns.length, al = args.length; i < fl && i < al; i++) {
      tmp = _.is_mr(args[i]) ? (fns[i] || _.i).apply(null, args[i]) : (fns[i] || _.i)(args[i]);
      if (_.is_mr(tmp))
        for (var j = 0, l = tmp.length; j < l; j++) res.push(tmp[j]);
      else
        res.push(tmp);
    }
    return _.to_mr(res);
  };


  /* Functions */
  _.memoize = function (func, hasher) {
    var memoize = function (key) {
      var cache = memoize.cache, address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    return memoize.cache = {} && memoize;
  };

  _.delay = function (func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function () {
      return func.apply(null, args);
    }, wait);
  };

  _.defer = _.partial(_.delay, _, 1);

  //_.throttle
  //_.debounce

  _.negate = function (predicate) {
    return function () {
      return !predicate.apply(this, arguments);
    };
  };

  _.after = function (times, func) {
    return function () {
      if (--times < 1) return func.apply(this, arguments);
    };
  };

  _.before = function (times, func) {
    var memo;
    return function () {
      if (--times > 0) memo = func.apply(this, arguments);
      if (times <= 1) func = null;
      return memo;
    };
  };

  _.once = _.partial(_.before, 2);





  // async each - reduce
  // function base_loop_fn(body, end_q, end, complete, iter_or_predi, params) {
  //   var context = this;
  //   var args = C.rest(arguments, 6);
  //   var list = args.shift();
  //   var keys = C.isArrayLike(list) ? null : C.keys(list);
  //   iter_or_predi = iter_or_predi || C.lambda(args.pop());
  //   var fast = !args.length && C.isFunction(iter_or_predi);
  //   if (fast && this != C && this != G) iter_or_predi = iter_or_predi.bind(this);
  //   var length = (keys || list).length;
  //   var result = [], tmp = [];
  //   var resolve = I, async = false;
  //   var go = fast ? function(list, keys, i, res, args, iter_or_predi) {
  //     var key = keys ? keys[i] : i;
  //     return iter_or_predi(list[key], key, list);
  //   } : function(list, keys, i, res, args, iter_or_predi, context) {
  //     return A(params(list, keys, i, res, args), iter_or_predi, context);
  //   };
  //   return (function f(i, res) {
  //     do {
  //       if (end_q(res = body(result, list, keys, i, res, tmp, args))) return resolve(end(list, keys, i));
  //       if (i == length) return resolve(complete(result, list, res));
  //       res = go(list, keys, i++, res, args, iter_or_predi, context);
  //     } while (!maybe_promise(res));
  //     res.then(function(res) { f(i, res); });
  //     return async || C(CB(function(cb) { resolve = cb, async = true; }));
  //   })(0);
  // }



  /* if else */
  // function IF(predicate, fn) {
  //   var store = [fn ? [predicate, fn] : [I, predicate]];
  //   return C.extend(IF, {
  //     ELSEIF: function(predicate, fn) { return store.push(fn ? [predicate, fn] : [I, predicate]) && IF; },
  //     ELSE: function(fn) { return store.push([J(true), fn]) && IF; }
  //   });
  //   function IF() {
  //     var context = this, args = arguments;
  //     return C(store, args, [
  //       B.find(function(fnset, i, l, args) { return A(args, fnset[0], context); }),
  //       function(fnset) { return fnset ? A(args, fnset[1], context) : void 0; }
  //     ]);
  //   }
  // } F.IF = window.IF = IF;


  // TDD
  // C.test = function(tests) {
  //   var fails = J([]), all = J([]), fna = J([fails(), all()]);
  //   return C([J('------------Start------------'), C.log, J(tests),
  //     B.map(function(f, k) {
  //       return IF([all, B.m('push', k + ' ----> success')])
  //         .ELSE([fna, B.map([I, B.m('push', k + ' ----> fail')])])(f());
  //     }),
  //     J('------------Fail-------------'), C.log,
  //     fails, B.each([I, C.error]),
  //     J('------------All--------------'), C.log,
  //     all, B.each([I, C.log]),
  //     J('------------End--------------'), C.log]);
  // };

  /*
  * 템플릿 시작
  * */
  var TAB_SIZE;
  var REG1, REG2, REG3, REG4 = {}, REG5, REG6, REG7, REG8;
  function s_matcher(length, key, re, source, var_names, self) {

    // test
    if (self && self[key]) console.log("self 캐쉬 사용!!!!!!!!!!!!"); // 테스트를 마치면 지워주세요.

    if (self && self[key]) return self[key];
    var res = map(source.match(re), function(matched) {
      return new Function(var_names, "return " + matched.substring(length, matched.length-length) + ";");
    });
    if (self) self[key] = res;
    return res;
  }

  var insert_datas1 = _.partial(s_exec, /\{\{\{.*?\}\}\}/g, _.escape, s_matcher.bind(null, 3, "insert_datas1")); // {{{}}}
  var insert_datas2 = _.partial(s_exec, /\{\{.*?\}\}/g, _.i, s_matcher.bind(null, 2, "insert_datas2")); // {{}}

  var TAB;
  _.TAB_SIZE = function(size) {
    TAB_SIZE = size;
    TAB = "( {" + size + "}|\\t)";
    var TABS = TAB + "+";
    REG1 = new RegExp("^" + TABS);
    REG2 = new RegExp("\/\/" + TABS + ".*?(?=((\/\/)?" + TABS + "))|\/\/" + TABS + ".*", "g");
    REG3 = new RegExp(TABS + "\\S.*?(?=" + TABS + "\\S)|" + TABS + "\\S.*", "g");
    REG4 = {}; times2(20, function(i) { REG4[i] = new RegExp(TAB + "{" + i + "}$") });
    REG5 = new RegExp("^(" + TABS + ")(\\[.*?\\]|\\{.*?\\}|\\S)+\\.(?!\\S)");
    REG6 = {}; times2(20, function(i) { REG6[i] = new RegExp("(" + TAB + "{" + i + "})", "g"); });
    REG7 = new RegExp("\\n(" + TABS + "[\\s\\S]*)");
    REG8 = new RegExp("^" + TABS + "\\|");
  };
  _.TAB_SIZE(2);
  function number_of_tab(a) {
    var snt = a.match(REG1)[0];
    var tab_length = (snt.match(/\t/g) || []).length;
    var space_length = snt.replace(/\t/g, "").length;
    return space_length / TAB_SIZE + tab_length;
  }

  function s(convert, pipe, self, var_names/*, source...*/) {
    var source = _.map(_.rest(arguments, 4), function(str_or_func) {
      if (_.isString(str_or_func)) return str_or_func;
      //var key = _.uniqueId("func");
      //_.t._func_storage[key] = str_or_func;
      //return '_.t._func_storage.' + key;

      var key = _.uniqueId("func");
      _._ts_storage[key] = str_or_func;
      return '_._ts_storage.' + key;

    }).join("");

    return function() { // data...
      return pipe(_.mr(source, var_names, arguments, self), remove_comment, convert, insert_datas1, insert_datas2, _.i);
    }
  }
  _._ts_storage = {};


  /* sync */

  _.Template = _.T = // var names, source...
    function() { return s.apply(null, [convert_to_html, _.pipe, {}].concat(_.toArray(arguments))); };

  _.Template$ = _.T$ = // source...
    function() { return s.apply(null, [convert_to_html, _.pipe, {}, '$'].concat(_.toArray(arguments))); };

  _.template = _.t = // _.mr(인자들), var names, source...
    function(args) {
      var f = s.apply(null, [convert_to_html, _.pipe, null].concat(_.rest(arguments)));
      return _.is_mr(args) ? f.apply(null, args) : f(args);
    };
  _.template$ = _.t$ = // _.mr(인자들), source...
    function(args) {
      var f = s.apply(null, [convert_to_html, _.pipe, null, '$'].concat(_.rest(arguments)));
      return _.is_mr(args) ? f.apply(null, args) : f(args);
    };

  _.String = _.S =
    function() { return s.apply(null, [_.mr, _.pipe, {}].concat(_.toArray(arguments))); };

  _.String$ = _.S$ =
    function() { return s.apply(null, [_.mr, _.pipe, {}, '$'].concat(_.toArray(arguments))); };

  _.string = _.s =
    function(args) {
      var f = s.apply(null, [_.mr,  _.pipe, null].concat(_.rest(arguments)));
      return _.is_mr(args) ? f.apply(null, args) : f(args);
    };
  _.string$ = _.s$ =
    function(args) {
      var f = s.apply(null, [_.mr, _.pipe, null, '$'].concat(_.rest(arguments)));
      return _.is_mr(args) ? f.apply(null, args) : f(args);
    };

  //_.t._func_storage = {};


  //function  s_each(func, var_names/*, source...*/) {     // used by H.each and S.each
  //  var map = _.partial(_.map, _, func.apply(null, _.rest(arguments)));
  //  return function(ary /*, args...*/) {
  //    return pipe(ary, _.partial.apply(null, [map, _].concat(_.rest(arguments))), function(res) { return res.join(""); });
  //  };
  //}
  //// pipe, convert_to_html, self {}
  //_.T.each = function() { // var names, source...
  //  return s_each.apply(null, [_.T, _.pipe].concat(_.toArray(arguments)));
  //};


  _.Template.each = _.T.each = function() { // var names, source...
    var template = _.T.apply(null, arguments);

    // 1 - 가장 빠른
    //return function(data) { // ary, d1, d2
    //  return _.map(_.to_mr(arguments), function(v, k, l, a, b) {
    //    return template.apply(null, arguments);
    //  }).join('');
    //};

    // 2 - 코드 합치기 좋은
    return function() { // ary, d1, d2
      return _.pipe(_.mr(_.to_mr(arguments)),
        _.partial(_.map, _, function() {
          return template.apply(null, arguments);
        }),
        function(res) { return res.join(''); }
      )
    }
  };

  _.template.each = _.t.each = function(data) { // _.mr(data...), var names, source...
    var args = _.rest(arguments); // [var names, source...]

    // 1
    //return _.map(data, function() {
    //  return _.t.apply(null, [_.to_mr(arguments)].concat(args));
    //}).join('');

    // 2
    return _.pipe(_.mr(data),
      _.partial(_.map, _, function() { return _.t.apply(null, [_.to_mr(arguments)].concat(args)); }),
      function(res) { return res.join(''); }
    );

  };

  _.String.each = _.S.each = function() {
    var template = _.S.apply(null, arguments);

    return function(data) {
      return _.pipe(_.mr(_.to_mr(arguments)),
        _.partial(_.map, _, function(v, k, l, a, b) { return template.apply(null, arguments); }),
        function(res) { return res.join(''); }
      )
    }
  };

  _.string.each = _.s.each = function(data) {
    var args = _.rest(arguments);

    return _.pipe(_.mr(data),
      _.partial(_.map, _, function() { return _.s.apply(null, [_.to_mr(arguments)].concat(args)); }),
      function(res) { return res.join(''); }
    );
  };



  /* async */

  _.async.Template = _.async.T =
    function() { return s.apply(null, [convert_to_html, _.async.pipe, {}].concat(_.toArray(arguments))); };

  _.async.Template$ = _.async.T$ =
    function() { return s.apply(null, [convert_to_html, _.async.pipe, {}, '$'].concat(_.toArray(arguments))); };

  _.async.template = _.async.t =
    function(args) {
      var f = s.apply(null, [convert_to_html, _.async.pipe, null].concat(_.rest(arguments)));
      return _.is_mr(args) ? f.apply(null, args) : f(args);
    };
  _.async.template$ = _.async.t$ =
    function(args) {
      var f = s.apply(null, [convert_to_html, _.async.pipe, null, '$'].concat(_.rest(arguments)));
      return _.is_mr(args) ? f.apply(null, args) : f(args);
    };

  _.async.String = _.async.S =
    function() { return s.apply(null, [_.mr, _.async.pipe, {}].concat(_.toArray(arguments))); };

  _.async.String$ = _.async.S$ =
    function() { return s.apply(null, [_.mr, _.async.pipe, {}, '$'].concat(_.toArray(arguments))); };

  _.async.string = _.async.s =
    function(args) {
      var f = s.apply(null, [_.mr,  _.async.pipe, null].concat(_.rest(arguments)));
      return _.is_mr(args) ? f.apply(null, args) : f(args);
    };
  _.async.string$ = _.async.s$ =
    function(args) {
      var f = s.apply(null, [_.mr, _.async.pipe, null, '$'].concat(_.rest(arguments)));
      return _.is_mr(args) ? f.apply(null, args) : f(args);
    };

  //_.asyc.Template.each = _.asyc.T.each
  //_.asyc.template.each = _.asyc.t.each
  //_.asyc.String.each = _.asyc.S.each
  //_.asyc.string.each = _.asyc.s.each


  function remove_comment(source, var_names, args, self) {
    return _.mr(source.replace(/\/\*(.*?)\*\//g, "").replace(REG2, ""), var_names, args, self);
  }
  function s_exec(re, wrap, matcher, source, var_names, args, self) {
    return pipe(_.mr(source.split(re), _.map(matcher(re, source, var_names, self), function(func) {
        return pipe(func.apply(null, args), wrap, return_check);
      })),
      function(s, vs) { return _.mr(map(vs, function(v, i) { return s[i] + v; }).join("") + s[s.length-1], var_names, args, self); }
    );
  }
  function convert_to_html(source, var_names, args, self) {
    if (self && self.convert_to_html) return _.mr(self.convert_to_html, var_names, args, self);

    var tag_stack = [];
    var ary = source.match(REG3);
    var base_tab = number_of_tab(ary[0]);
    ary[ary.length - 1] = ary[ary.length - 1].replace(REG4[base_tab] || (REG4[base_tab] = new RegExp(TAB + "{" + base_tab + "}$")), "");

    var is_paragraph = 0;
    for (var i = 0; i < ary.length; i++) {
      while (number_of_tab(ary[i]) - base_tab < tag_stack.length) { //이전 태그 닫기
        is_paragraph = 0;
        if (tag_stack.length == 0) break;
        ary[i - 1] += end_tag(tag_stack.pop());
      }
      var tmp = ary[i];
      if (!is_paragraph) {
        ary[i] = line(ary[i], tag_stack);
        if (tmp.match(REG5)) is_paragraph = number_of_tab(RegExp.$1) + 1;
        continue;
      }
      ary[i] = ary[i].replace(REG6[is_paragraph] || (REG6[is_paragraph] = new RegExp("(" + TAB + "{" + is_paragraph + "})", "g")), "\n");
      if (ary[i] !== (ary[i] = ary[i].replace(REG7, "\n"))) ary = push_in(ary, i + 1, RegExp.$1);
    }

    while (tag_stack.length) ary[ary.length - 1] += end_tag(tag_stack.pop()); // 마지막 태그

    return _.mr(self ? self.convert_to_html = ary.join("") : ary.join(""), var_names, args, self);
  }
  function line(source, tag_stack) {
    source = source.replace(REG8, "\n").replace(/^ */, "");
    return source.match(/^[\[.#\w\-]/) ? source.replace(/^(\[.*\]|\{.*?\}|\S)+ ?/, function(str) {
      return start_tag(str, tag_stack);
    }) : source;
  }
  function push_in(ary, index, data) {
    var rest_ary = ary.splice(index);
    ary.push(data);
    return ary.concat(rest_ary);
  }
  function start_tag(str, tag_stack, attrs, name, cls) {
    attrs = '';
    name = str.match(/^\w+/);

    // name
    name = (!name || name == 'd') ? 'div' : name == 'sp' ? 'span' : name;
    if (name != 'input' && name != 'br' ) tag_stack.push(name);

    // attrs
    str = str.replace(/\[(.*)\]/, function(match, inner) { return (attrs += ' ' + inner) && ''; });

    // attrs = class + attrs
    (cls = _.map(str.match(/\.(\{\{\{.*?\}\}\}|\{\{.*?\}\}|[\w\-]+)/g), function(v) { return v.slice(1); }).join(' '))
    && attrs == (attrs = attrs.replace(/class\s*=\s*((\").*?\"|(\{.*?\}|\S)+)/,
      function(match, tmp, q) { return ' class=' + '"' + cls + ' ' + (q ? tmp.slice(1, -1) : tmp) + '"'; }))
    && (attrs = ' class="' + cls + '"' + attrs);

    // attrs = id + attrs
    attrs = [''].concat(_.map(str.match(/#(\{\{\{.*?\}\}\}|\{\{.*?\}\}|[\w\-]+)/g),
        function(v) { return v.slice(1); })).join(' id=') + attrs;

    return '<' + name + attrs + ' >';
  }
  function end_tag(tag) { return '</' + tag + '>'; }
  function return_check(val) { return (val == null || val == void 0) ? '' : val; }

  /*
  * 템플릿 끝
  * */

}(typeof global == 'object' && global.global == global && (global.G = global) || window);