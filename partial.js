// Partial.js 1.0
// History - lmn.js -> lego.js -> L.js -> abc.js -> Partial.js
// Project Lead - Indong Yoo
// Maintainers - Piljung Park, Hanah Choi
// Contributors - Joeun Ha, Byeongjin Kim, Hoonil Kim
// (c) 2015-2016 Marpple. MIT Licensed.
!function(G) {
  var window = typeof window != 'object' ? G : window;
  window._ = _;
  window.__ == __;
  window.___ = {};

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
  function __() { return __; }
  _.right = function() {
    var len = --arguments.length, fn = arguments[len];
    delete arguments[len];
    return fn.apply(this == _ ? null : this, arguments);
  };
  _.righta = function(args, fn) { return fn.apply(this == _ ? null : this, args); };

  /* Pipeline */
  _.pipe = pipe, _.pipec = pipec, _.pipea = pipea, _.pipea2 = pipea2;
  _.mr = mr, _.to_mr = to_mr, _.is_mr = is_mr, _.mr_cat = mr_cat;
  function pipe(v) {
    var i = 0, f;
    while (f = arguments[++i]) v = (v && v._mr) ? f.apply(undefined, v) : v === __ ? f() : f(v);
    return v;
  }
  function pipec(self, v) {
    var i = 1, f;
    while (f = arguments[++i]) v = (v && v._mr) ? f.apply(self, v) : v === __ ? f.call(self) : f.call(self, v);
    return v;
  }
  function pipea(self, v, fs) {
    var i = 0, f;
    while (f = fs[i++]) v = (v && v._mr) ? f.apply(self, v) : v === __ ? f.call(self) : f.call(self, v);
    return v;
  }
  function pipea2(v, fs) {
    var i = 0, f;
    while (f = fs[i++]) v = (v && v._mr) ? f.apply(undefined, v) : v === __ ? f() : f(v);
    return v;
  }
  function mr() {
    arguments._mr = true;
    return arguments;
  }
  function mr_cat() {
    var args = [];
    for (var i = 0, len = arguments.length; i < len; i++) {
      var arg = arguments[i];
      if (is_mr(arg)) for (var j = 0, len2 = arg.length; j < len2; j++) args.push(arg[j]);
      else args.push(arg);
    }
    args._mr = true;
    return args;
  }
  function to_mr(args) {
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
    // return function() { return A(arguments, fns.concat([_.constant(arguments), to_mr]), this); };
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
    return function() { return _.async.pipea(ithis(this, arguments), to_mr(arguments), fs); }
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
    var args_len = args.length, resolve = null;
    var promise = has_promise() ? new Promise(function(rs) { resolve = rs; }) : { then: function(rs) { resolve = rs; } };
    (function c(res) {
      do {
        if (i === args_len) return resolve ? resolve(fpro(res)) : setTimeout(function() { resolve && resolve(fpro(res)); }, 0);
        if (unpack_promise(res, c)) return;
        if (!args[i]._p_cb && !args[i]._p_jcb) res = is_mr(res) ? _.Lambda(args[i++]).apply(self, res) : res === __ ?
          _.Lambda(args[i++]).call(self) : _.Lambda(args[i++]).call(self, res);
        else if (!args[i]._p_cb) is_mr(res) ?
          _.Lambda(args[i++]).apply(self, (res[res.length++] = function() { res = to_mr(arguments); }) && res) : res === __ ?
            _.Lambda(args[i++]).call(self, function() { res = to_mr(arguments); }) :
            _.Lambda(args[i++]).call(self, res, function() { res = to_mr(arguments); });
      } while (i == args_len || i < args_len && !args[i]._p_cb);
      if (unpack_promise(res, c)) return;
      is_mr(res) ?
        _.Lambda(args[i++]).apply(self, (res[res.length++] = function() { c(to_mr(arguments)); }) && res) : res === __ ?
          _.Lambda(args[i++]).call(self, function() { c(to_mr(arguments)); }) :
          _.Lambda(args[i++]).call(self, res, function() { c(to_mr(arguments)); });
    })(v);
    return promise;
  }
  function fpro(res) { return is_mr(res) && res.length == 1 ? res[0] : res; }

  _.async.pipe = function (v) { return async_pipe(void 0, v, arguments, 1); };

  function _async_reduce(data, iteratee, memo, limiter) {
    if (this != G) {
      iteratee = iteratee.bind(this);
      if (_.isFunction(limiter)) limiter = limiter.bind(this);
    }

    if (_.is_mr(data)) {
      iteratee = Iter(iteratee, data, 3);
      if (_.isFunction(limiter)) limiter = Iter(limiter, data, 3);
      data = data[0];
    }

    var i = -1, keys = _.isArrayLike(data) ? null : _.keys(data);
    memo = (arguments.length > 2) ? memo : data[keys ? keys[++i] : ++i];

    if (limiter == 0 || _.isEmpty(data)) return _.async.pipe(memo);

    return (function f(i, memo) {
      if (++i == (keys || data).length) return _.async.pipe(memo);
      var args = keys ? _.mr(memo, data[keys[i]], keys[i], data) : _.mr(memo, data[i], i, data);

      return _.async.pipe(args, iteratee).then(function(res) {
        args[0] = res; // iter 직후, limiter에서의 memo를 갱신시켜서 보내줘야 함
        return (_.isFunction(limiter) ? limiter.apply(null, args) : limiter == i+1) ? res : f(i, res); // f가 res를 안받아도 되나? - 한꺼풀 밖에다가
      });
    })(i, memo);
  }

  function _async_reduceRight(data, iteratee, memo, limiter) {
    if (this != G) {
      iteratee = iteratee.bind(this);
      if (_.isFunction(limiter)) limiter = limiter.bind(this);
    }

    if (_.is_mr(data)) {
      iteratee = Iter(iteratee, data, 3);
      if (_.isFunction(limiter)) limiter = Iter(limiter, data, 3);
      data = data[0];
    }

    var i = data.length, keys = _.isArrayLike(data) ? null : _.keys(data);
    memo = (arguments.length > 2) ? memo : data[keys ? keys[--i] : --i];

    if (limiter == 0 || _.isEmpty(data)) return _.async.pipe(memo);

    return (function f(i, memo) {
      if (--i == -1) return _.async.pipe(memo);
      var args = keys ? _.mr(memo, data[keys[i]], keys[i], data) : _.mr(memo, data[i], i, data);

      return _.async.pipe(args, iteratee).then(function(res) {
        args[0] = res;
        return (_.isFunction(limiter) ? limiter.apply(null, args) : (data.length - limiter) == i) ? res : f(i, res);
      });
    })(i, memo);
  }

  function _limiter(limiter) {
    if (!_.isFunction(limiter)) return limiter;
    return function() {
      return limiter.apply(null, _.rest(arguments));
    }
  }

  function _async_each(data, iteratee, limiter) {
    return _async_reduce.call(
      this,
      data, //data
      function(memo) { //iteratee
        return _.async.pipe(_.to_mr(_.rest(arguments)), iteratee, function() { return memo; });
      },
      _.is_mr(data) ? data[0] : data, //memo
      _limiter(limiter) //limiter
    );
  }

  function _async_map(data, iteratee, limiter) {
    return _async_reduce.call(
      this,
      data, //data
      function(memo) { //iteratee
        return _.async.pipe(_.to_mr(_.rest(arguments)), iteratee, function(v) { memo.push(v); return memo; });
      },
      [], //memo
      _limiter(limiter) // limiter
    );
  }

  function _async_filter(data, iteratee, limiter) {
    return _async_reduce.call(
      this,
      data, //data
      function(memo, val) { //iteratee
        return _.async.pipe(_.to_mr(_.rest(arguments)), iteratee, function(v) { if (v) memo.push(val); return memo; });
      },
      [], //memo
      _limiter(limiter) // limiter
    );
  }

  function _async_reject(data, iteratee, limiter) {
    return _async_reduce.call(
      this,
      data, //data
      function(memo, val) { //iteratee
        return _.async.pipe(_.to_mr(_.rest(arguments)), iteratee, function(v) { if(!v) memo.push(val); return memo; });
      },
      [], //memo
      _limiter(limiter) // limiter
    );
  }

  function _async_find(data, iteratee) {
    var tmp = false;
    return _async_reduce.call(
      this,
      data, //data
      function(memo, val) { //iteratee
        return _.async.pipe(_.to_mr(_.rest(arguments)), iteratee, function(res) { if (res) { tmp = true; return val; } return memo; }); // undefined
      },
      undefined, //memo
      function() { return tmp === true; }
    );
  }

  function _async_every(data, iteratee) {
    return _async_reduce.call(
      this,
      data, //data
      function(memo, val) { //iteratee
        return _.async.pipe(_.to_mr(_.rest(arguments)), iteratee);
      },
      true, //memo
      _.negate(_.identity) //limiter
    );
  }

  function _async_some(data, iteratee) {
    return _async_reduce.call(
      this,
      data, //data
      function(memo, val) { //iteratee
        return _.async.pipe(_.to_mr(_.rest(arguments)), iteratee);
      },
      false, //memo
      _.identity //limiter
    );
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
  _.m = _.method = function(obj, method) { return obj[method].apply(obj, _.rest(arguments, 2)); };
  /* Collections */

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
  _.each = function(data, iteratee, limiter) {
    if (iteratee._p_async || iteratee._p_cb) return _async_each.apply(null, arguments);

    if (this != _ && this != G) {
      iteratee = iteratee.bind(this);
      if (_.isFunction(limiter)) limiter = limiter.bind(this);
    }

    if (_.is_mr(data)) {
      iteratee = Iter(iteratee, data, 2);
      if (_.isFunction(limiter)) limiter = Iter(limiter, data, 3);
      data = data[0];
    }

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
    if (iteratee._p_async || iteratee._p_cb) return _async_map.apply(null, arguments);

    if (this != _ && this != G) {
      iteratee = iteratee.bind(this);
      if (_.isFunction(limiter)) limiter = limiter.bind(this);
    }

    if (_.is_mr(data)) {
      iteratee = Iter(iteratee, data, 2);
      if (_.isFunction(limiter)) limiter = Iter(limiter, data, 3);
      data = data[0];
    }

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
    if (iteratee._p_async || iteratee._p_cb) return _async_reduce.apply(this, arguments);

    if (this != _ && this != G) {
      iteratee = iteratee.bind(this);
      if (_.isFunction(limiter)) limiter = limiter.bind(this);
    }

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
          res = iteratee(res, data[keys[i]], keys[i], data);
    }
    return res;
  };

  _.reduceRight = _.reduce_right = function(data, iteratee, memo, limiter) {
    if (iteratee._p_async || iteratee._p_cb) return _async_reduceRight.apply(this, arguments);

    if (this != _ && this != G) {
      iteratee = iteratee.bind(this);
      if (_.isFunction(limiter)) limiter = limiter.bind(this);
    }

    if (_.is_mr(data)) {
      iteratee = Iter(iteratee, data, 3);
      if (_.isFunction(limiter)) limiter = Iter(limiter, data, 3);
      data = data[0];
    }

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
          res = iteratee(res, data[keys[i]], keys[i], data);
    }
    return res;
  };

  _.find = function(data, predicate) { // find에는 limiter가 없다.
    if (predicate._p_async || predicate._p_cb) return _async_find.apply(null, arguments);

    if (this != _ && this != G) {
      predicate = predicate.bind(this);
    }

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
    if (predicate._p_async || predicate._p_cb) return _async_filter.apply(null, arguments);

    if (this != _ && this != G) {
      predicate = predicate.bind(this);
      if (_.isFunction(limiter)) limiter = limiter.bind(this);
    }

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
    if (predicate._p_async || predicate._p_cb) return _async_reject.apply(null, arguments);

    if (this != _ && this != G) {
      predicate = predicate.bind(this);
      if (_.isFunction(limiter)) limiter = limiter.bind(this);
    }

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
    predicate = predicate || _.i;
    if (predicate._p_async || predicate._p_cb) return _async_every.apply(null, arguments);
    if (this != _ && this != G) { predicate = predicate.bind(this); }

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
    predicate = predicate || _.i;
    if (predicate._p_async || predicate._p_cb) return _async_some.apply(null, arguments);
    if (this != _ && this != G) { predicate = predicate.bind(this); }

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
    if (_.isEmpty(data)) return -Infinity;
    iteratee = iteratee || _.i;
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
    if (_.isEmpty(data)) return Infinity;
    iteratee = iteratee || _.i;
    if (_.is_mr(data)) { iteratee = Iter(iteratee, data, 2); data = data[0]; }
    var tmp, cmp, res;
    if (_.isArrayLike(data)) {
      if (isNaN(tmp = iteratee(data[0], 0, data))) return Infinity;
      for (var i = 1, l = data.length; i < l; i++) {
        cmp = iteratee(data[i], i, data);
        if (cmp < tmp) { tmp = cmp; res = data[i]; }
      }
    } else {
      var keys = _.keys(data);
      if (isNaN(tmp = iteratee(data[keys[0]], keys[0], data))) return Infinity;
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
  _.without = function(ary) { return _.difference(ary, slice.call(arguments, 1)); };
  //_.union = function() { return _.uniq(flatten(arguments, true, true)); };
  _.union = function() { return _.uniq(_.flatten(arguments, true)); };

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
    //var rest = flatten(arguments, true, true, 1);
    var rest = _.flatten(arguments, true, 1);
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

  var now = Date.now || function () { return new Date().getTime(); }; // throttle, debounce

  _.throttle = function (func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function () {
      previous = options.leading === false ? 0 : now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function () {
      var now = now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  _.debounce = function (func, wait, immediate) {
    var timeout, args, context, timestamp, result;
    var later = function () {
      var last = now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function () {
      context = this;
      args = arguments;
      timestamp = now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }
      return result;
    };
  };

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

  _.If = function(predicate, fn) {
    var is_async = false;
    var store = [fn ? [ca(predicate), ca(fn)] : [_.identity, ca(predicate)]];
    return _.extend(If, {
      else_if: elseIf,
      elseIf: elseIf,
      else: function(fn) { return store.push([_.constant(true), fn]) && If; }
    });
    function elseIf(predicate, fn) { return store.push(fn ? [ca(predicate), ca(fn)] : [_.identity, ca(predicate)]) && If; }
    function If() {
      var context = this, args = arguments;
      var wrap = is_async ? _.async : _.identity;
      var pipec = is_async ? _.async.pipec : _.pipec;
      return pipec(this, store,
        _(_.find, _, wrap(function(fnset) { return fnset[0].apply(context, args); })),
        function(fnset) { return fnset ? fnset[1].apply(context, args) : void 0; });
    }
    function ca(fn) {
      if (is_async) return fn;
      is_async = fn._p_async || fn._p_cb;
      return fn;
    }
  };

  // TDD
  _.test = function() {
    var fails = _.constant([]), all = _.constant([]), fna = _.constant([fails(), all()]);
    return _.async.pipe([_.constant('------------Start------------'), _.log, _.constant(arguments),
      _(_.map, _, function(f, k) {
        return _.If(_.async(all, _(_.m, _, 'push', k + ' ----> success')))
          .else(_.async(fna, _(_.map, _, _.async(_.identity, _(_.m, _, 'push', k + ' ----> fail')))))(f());
      }),
      _.constant('------------Fail-------------'), _.log,
      fails, _(_.each, _, _.async(_.identity, _.error)),
      _.constant('------------All--------------'), _.log,
      all, _(_.each, _, _.async(_.identity, _.log)),
      _.constant('------------End--------------'), _.log]);
  };

  /*
  * 템플릿 시작
  * */
  var TAB_SIZE;
  var REG1, REG2, REG3, REG4 = {}, REG5, REG6, REG7, REG8;
  function s_matcher(length, key, re, source, var_names, self) {

    if (self && self[key]) return self[key];
    var res = map(source.match(re), function(matched) {
      return new Function(var_names, "return " + matched.substring(length, matched.length-length) + ";");
    });
    if (self) self[key] = res;
    return res;
  }

  var insert_datas1 = _.partial(s_exec, /\{\{\{.*?\}\}\}/g, _.escape, s_matcher.bind(null, 3, "insert_datas1")); // {{{}}}
  var insert_datas2 = _.partial(s_exec, /\{\{.*?\}\}/g, _.i, s_matcher.bind(null, 2, "insert_datas2")); // {{}}
  var async_insert_datas1 = _.partial(async_s_exec, /\{\{\{.*?\}\}\}/g, _.escape, s_matcher.bind(null, 3, "insert_datas1")); // {{{}}}
  var async_insert_datas2 = _.partial(async_s_exec, /\{\{.*?\}\}/g, _.i, s_matcher.bind(null, 2, "insert_datas2")); // {{}}

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
  _._ts_storage = {};

  /* sync */
  _.Template = _.T = function() { return s.apply(null, [convert_to_html, _.pipe, {}].concat(_.toArray(arguments))); };
  _.Template$ = _.T$ = function() { return s.apply(null, [convert_to_html, _.pipe, {}, '$'].concat(_.toArray(arguments))); };
  _.template = _.t = function(args) {
      var f = s.apply(null, [convert_to_html, _.pipe, null].concat(_.rest(arguments)));
      return _.is_mr(args) ? f.apply(null, args) : f(args);
    };
  _.template$ = _.t$ = function(args) {
      var f = s.apply(null, [convert_to_html, _.pipe, null, '$'].concat(_.rest(arguments)));
      return _.is_mr(args) ? f.apply(null, args) : f(args);
    };
  _.String = _.S = function() { return s.apply(null, [_.mr, _.pipe, {}].concat(_.toArray(arguments))); };
  _.String$ = _.S$ = function() { return s.apply(null, [_.mr, _.pipe, {}, '$'].concat(_.toArray(arguments))); };
  _.string = _.s = function(args) {
      var f = s.apply(null, [_.mr,  _.pipe, null].concat(_.rest(arguments)));
      return _.is_mr(args) ? f.apply(null, args) : f(args);
    };
  _.string$ = _.s$ = function(args) {
      var f = s.apply(null, [_.mr, _.pipe, null, '$'].concat(_.rest(arguments)));
      return _.is_mr(args) ? f.apply(null, args) : f(args);
    };
  _.Template.each = _.T.each = function() {
    var template = _.T.apply(null, arguments);
    return function(data) {
      return _.map(_.to_mr(arguments), function(v, k, l, a, b) {
        return template.apply(null, arguments);
      }).join('');
    };
  };
  _.template.each = _.t.each = function(data) {
    var args = _.rest(arguments);
    return _.map(data, function() {
      return _.t.apply(null, [_.to_mr(arguments)].concat(args));
    }).join('');
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
  _.async.Template = _.async.T = function() { return s.apply(null, [convert_to_html, _.async.pipe, {}].concat(_.toArray(arguments))); };
  _.async.Template$ = _.async.T$ = function() { return s.apply(null, [convert_to_html, _.async.pipe, {}, '$'].concat(_.toArray(arguments))); };
  _.async.template = _.async.t = function(args) {
    var f = s.apply(null, [convert_to_html, _.async.pipe, null].concat(_.rest(arguments)));
    return _.is_mr(args) ? f.apply(null, args) : f(args);
  };
  _.async.template$ = _.async.t$ = function(args) {
    var f = s.apply(null, [convert_to_html, _.async.pipe, null, '$'].concat(_.rest(arguments)));
    return _.is_mr(args) ? f.apply(null, args) : f(args);
  };
  _.async.String = _.async.S = function() { return s.apply(null, [_.mr, _.async.pipe, {}].concat(_.toArray(arguments))); };
  _.async.String$ = _.async.S$ = function() { return s.apply(null, [_.mr, _.async.pipe, {}, '$'].concat(_.toArray(arguments))); };

  _.async.string = _.async.s = function(args) {
    var f = s.apply(null, [_.mr,  _.async.pipe, null].concat(_.rest(arguments)));
    return _.is_mr(args) ? f.apply(null, args) : f(args);
  };
  _.async.string$ = _.async.s$ = function(args) {
    var f = s.apply(null, [_.mr, _.async.pipe, null, '$'].concat(_.rest(arguments)));
    return _.is_mr(args) ? f.apply(null, args) : f(args);
  };
  _.async.Template.each = _.async.T.each =
    function() {
      var template = _.async.T.apply(null, arguments);
      return function() {
        return _.async.pipe(_.mr(_.to_mr(arguments)),
          _.partial(_.map, _, _.async(function() {
            return template.apply(null, arguments);
          })),
          function(res) { return res.join(''); }
        )
      }
    };
  _.async.template.each = _.async.t.each =
    function(data) {
      var args = _.rest(arguments);
      return _.async.pipe(_.mr(data),
        _.partial(_.map, _, _.async(function() {
          return _.async.t.apply(null, [_.to_mr(arguments)].concat(args));
        })),
        function(res) { return res.join(''); })
    };
  _.async.String.each = _.async.S.each =
    function() {
      var string = _.async.S.apply(null, arguments);
      return function() {
        return _.async.pipe(_.mr(_.to_mr(arguments)),
          _.partial(_.map, _, _.async(function() {
            return string.apply(null, arguments);
          })),
          function(res) { return res.join(''); }
        )
      }
    };
  _.async.string.each = _.async.s.each =
    function(data) {
      var args = _.rest(arguments);
      return _.async.pipe(_.mr(data),
        _.partial(_.map, _, _.async(function() {
          return _.async.s.apply(null, [_.to_mr(arguments)].concat(args));
        })),
        function(res) { return res.join(''); })
    };

  function number_of_tab(a) {
    var snt = a.match(REG1)[0];
    var tab_length = (snt.match(/\t/g) || []).length;
    var space_length = snt.replace(/\t/g, "").length;
    return space_length / TAB_SIZE + tab_length;
  }

  function s(convert, pipe, self, var_names/*, source...*/) {
    var source = _.map(_.rest(arguments, 4), function(str_or_func) {
      if (_.isString(str_or_func)) return str_or_func;
      var key = _.uniqueId("func");
      _._ts_storage[key] = str_or_func;
      return '_._ts_storage.' + key;
    }).join("");
    return function(a) {
      return pipe == _.pipe ?
        pipe(_.mr(source, var_names, arguments, self), remove_comment, convert, insert_datas1, insert_datas2, _.i) :
        pipe(_.mr(source, var_names, arguments, self), remove_comment, convert, async_insert_datas1, async_insert_datas2, _.i);
    }
  }

  function remove_comment(source, var_names, args, self) {
    return _.mr(source.replace(/\/\*(.*?)\*\//g, "").replace(REG2, ""), var_names, args, self);
  }

  function s_exec(re, wrap, matcher, source, var_names, args, self) {
    var s = source.split(re);
    return _.mr(map(map(matcher(re, source, var_names, self), function(func) {
      return pipe(func.apply(null, args), wrap, return_check);
    }), function(v, i) { return s[i] + v; }).join("") + s[s.length-1], var_names, args, self);
  }

  function async_s_exec(re, wrap, matcher, source, var_names, args, self) {
    return _.async.pipe(
      _.mr(source.split(re),
        _.map(matcher(re, source, var_names, self), _.async(function(func) {
          return _.async.pipe(func.apply(null, args), wrap, return_check);
        }))
      ),
      function(s, vs) { return _.mr(map(vs, function(v, i) { return s[i] + v; }).join("") + s[s.length-1], var_names, args, self); });
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
    ary.push(data)
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
  /* mutable */
  function _set(obj, key, valueOrFunc) {
    if (!_.isFunction(valueOrFunc)) return _.mr(obj[key] = valueOrFunc, key, obj);
    return _.async.pipe(_.mr(obj, key), valueOrFunc, function(_value) { return _.mr(obj[key] = _value, key, obj) });
  }
  function _unset(obj, key) { var val = obj[key]; delete obj[key]; return _.mr(val, key, obj); }
  function _remove(arr, remove) { return _.mr(remove, _.removeByIndex(arr, arr.indexOf(remove)), arr); }
  function _pop(arr) { return _.mr(arr.pop(), arr.length, arr); }
  function _shift(arr) { return _.mr(arr.shift(), 0, arr); }
  function _push(arr, itemOrFunc) {
    if (!_.isFunction(itemOrFunc)) return _.mr(itemOrFunc, arr.push(itemOrFunc), arr);
    return _.async.pipe(arr, itemOrFunc, function(_item) { return _.mr(_item, arr.push(_item), arr); });
  }
  function _unshift(arr, itemOrFunc) {
    if (!_.isFunction(itemOrFunc)) return _.mr(itemOrFunc, arr.unshift(itemOrFunc), arr);
    return _.async.pipe(arr, itemOrFunc, function(_item) { return _.mr(_item, arr.unshift(_item), arr); });
  }
  _.removeByIndex = function(arr, from) {
    if (from !== -1) {
      var rest = arr.slice(from + 1 || arr.length);
      arr.length = from;
      arr.push.apply(arr, rest);
    }
    return from;
  };

  /* mutable/immutable with selector */
  _.sel = _.select = function(start, selector) {
    return _.reduce(selector.split(/\s*->\s*/), function (mem, key) {
      return !key.match(/^\((.+)\)/) ? !key.match(/\[(.*)\]/) ? mem[key] : function(mem, numbers) {
        if (numbers.length > 2 || numbers.length < 1 || _.filter(numbers, function(v) { return isNaN(v); }).length) return _.Err('[] selector in [num] or [num ~ num]');
        var s = numbers[0], e = numbers[1]; return !e ? mem[s<0 ? mem.length+s : s] : slice.call(mem, s<0 ? mem.length+s : s, e<0 ? mem.length+e : e + 1);
      }(mem, _.map(RegExp.$1.replace(/\s/g, '').split('~'), _.parseInt)) : _.find(mem, _.Lambda(RegExp.$1));
    }, start);
  };

  _.extend(_, {
    set: function(start, selector, value) {
      var _arr = selector.split(/\s*->\s*/), last = _arr.length - 1;
      return _.mr_cat(start, _set(_arr.length == 1 ? start : _.sel(start, _arr.slice(0, last).join('->')), _arr[last], value));
    },
    unset: function(start, selector) {
      var _arr = selector.split(/\s*->\s*/), last = _arr.length - 1;
      return _.mr_cat(start, _unset(_arr.length == 1 ? start : _.sel(start, _arr.slice(0, last).join('->')), _arr[last]));
    },
    remove: function(start, selector, remove) {
      if (remove) return _.mr_cat(start, _remove(_.sel(start, selector), remove));
      var _arr = selector.split(/\s*->\s*/);
      return _.mr_cat(start, _remove(_.sel(start, _arr.slice(0, _arr.length - 1).join('->')), _.sel(start, selector)));
    },
    extend2: function(start, selector/*, objs*/) {
      return _.mr_cat(start, _.extend.apply(null, [_.sel(start, selector)].concat(_.toArray(arguments).slice(2, arguments.length))));
    },
    defaults2: function(start, selector/*, objs*/) {
      return _.mr_cat(start, _.defaults.apply(null, [_.sel(start, selector)].concat(_.toArray(arguments).slice(2, arguments.length))));
    },
    pop: function(start, selector) { return _.mr_cat(start, _pop(_.sel(start, selector))); },
    shift: function(start, selector) { return _.mr_cat(start, _shift(_.sel(start, selector))); },
    push: function(start, selector, item) { return _.mr_cat(start, _push(_.sel(start, selector), item)); },
    unshift: function(start, selector, item) { return _.mr_cat(start, _unshift(_.sel(start, selector), item)); }
  });

  _.imutable = _.im = _.extend(function(start, selector) {
    var im_start = _.clone(start);
    return {
      start: im_start,
      selected: _.reduce(selector.split(/\s*->\s*/), function(clone, key) {
        return !key.match(/^\((.+)\)/) ? /*start*/(!key.match(/\[(.*)\]/) ? clone[key] = _.clone(clone[key]) : function(clone, numbers) {
          if (numbers.length > 2 || numbers.length < 1 || _.filter(numbers, _.Pipe(_.identity, isNaN)).length) return ERR('[] selector in [num] or [num ~ num]');
          var s = numbers[0], e = numbers[1]; return !e ? clone[s] = _.clone(clone[s<0 ? clone.length+s : s]) : function(clone, oris) {
            return each(oris, function(ori) { clone[clone.indexOf(ori)] = _.clone(ori); });
          }(clone, slice.call(clone, s<0 ? clone.length+s : s, e<0 ? clone.length+e : e + 1));
        }(clone, map(RegExp.$1.replace(/\s/g, '').split('~'), _.Pipe(_.identity, parseInt))))/*end*/ :
          function(clone, ori) { return clone[clone.indexOf(ori)] = _.clone(ori); } (clone, _.find(clone, _.Lambda(RegExp.$1)))
      }, im_start)
    };
  }, {
    set: function(start, selector, value) {
      var _arr = selector.split(/\s*->\s*/), last = _arr.length - 1, im = _.im(start, _arr.slice(0, _arr.length == 1 ? void 0 : last).join('->'));
      return _.mr_cat(im.start, _set(_arr.length == 1 ? im.start : im.selected, _arr[last], value));
    },
    unset: function(start, selector) {
      var _arr = selector.split(/\s*->\s*/), last = _arr.length - 1, im = _.im(start, _arr.slice(0, last).join('->'));
      return _.mr_cat(im.start, _unset(_arr.length == 1 ? im.start : im.selected, _arr[last]));
    },
    remove: function(start, selector, remove) {
      var _arr = selector.split(/\s*->\s*/), im = _.im(start, selector);
      if (remove) return _.to_mr([start].concat(_remove(im.selected, remove)));
      return _.mr_cat(im.start, _remove(_.sel(im.start, _arr.slice(0, _arr.length - 1).join('->')), im.selected));
    },
    extend: function(start/*, objs*/) {
      return _.extend.apply(null, [{}, start].concat(_.toArray(arguments).slice(1, arguments.length)));
    },
    defaults: function(start/*, objs*/) {
      return _.defaults.apply(null, [{}, start].concat(_.toArray(arguments).slice(1, arguments.length)));
    },
    extend2: function(start, selector/*, objs*/) {
      var im = _.im(start, selector);
      return _.mr_cat(im.start, _.extend.apply(null, [im.selected].concat(_.toArray(arguments).slice(2, arguments.length))));
    },
    defaults2: function(start, selector/*, objs*/) {
      var im = _.im(start, selector);
      return _.mr_cat(im.start, _.defaults.apply(null, [im.selected].concat(_.toArray(arguments).slice(2, arguments.length))));
    },
    pop: function(start, selector) {
      var im = _.im(start, selector);
      return _.mr_cat(im.start, _pop(im.selected));
    },
    shift: function(start, selector) {
      var im = _.im(start, selector);
      return _.mr_cat(im.start, _shift(im.selected));
    },
    push: function(start, selector, item) {
      var im = _.im(start, selector);
      return _.mr_cat(im.start, _push(im.selected, item));
    },
    unshift: function(start, selector, item) {
      var im = _.im(start, selector);
      return _.mr_cat(im.start, _unshift(im.selected, item));
    }
  });
  /** box **/
  function Box() {}
  function help_result(result, box) {
    result[0] = box || _.box(result[0]);
    return result;
  }
  _.box = function (key, value) {
    var _box_data = new Box(), _box_cache = {};
    var is_string = _.isString(key), k;
    if (is_string && arguments.length == 2) _box_data[key] = value;
    else if (!is_string && arguments.length == 1) for (k in key) _box_data[k] = key[k];
    var _box = function() { return _box_data; };
    return _.extend(_box, {
      select: select,
      sel: select,
      set: function (el, value) {
        var selector = make_selector(el), result = help_result(_.set(_box_data, selector, value), _box);
        _box_cache[selector] = result[1];
        return result;
      },
      unset: function(el) {
        var selector = make_selector(el), result = help_result(_.unset(_box_data, selector), _box);
        delete _box_cache[selector];
        return result;
      },
      remove: function(el) {
        var selector = make_selector(el), result = help_result( _.remove(_box_data, selector), _box);
        delete _box_cache[selector];
        return result;
      },
      extend: function(obj) {
        _.extend(_box_data, obj);
        return _.mr_cat(_box, obj);
      },
      defaults: function(obj) {
        _.defaults(_box_data, obj);
        return _.mr_cat(_box, obj);
      },
      extend2: function(el) {
        var selector = make_selector(el), result = help_result(_.extend2.apply(null, [_box_data, selector].concat(_.toArray(arguments).slice(1, arguments.length))), _box);
        _box_cache[selector] = result[1];
        return result;
      },
      defaults2: function(el) {
        var selector = make_selector(el), result = help_result(_.defaults2.apply(null, [_box_data, selector].concat(_.toArray(arguments).slice(1, arguments.length))), _box);
        _box_cache[selector] = result[1];
        return result;
      },
      pop: function(el) {
        return help_result(_.pop(_box_data, make_selector(el)), _box);
      },
      push: function(el, item) {
        return help_result(_.push(_box_data, make_selector(el), item), _box);
      },
      shift: function(el) {
        return help_result(_.shift(_box_data, make_selector(el)), _box);
      },
      unshift: function(el, item) {
        return help_result(_.unshift(_box_data, make_selector(el), item), _box);
      },
      im: {
        set: function (el, value) {
          return help_result(_.im.set(_box_data, make_selector(el), value));
        },
        unset: function(el) {
          return help_result(_.im.unset(_box_data, make_selector(el)));
        },
        remove: function(el) {
          return help_result(_.im.remove(_box_data, make_selector(el)));
        },
        extend: function() {
          return help_result(_.im.extend.apply(null, [_box_data].concat(_.toArray(arguments))));
        },
        defaults: function() {
          return help_result(_.im.defaults.apply(null, [_box_data].concat(_.toArray(arguments))));
        },
        extend2: function(el) {
          return help_result(_.im.extend2.apply(null, [_box_data, make_selector(el)].concat(_.toArray(arguments).slice(1, arguments.length))));
        },
        defaults2: function(el) {
          return help_result(_.im.defaults2.apply(null, [_box_data, make_selector(el)].concat(_.toArray(arguments).slice(1, arguments.length))));
        },
        pop: function(el) {
          return help_result(_.im.pop(_box_data, make_selector(el)));
        },
        push: function(el, item) {
          return help_result(_.im.push(_box_data, make_selector(el), item));
        },
        shift: function(el) {
          return help_result(_.im.shift(_box_data, make_selector(el)));
        },
        unshift: function(el, item) {
          return help_result(_.im.unshift(_box_data, make_selector(el), item));
        }
      }
    });
    function select(el, is_init_cache) {
      if (!el || _.isArrayLike(el) && !el.length) return ;
      var selector = make_selector(el);
      var _data = _.select(_box_data, selector);
      var _cache_val = _box_cache[selector];
      return (is_init_cache || !_cache_val) ? (_box_cache[selector] = _data) : _cache_val;
    }
    function make_selector(el) {
      return _.isString(el) ? el : (_.isArrayLike(el) ? el[0] : el).getAttribute('box_selector');
    }
  };

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
      if (arguments.length == 1) _unset(notices, name1);
      else if (_notice && arguments.length == 2) each(_.isString(n2_or_n2s) ? [n2_or_n2s] : n2_or_n2s, _(_unset, _notice));
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
      _set(_notice, key, _.reject(_notice[key], function(func) {
        func.apply(null, emit_args);
        return func.is_once;
      }));
    }
  }(_, {});
}(typeof global == 'object' && global.global == global && (global.G = global) || window);