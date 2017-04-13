// Partial.js 1.0
// History - lmn.js -> lego.js -> L.js -> abc.js -> Partial.js
// Project Lead - Indong Yoo
// Maintainers - Piljung Park, Hanah Choi
// Contributors - Joeun Ha, Byeongjin Kim, Hoonil Kim
// Respect Underscore.js
// (c) 2015-2017 Marpple. MIT Licensed.
!function(G) {
  var window = typeof window != 'object' ? G : window;
  window._ = window._p = _;
  window.__ = __; window.__1 = __1;
  window.___ = ___; window.___1 = ___1;
  window.G = window; window.G.G = G;

  _.partial = _; function _(fn) {
    if (_.isString(fn)) return _.method.apply(null, arguments);
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
    if (args2.length) {
      while (i--) if (n_arg3[i] == _) n_arg3[i] = args2.pop();
      return _to_unde(n_args1, args2, n_arg3);
    }
    while (i-- && n_arg3[i] == _) n_arg3.pop();
    return _to_unde(n_args1, n_arg3);
  }
  _.m = _.method = function(method) {
    function f(obj) { return obj[method].apply(obj, _.rest(arguments)); }
    return _.apply(null, [f, _].concat(_.rest(arguments)));
  };
  _.bind = function(fn) {
    var f = Function.prototype.bind.apply(fn, _.rest(arguments));
    f._p_async = fn._p_async;
    f._p_cb = fn._p_cb;
    return f;
  };

  // Pipeline
  _.go = function(v, _fs) {
    if (this != _ && this != window) return _.isFunction(_fs) ? goapply(this, v, arguments, 1) : goapply(this, v, _fs);
    var i = 0, fs = arguments, f;
    if (!_.isFunction(_fs)) i = -1, fs = _fs;

    while (f = fs[++i]) {
      if (f == __) v = __;
      else if (f._p_cb) return go_async(null, v, fs, i);
      else if (!v) v = f(v);
      else if (v._mr) {
        if (maybe_promise_mr(v)) return go_async(null, v, fs, i);
        if (v._stop) return v.length == 1 ? v[0] : v._stop = false || v;
        v = f.apply(undefined, v);
      } else if (v.then && _.isFunction(v.then)) return go_async(null, v, fs, i);
      else v = v === __ ? f() : f(v);
    }
    return v;
  };
  _.mr = mr, _.to_mr = to_mr, _.is_mr = is_mr, _.mr_cat = mr_cat;
  _.stop = function() {
    arguments._stop = true;
    arguments._mr = true;
    return arguments;
  };
  function goapply(self, v, fs, start) {
    var i = (start || 0), f;
    while (f = fs[i++]) {
      if (f == __) v = __;
      else if (f._p_cb) return go_async(self, v, fs, i-1);
      else if (!v) v = f.call(self, v);
      else if (v._mr) {
        if (maybe_promise_mr(v)) return go_async(self, v, fs, i-1);
        if (v._stop) return v.length == 1 ? v[0] : v._stop = false || v;
        v = f.apply(self, v);
      } else if (v.then && _.isFunction(v.then)) return go_async(self, v, fs, i-1);
      else v = v === __ ? f.call(self) : f.call(self, v);
    }
    return v;
  }
  function mr() { return arguments._mr = true, arguments; }
  function mr_cat() {
    var args = [];
    for (var i = 0, len = arguments.length; i < len; i++) {
      var arg = arguments[i];
      if (is_mr(arg)) for (var j = 0, len2 = arg.length; j < len2; j++) args.push(arg[j]);
      else args.push(arg);
    }
    return args._mr = true, args;
  }
  function to_mr(args) { return args._mr = true, args; }
  function is_mr(v) { return v && v._mr; }

  _.pipe = __; function __(_fs) {
    var fs = Array.isArray(_fs) ? _fs : arguments;
    return function() {
      arguments._mr = true;
      return this == window || this == _ ? _.go(arguments, fs) : goapply(this, arguments, fs);
    }
  }
  _.pipe1 = __1; function __1() {
    var f = __.apply(null, arguments);
    return function(v) { return f.call(this, v); };
  }
  _.indent = ___; function ___(_fs) {
    var fs = Array.isArray(_fs) ? _fs : arguments;
    return function() { return goapply(ithis(this, arguments), to_mr(arguments), fs); }
  }
  function ithis(self, args) { return { parent: self, arguments: args }; }
  _.indent1 = ___1; function ___1() {
    var f = ___.apply(null, arguments);
    return function(v) { return f.call(this, v); };
  }

  _.tap = _.Tap = function() {
    var func = __.apply(null, arguments);
    return function(arg) {
      var args = arguments.length > 1 ? to_mr(arguments) : arguments.length ? arguments[0] : __;
      return _.go.call(this, args, func, _.c(args));
    }
  };
  _.add_arg = function() {
    var func = __.apply(null, arguments);
    return function(arg) {
      var args = arguments.length > 1 ? to_mr(arguments) : arguments.length ? arguments[0] : __;
      return _.go.call(this, args, func, function() {
        return _.mr_cat(arg, _.to_mr(arguments));
      });
    }
  };
  _.wait = function(time) {
    return _.callback(function() {
      var args = arguments, cb = args[args.length-1];
      args.length--;
      setTimeout(function() { cb.apply(null, args); }, time || 0);
    });
  };

  _.Err = function(message) { return new Error(message); };

  _.go.async = function(v) { return go_async(_.go == this ? null : this, v, arguments, 1); };
  __.async = function(_fs) {
    var fs = Array.isArray(_fs) ? _fs : arguments;
    function f() { return go_async(this, to_mr(arguments), fs, 0); }
    f._p_async = true;
    return f;
  };
  _.async = __.async; _.pipe.async = __.async; ___.async = _.indent.async = function(_fs) {
    var fs = Array.isArray(_fs) ? _fs : arguments;
    return function() { return go_async(ithis(this, arguments), to_mr(arguments), fs, 0); }
  };
  _.cb = _.callback = function(f) {
    return __.async.apply(null, map(arguments, function(f) { return f._p_cb = true, f; }));
  };
  _.boomerang = function() {
    var fs = arguments;
    return _.callback(function() {
      var args = arguments, cb = args[args.length-1];
      args.length--;
      var self = ithis(this, args);
      self.return = cb;
      go_async(self, to_mr(args), fs, 0);
    });
  };
  _.branch = function() {
    var fs = arguments;
    return function() {
      arguments._mr = true;
      goapply(this, arguments, fs);
      return arguments;
    };
  };

  function has_promise() { return has_promise.__cache || (has_promise.__cache = !!_.val(window, 'Promise.prototype.then')); }
  function maybe_promise(res) {
    return res && res.then && _.isFunction(res.then);
  }
  function maybe_promise_mr(mr) {
    var res, i = mr.length;
    while (i--) {
      res = mr[i];
      if (res && res.then && _.isFunction(res.then)) return true;
    }
  }
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

  function go_async(self, v, fs, i) {
    var args_len = fs.length, resolve = null;
    var promise = has_promise() ? new Promise(function(rs) { resolve = rs; }) : { then: function(rs) { resolve = rs; } };
    (function c(v) {
      do {
        if (i === args_len) return resolve ? resolve(fpro(v)) : setTimeout(function() { resolve && resolve(fpro(v)); }, 0);
        if (unpack_promise(v, c)) return;
        if (fs[i] == __ && i++) v = __;
        if (v && v._stop) {
          i = args_len;
          v = v.length == 1 ? v[0] : v._stop = false || v;
          continue;
        }
        if (!fs[i]._p_cb) v = is_mr(v) ? _.lambda(fs[i++]).apply(self, v) : v === __ ?
          _.lambda(fs[i++]).call(self) : _.lambda(fs[i++]).call(self, v);
      } while (i == args_len || i < args_len && !fs[i]._p_cb);
      if (unpack_promise(v, c)) return;
      is_mr(v) ?
        _.lambda(fs[i++]).apply(self, (v[v.length++] = function() { c(to_mr(arguments)); }) && v) : v === __ ?
        _.lambda(fs[i++]).call(self, function() { c(to_mr(arguments)); }) :
        _.lambda(fs[i++]).call(self, v, function() { c(to_mr(arguments)); });
    })(v);
    return promise;
  }
  function fpro(res) { return is_mr(res) && res.length == 1 ? res[0] : res; }

  _.all2 = function(args) {
    var res = [], tmp;
    for (var i = 1, l = arguments.length; i < l; i++) {
      tmp = _.is_mr(args) ?
        arguments[i].apply(this == _ ? null : this, args) : arguments[i].call(this == _ ? null : this, args);
      if (_.is_mr(tmp)) for (var j = 0, l = tmp.length; j < l; j++) res.push(tmp[j]);
      else res.push(tmp);
    }
    return to_mr(res);
  };
  _.spread2 = function(args) {
    var fns = _.rest(arguments, 1), res = [], tmp;
    for (var i = 0, fl = fns.length, al = args.length; i < fl || i < al; i++) {
      tmp = _.is_mr(args[i]) ?
        (fns[i] || _.idtt).apply(this == _ ? null : this, args[i]) : (fns[i] || _.idtt).call(this == _ ? null : this, args[i]);
      if (_.is_mr(tmp)) for (var j = 0, l = tmp.length; j < l; j++) res.push(tmp[j]);
      else res.push(tmp);
    }
    return to_mr(res);
  };
  _.all = _.All = function() {
    var fns = _.last(arguments);
    if (_.isArray(fns)) return _.all2.apply(this, [to_mr(_.initial(arguments))].concat(fns));
    fns = _.toArray(arguments);
    return function() { return _.all2.apply(this, [to_mr(arguments)].concat(fns)); };
  };
  _.spread = _.Spread = function() {
    var fns = _.last(arguments);
    if (_.isArray(fns)) return _.spread2.apply(this, [to_mr(_.initial(arguments))].concat(fns));
    fns = _.toArray(arguments);
    return function() { return _.spread2.apply(this, [to_mr(arguments)].concat(fns)); };
  };

  _.if = _.If = function(predicate, fn) {
    var store = [fn ? [predicate, fn] : [_.identity, predicate]];
    return _.extend(If, {
      else_if: elseIf,
      elseIf: elseIf,
      else: function(fn) { return store.push([_.constant(true), fn]) && If; }
    });
    function elseIf(predicate, fn) { return store.push(fn ? [predicate, fn] : [_.identity, predicate]) && If; }
    function If() {
      var context = this, args = arguments;
      return _.go.call(this, store,
        _(_.find, _, function(fnset) { return fnset[0].apply(context, args); }),
        function(fnset) { return fnset ? fnset[1].apply(context, args) : void 0; });
    }
  };

  _.noop = function() {};
  _.this = function() { return this; };
  _.idtt = _.identity = function(v) { return v; };
  _.i = _.i18n = function(key, value) { // TODO
    if (arguments.length == 1) return key;
    return _.toArray(arguments).join(" ");
  };

  _.args = function() { return arguments; };
  _.args0 = _.identity;
  _.args1 = function() { return arguments[1]; };
  _.args2 = function() { return arguments[2]; };
  _.args3 = function() { return arguments[3]; };
  _.args4 = function() { return arguments[4]; };
  _.args5 = function() { return arguments[5]; };
  _.a = _.c = _.always = _.constant = function(v) { return function() { return v; }; };
  _.true = _.constant(true);
  _.false = _.constant(false);
  _.null = _.constant(null);
  _.not = function(v) { return !v; };
  _.nnot = function(v) { return !!v; };
  _.log = window.console && window.console.log ? console.log.bind ? console.log.bind(console) : function() { console.log.apply(console, arguments); } : _.idtt;
  _.loge = window.console && window.console.error ? console.error.bind ? console.error.bind(console) : function() { console.error.apply(console, arguments); } : _.idtt;
  _.hi = _.Tap(_.log);
  _.Hi = function(pre) {
    return _.tap(function() {
      return console.log.apply(null, [pre].concat(_.toArray(arguments)))
    });
  };

  _.f = function(nodes) {
    var f = _.val(G, nodes);
    var err = Error('warning: ' + nodes + ' is not defined');
    return f || setTimeout(function() { (f = f || _.val(G, nodes)) || _.loge(err) }, 500)
      && function() { return (f || (f = _.val(G, nodes))).apply(this, arguments); }
  };
  _.v = _.val = function(obj, key, keys) {
    if (arguments.length == 1) return _.property(obj);
    return (function v(obj, i, keys, li) {
      return (obj = obj[keys[i]]) ? li == i ? obj : v(obj, i + 1, keys, li) : li == i ? obj : void 0;
    })(obj || {}, 0, keys = key.split('.'), keys.length - 1);
  };
  _.property = function(key) { return _(_.val, _, key); };
  _.propertyOf = function(obj) {
    return obj == null ? function() {} : function(key) { return obj[key]; };
  };

  each(['Arguments', /*'Function',*/ 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is_' + name.toLowerCase()] = _['is' + name] = function(obj) { return Object.prototype.toString.call(obj) === '[object ' + name + ']'; }
  });
  _.is_function = _.isFunction = function(fn) { return fn instanceof Function; };
  if (typeof /./ != 'function' && typeof Int8Array != 'object')
    _.is_function = _.isFunction = function(obj) { return typeof obj == 'function' || false; };
  _.is_object = _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };
  _.is_undefined = _.isUndefined = function(v) { return v === undefined; };
  var hasOwnProperty = Object.hasOwnProperty;
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  _.is_array_like = _.isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  var slice = Array.prototype.slice;
  _.rest = function f(array, n, guard) {
    if (_.isNumber(array)) return _(f, _, array);
    return slice.call(array, n == null || guard ? 1 : n);
  };
  _.values = function(obj) {
    var keys = _.keys(obj), length = keys.length, values = Array(length);
    for (var i = 0; i < length; i++) values[i] = obj[keys[i]];
    return values;
  };
  _.toArray = _.to_array = function(obj) {
    if (!obj) return [];
    return _.isArrayLike(obj) ? slice.call(obj) : _.values(obj);
  };
  _.keyval = _.obj = _.object = function f(list, values) {
    if (arguments.length == 1) return _(f, list);
    if (_.isString(list)) {
      var obj = {};
      obj[list] = values;
      return obj;
    }
    for (var result = {}, i = 0, length = getLength(list); i < length; i++)
      values ? result[list[i]] = values[i] : result[list[i][0]] = list[i][1];
    return result;
  };
  _.valkey = function(o, k) { return _.obj(k, o); };
  _.obj2 = _.object2 = function f(obj, keys1, keys2) {
    if (arguments.length == 2) return _(f, _, obj, keys1);
    return _.obj(_.wrap_arr(keys1), _.values(_.pick(obj, keys2)));
  };
  _.keys = _keys; function _keys(obj) {
    return _.isObject(obj) ? Object.keys(obj) : [];
  }
  _.size = function(obj) {
    if (obj == null) return 0;
    return _.isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };
  _.nest = function f(key, value) {
    if (arguments.length == 1) return _(f, key);
    return _.reduceRight(key.split('.'), _.valkey, value);
  };
  _.invert = _invert; function _invert(obj) {
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
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    if (_.isArray(obj)) return obj.slice();
    var cloned = _.extend({}, obj);
    delete cloned._memoize;
    return cloned;
  };
  _.is_empty = _.isEmpty = function (obj) {
    if (obj == null) return true;
    if (_.isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };
  _.memoize2 = function(mid) {
    return function(func) {
      var memoize_id = ++mid;
      var f = arguments.length == 1 ? func : __.apply(null, arguments);
      return function(obj) {
        return _.has(obj._memoize || (obj._memoize = function(){}), memoize_id) ?
          obj._memoize[memoize_id] : (obj._memoize[memoize_id] = f(obj));
      }
    }
  }(0);

  _.delay = function (func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function () {
      return func.apply(null, args);
    }, wait);
  };
  _.defer = _.partial(_.delay, _, 1);

  _.throttle = function (func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function () {
      previous = options.leading === false ? 0 : Date.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function () {
      var now2 = Date.now();
      if (!previous && options.leading === false) previous = now2;
      var remaining = wait - (now2 - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now2;
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
      var last = Date.now() - timestamp;
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
      timestamp = Date.now();
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
    return function () { return !predicate.apply(this, arguments); };
  };
  _.after = function (times, func) {
    return function () { if (--times < 1) return func.apply(this, arguments); };
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

  var eq = function(a, b, aStack, bStack) {
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    if (a == null || b == null) return a === b;
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        return '' + a === '' + b;
      case '[object Number]':
        if (+a !== +a) return +b !== +b;
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
        _.isFunction(bCtor) && bCtor instanceof bCtor)
        && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      if (aStack[length] === a) return bStack[length] === b;
    }

    aStack.push(a);
    bStack.push(b);

    if (areArrays) {
      length = a.length;
      if (length !== b.length) return false;
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      var keys = _.keys(a), key;
      length = keys.length;
      if (_.keys(b).length !== length) return false;
      while (length--) {
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }

    aStack.pop();
    bStack.pop();
    return true;
  };
  _.is_equal = _.isEqual = function f(a, b) { return arguments.length == 1 ? _(f, a) : eq(a, b); };

  _.is_match = _.isMatch = _.matcher = function f(object, attrs) {
    if (arguments.length == 1) return _(f, _, object);
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    for (var i = 0, obj = Object(object), key; i < length; i++)
      if (attrs[key = keys[i]] != obj[key] || !(key in obj)) return false;
    return true;
  };

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
  function times2(len, func) { for (var i = 1; i <= len; i++) func(i); }
  _.times = function(len, iteratee) { for (var i = 0; i < len; i++) iteratee(i); };

  var toString = Object.prototype.toString;
  _.is_finite = _.isFinite = function(obj) { return isFinite(obj) && !isNaN(parseFloat(obj)); };
  _.is_nan = _.isNaN = function(obj) { return _.isNumber(obj) && obj !== +obj; };
  _.is_boolean = _.isBoolean = function(obj) { return obj === true || obj === false || toString.call(obj) === '[object Boolean]'; };
  _.is_null = _.isNull = function(obj) { return obj === null; };
  _.is_numeric = _.isNumeric = function(n) { return !isNaN(parseFloat(n)) && isFinite(n); };
  _.is_array = _.isArray = Array.isArray;
  _.is_arguments = _.isArguments = function(obj) { return !!(obj && obj.callee) };
  _.is_element = _.isElement = function(obj) { return !!(obj && obj.nodeType === 1) };
  _.wrapArray = _.wrap_arr = function(v) { return _.isArray(v) ? v : [v]; };
  _.parseInt = _.parse_int = function(v) { return parseInt(v, 10); };
  try { var has_lambda = true; eval('a=>a'); } catch (err) { var has_lambda = false; }
  function lambda(str) {
    if (typeof str !== 'string') return str;
    str = str.replace(/\*\*/g, '"');
    str = str.replace(/\*/g, '"');
    if (!has_lambda) str = str.replace(/`/g, "'");
    if (lambda[str]) return lambda[str];
    if (!str.match(/=>/))
      return lambda[str = str.replace('#', '$.id==')] = new Function('$', 'return (' + str + ')');
    if (has_lambda) return lambda[str] = eval(str); // es6 lambda
    var ex_par = str.split(/\s*=>\s*/);
    return lambda[str] = new Function(
      ex_par[0].replace(/(?:\b[A-Z]|\.[a-zA-Z_$])[a-zA-Z_$\d]*|[a-zA-Z_$][a-zA-Z_$\d]*\s*:|this|arguments|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/g, '').match(/([a-z_$][a-z_$\d]*)/gi) || [],
      'return (' + ex_par[1] + ')');
  }
  _.l = _.lambda = _.Lambda = lambda;
  function bexdf(setter, obj1/* objs... */) {
    for (var i = 2, len = arguments.length; i < len; i++)
      if (obj1 && arguments[i]) setter(obj1, arguments[i]);
    if (obj1) delete obj1._memoize;
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

  function DataIter(args, num, thiz) {
    if (args.length > num) var data = args[args.length-num], iter = Iter(args);
    else var data = args[0], iter = args[1] || _.idtt;
    if (thiz != _ && thiz != G) iter = _.bind(iter, thiz);
    return [data, iter];
  }
  function Iter(args, is_reduce) {
    var start = is_reduce ? 3 : 2;
    var iter = args[args.length - (is_reduce ? 2 : 1)];
    var args2 = [];
    for (var i = 0, l = args.length-start; i < l; i++) args2[i] = args[i];
    args2[i+start] = args[args.length-2];
    if (iter._p_cb) args2.length++;
    var f = function() {
      args2[i] = arguments[0];
      args2[i+1] = arguments[1];
      if (is_reduce) args2[i+2] = arguments[2];
      if (iter._p_cb) args2[args2.length-1] = arguments[arguments.length-1];
      return iter.apply(null, args2);
    };
    f._p_async = iter._p_async, f._p_cb = iter._p_cb;
    return f;
  }

  var _each_async = function f(data, iter, keys, mp, i) {
    return _.go(mp, function() {
      var key = keys ? keys[i] : i;
      return (keys || data).length == i ? data : f(data, iter, keys, iter(data[key], key, data), ++i);
    });
  };
  _.each = function f(d, i) {
    if (arguments.length == 1) return _(f, ___, d);
    var dni = DataIter(arguments, 2, this), data = dni[0], iter = dni[1];
    var keys = _.isArrayLike(data) ? null : _.keys(data);
    if (iter._p_async || iter._p_cb) return _each_async(data, iter, keys, null, 0);

    if (keys) {
      if (!keys.length) return data;
      var mp = iter(data[keys[0]], keys[0], data);
      if (mp && (mp._mr ? maybe_promise_mr(mp) : mp.then && _.isFunction(mp.then)))
        return _each_async(data, iter, keys, mp, 1);
      for (var i = 1, l = keys.length; i < l; i++)
        iter(data[keys[i]], keys[i], data);
    } else {
      if (!data.length) return data;
      var mp = iter(data[0], 0, data);
      if (mp && (mp._mr ? maybe_promise_mr(mp) : mp.then && _.isFunction(mp.then)))
        return _each_async(data, iter, null, mp, 1);
      for (var i = 1, l = data.length; i < l; i++)
        iter(data[i], i, data);
    }

    return data;
  };

  var _map_async = function f(data, iter, keys, mp, i, res) {
    return _.go(mp, function(val) {
      if (i - 1 > -1) res[i-1] = val;
      var key = keys ? keys[i] : i;
      return (keys || data).length == i ? res : f(data, iter, keys, iter(data[key], key, data), ++i, res);
    });
  };
  _.map = function f(d, i) {
    if (arguments.length == 1) return _(f, ___, d);
    var dni = DataIter(arguments, 2, this), data = dni[0], iter = dni[1];
    var keys = _.isArrayLike(data) ? null : _.keys(data);
    if (iter._p_async || iter._p_cb) return _map_async(data, iter, keys, null, 0, []);

    var res = [];
    if (keys) {
      if (!keys.length) return res;
      var mp = iter(data[keys[0]], keys[0], data);
      if (mp && (mp._mr ? maybe_promise_mr(mp) : mp.then && _.isFunction(mp.then)))
        return _map_async(data, iter, keys, mp, 1, res);
      res[0] = mp;
      for (var i = 1, l = keys.length; i < l; i++)
        res[i] = iter(data[keys[i]], keys[i], data);
    } else {
      if (!data.length) return res;
      var mp = iter(data[0], 0, data);
      if (mp && (mp._mr ? maybe_promise_mr(mp) : mp.then && _.isFunction(mp.then)))
        return _map_async(data, iter, null, mp, 1, res);
      res[0] = mp;
      for (var i = 1, l = data.length; i < l; i++)
        res[i] = iter(data[i], i, data);
    }

    return res;
  };
  _.if_arr_map = function f(v, iter) {
    if (arguments.length == 1) return _(f, _, v);
    return _.is_array(v) ? _.map(v, iter) : iter(v);
  };

  var _reduce_async = function f(data, iter, keys, mp, i) {
    return _.go(mp, function(memo) {
      var key = keys ? keys[i] : i;
      return (keys || data).length == i ? memo : f(data, iter, keys, iter(memo, data[key], key, data), ++i);
    });
  };
  _.reduce = function f(d, i, m) {
    if (arguments.length == 1) return _(f, _, ___, d, _);
    if (arguments.length == 2 && _.isFunction(d)) return _(f, ___, d, _.isFunction(i) ? i : _(_.clone, i));
    if (arguments.length < 4) var data = d, iter = i, memo = m;
    else var data = arguments[arguments.length-3], iter = Iter(arguments, true), memo = arguments[arguments.length-1];
    memo = _.isFunction(memo) ? memo.call(this) : memo;

    if (this != _ && this != G) iter = _.bind(iter, this);
    var keys = _.isArrayLike(data) ? null : _.keys(data);
    var i = 0;
    if (iter._p_async || iter._p_cb)
      return _reduce_async(data, iter, keys, arguments.length > 2 ? memo : keys ? data[keys[i++]] : data[i++], i);

    if (keys) {
      memo = arguments.length > 2 ? memo : data[keys[i++]];
      var l = keys.length;
      if (!l || l==i) return memo;
      memo = iter(memo, data[keys[i]], keys[i++], data);
      if (memo && (memo._mr ? maybe_promise_mr(memo) : memo.then && _.isFunction(memo.then)))
        return _reduce_async(data, iter, keys, memo, i);
      for (; i < l; i++) memo = iter(memo, data[keys[i]], keys[i], data);
    } else {
      memo = arguments.length > 2 ? memo : data[i++];
      var l = data.length;
      if (!l || l==i) return memo;
      memo = iter(memo, data[i], i++, data);
      if (memo && (memo._mr ? maybe_promise_mr(memo) : memo.then && _.isFunction(memo.then)))
        return _reduce_async(data, iter, null, memo, i);
      for (; i < l; i++) memo = iter(memo, data[i], i, data);
    }

    return memo;
  };

  var _reduce_right_async = function f(data, iter, keys, mp, i) {
    return _.go(mp, function(memo) {
      var key = keys ? keys[i] : i;
      return (keys || data).length == i ? memo : f(data, iter, keys, iter(memo, data[key], key, data), ++i);
    });
  };
  _.reduceRight = _.reduce_right = function f(d, i, m) {
    if (arguments.length == 1) return _(f, _, ___, d, _);
    if (arguments.length == 2 && _.isFunction(d)) return _(f, ___, d, _.isFunction(i) ? i : _(_.clone, i));
    if (arguments.length < 4) var data = d, iter = i, memo = m;
    else var data = arguments[arguments.length-3], iter = Iter(arguments, true), memo = arguments[arguments.length-1];
    memo = _.isFunction(memo) ? memo.call(this) : memo;

    if (this != _ && this != G) iter = _.bind(iter, this);
    var keys = _.isArrayLike(data) ? null : _.keys(data);
    if (iter._p_async || iter._p_cb) {
      var i = (keys || data).length - 1;
      return _reduce_right_async(data, iter, keys, arguments.length > 2 ? memo : keys ? data[keys[i--]] : data[i--], i);
    }

    if (keys) {
      var i = keys.length - 1;
      memo = arguments.length > 2 ? memo : data[keys[i--]];
      if (!keys.length || i==-1) return memo;
      memo = iter(memo, data[keys[i]], keys[i--], data);
      if (memo && (memo._mr ? maybe_promise_mr(memo) : memo.then && _.isFunction(memo.then)))
        return _reduce_async(data, iter, keys, memo, i);
      for (; i > -1; i--) memo = iter(memo, data[keys[i]], keys[i], data);
    } else {
      var i = data.length - 1;
      memo = arguments.length > 2 ? memo : data[i--];
      if (!data.length || i==-1) return memo;
      memo = iter(memo, data[i], i--, data);
      if (memo && (memo._mr ? maybe_promise_mr(memo) : memo.then && _.isFunction(memo.then)))
        return _reduce_async(data, iter, null, memo, i);
      for (; i > -1; i--) memo = iter(memo, data[i], i, data);
    }

    return memo;
  };

  var _find_async = function f(data, predi, keys, mp, i) {
    return _.go(mp, function(bool) {
      if (bool) return data[keys ? keys[i-1] : i-1];
      var key = keys ? keys[i] : i;
      return (keys || data).length == i ? undefined : f(data, predi, keys, predi(data[key], key, data), ++i);
    });
  };
  _.find = function f(d, p) {
    if (arguments.length == 1) return _(f, ___, d);
    var dni = DataIter2(arguments, 2, this), data = dni[0], predi = dni[1];
    var keys = _.isArrayLike(data) ? null : _.keys(data);
    if (predi._p_async || predi._p_cb) return _find_async(data, predi, keys, null, 0);

    if (keys) {
      if (!keys.length) return;
      var mp = predi(data[keys[0]], keys[0], data);
      if (mp && (mp._mr ? maybe_promise_mr(mp) : mp.then && _.isFunction(mp.then)))
        return _find_async(data, predi, keys, mp, 1);
      else if (mp) return data[keys[0]];
      for (var i = 1, l = keys.length; i < l; i++)
        if (predi(data[keys[i]], keys[i], data)) return data[keys[i]];
    } else {
      if (!data.length) return;
      var mp = predi(data[0], 0, data);
      if (mp && (mp._mr ? maybe_promise_mr(mp) : mp.then && _.isFunction(mp.then)))
        return _find_async(data, predi, null, mp, 1);
      else if (mp) return data[0];
      for (var i = 1, l = data.length; i < l; i++)
        if (predi(data[i], i, data)) return data[i];
    }
  };

  var _filter_async = function f(data, predi, keys, mp, i, res) {
    return _.go(mp, function(bool) {
      if (bool) res.push(data[keys ? keys[i-1] : i-1]);
      var key = keys ? keys[i] : i;
      return (keys || data).length == i ? undefined : f(data, predi, keys, predi(data[key], key, data), ++i, res);
    });
  };
  _.filter = function f(d, p) {
    if (arguments.length == 1) return _(f, ___, d);
    var dni = DataIter2(arguments, 2, this), data = dni[0], predi = dni[1];
    var keys = _.isArrayLike(data) ? null : _.keys(data);
    if (predi._p_async || predi._p_cb) return _filter_async(data, predi, keys, null, 0, []);

    var res = [];
    if (keys) {
      if (!keys.length) return data;
      var mp = predi(data[keys[0]], keys[0], data);
      if (mp && (mp._mr ? maybe_promise_mr(mp) : mp.then && _.isFunction(mp.then)))
        return _filter_async(data, predi, keys, mp, 1, res);
      else if (mp) res.push(data[keys[0]]);
      for (var i = 1, l = keys.length; i < l; i++)
        if (predi(data[keys[i]], keys[i], data)) res.push(data[keys[i]]);
    } else {
      if (!data.length) return data;
      var mp = predi(data[0], 0, data);
      if (mp && (mp._mr ? maybe_promise_mr(mp) : mp.then && _.isFunction(mp.then)))
        return _filter_async(data, predi, null, mp, 1, res);
      else if (mp) res.push(data[0]);
      for (var i = 1, l = data.length; i < l; i++)
        if (predi(data[i], i, data)) res.push(data[i]);
    }

    return res;
  };

  var _reject_async = function f(data, predi, keys, mp, i, res) {
    return _.go(mp, function(bool) {
      if (!bool) res.push(data[keys ? keys[i-1] : i-1]);
      var key = keys ? keys[i] : i;
      return (keys || data).length == i ? undefined : f(data, predi, keys, predi(data[key], key, data), ++i, res);
    });
  };
  _.reject = function f(d, p) {
    if (arguments.length == 1) return _(f, ___, d);
    var dni = DataIter2(arguments, 2, this), data = dni[0], predi = dni[1];
    var keys = _.isArrayLike(data) ? null : _.keys(data);
    if (predi._p_async || predi._p_cb) return _reject_async(data, predi, keys, null, 0, []);

    var res = [];
    if (keys) {
      if (!keys.length) return data;
      var mp = predi(data[keys[0]], keys[0], data);
      if (mp && (mp._mr ? maybe_promise_mr(mp) : mp.then && _.isFunction(mp.then)))
        return _reject_async(data, predi, keys, mp, 1, res);
      else if (!mp) res.push(data[keys[0]]);
      for (var i = 1, l = keys.length; i < l; i++)
        if (!predi(data[keys[i]], keys[i], data)) res.push(data[keys[i]]);
    } else {
      if (!data.length) return data;
      var mp = predi(data[0], 0, data);
      if (mp && (mp._mr ? maybe_promise_mr(mp) : mp.then && _.isFunction(mp.then)))
        return _reject_async(data, predi, null, mp, 1, res);
      else if (!mp) res.push(data[0]);
      for (var i = 1, l = data.length; i < l; i++)
        if (!predi(data[i], i, data)) res.push(data[i]);
    }
    return res;
  };

  var _every_or_some_async = function f(data, predi, ks, mp, i, is_some) {
    return _.go(mp, function(bool) {
      if (is_some ? bool : !bool) return is_some;
      var k = ks ? ks[i] : i;
      return (ks || data).length == i ? true : f(data, predi, ks, predi(data[k], k, data), ++i, is_some);
    });
  };
  function every_or_some(is_some) {
    return function f(d, p) {
      if (arguments.length == 1 && _.isFunction(d)) return _(f, ___, d);
      var dni = DataIter2(arguments, 2, this), data = dni[0], predi = dni[1];
      var ks = _.isArrayLike(data) ? null : _.keys(data);
      if (predi._p_async || predi._p_cb) return _every_or_some_async(data, predi, ks, !is_some, 0, is_some);

      if (ks) {
        if (!ks.length) return false;
        var mp = predi(data[ks[0]], ks[0], data);
        if (mp && (mp._mr ? maybe_promise_mr(mp) : mp.then && _.isFunction(mp.then)))
          return _every_or_some_async(data, predi, ks, mp, 1, is_some);
        else if (is_some ? mp : !mp) return is_some;
        for (var i = 1, l = ks.length; i < l; i++)
          if (is_some ? predi(data[ks[i]], ks[i], data) : !predi(data[ks[i]], ks[i], data))
            return is_some;
      } else {
        if (!data.length) return false;
        var mp = predi(data[0], 0, data);
        if (mp && (mp._mr ? maybe_promise_mr(mp) : mp.then && _.isFunction(mp.then)))
          return _every_or_some_async(data, predi, null, mp, 1, is_some);
        else if (is_some ? mp : !mp) return is_some;
        for (var i = 1, l = data.length; i < l; i++)
          if (is_some ? predi(data[i], i, data) : !predi(data[i], i, data)) return is_some;
      }
      return !is_some;
    }
  }
  _.every = every_or_some(false);
  _.some = every_or_some(true);
  _.where = function(list, attrs) {
    if (arguments.length == 1) return _.filter(function(obj) { return _.is_match(obj, attrs) });
    return _.filter(list, function(obj) { return _.is_match(obj, attrs) });
  };
  _.findWhere = _.find_where = function(list, attrs) {
    if (arguments.length == 1) return _.find(function(obj) { return _.is_match(obj, attrs) });
    return _.find(list, function(obj) { return _.is_match(obj, attrs) });
  };
  _.contains = function(obj, item, fromIndex) {
    if (!_.isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number') fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };
  _.invoke = function(data, method) {
    var args = _.rest(arguments, 2), isFunc = _.isFunction(method);
    return _.map(data, function(value) {
      var func = isFunc ? method : value[method];
      return func && func.apply(value, args);
    });
  };
  _.pluck = function f(data, key) {
    return arguments.length == 1 ? _(f, _, data) : _.map(data, function(v) { return v[key]; });
  };
  _.deep_pluck = _.deepPluck = function f(data, keys) {
    if (arguments.length == 1) return _(f, _, data);
    keys = keys.split('.');
    var new_keys;
    return _.flatten(_.map(_.isArray(data) ? data : [data], function(val) {
      var current = val;
      var i = -1;
      while (++i < keys.length && _.isObject(current) && !_.isArray(current)) current = current[keys[i]];
      return i < keys.length && _.isObject(current) ? _.deep_pluck(current, new_keys || (new_keys = _.rest(keys, i).join('.'))) : current;
    }));
  };

  // async not supported
  _.max = function f(d, i) {
    if (arguments.length == 1 && _.isFunction(d)) return _(f, ___, d);
    var dni = DataIter2(arguments, 2, this), data = dni[0], iter = dni[1];

    if (_.isEmpty(data)) return -Infinity;
    var tmp, cmp, res;
    if (_.isArrayLike(data)) {
      if (isNaN(tmp = iter(res = data[0], 0, data))) return -Infinity;
      for (var i = 1, l = data.length; i < l; i++) {
        cmp = iter(data[i], i, data);
        if (cmp > tmp) { tmp = cmp; res = data[i]; }
      }
    } else {
      var keys = _.keys(data);
      if (isNaN(tmp = iter(res = data[keys[0]], keys[0], data))) return -Infinity;
      for (var i = 1, l = keys.length; i < l; i++) {
        cmp = iter(data[keys[i]], keys[i], data);
        if (cmp > tmp) { tmp = cmp; res = data[keys[i]]; }
      }
    }
    return res;
  };
  // async not supported
  _.min = function f(d, i) {
    if (arguments.length == 1 && _.isFunction(d)) return _(f, ___, d);
    var dni = DataIter2(arguments, 2, this), data = dni[0], iteratee = dni[1];
    if (_.isEmpty(data)) return Infinity;

    var tmp, cmp, res;
    if (_.isArrayLike(data)) {
      if (isNaN(tmp = iteratee(res = data[0], 0, data))) return Infinity;
      for (var i = 1, l = data.length; i < l; i++) {
        cmp = iteratee(data[i], i, data);
        if (cmp < tmp) { tmp = cmp; res = data[i]; }
      }
    } else {
      var keys = _.keys(data);
      if (isNaN(tmp = iteratee(res = data[keys[0]], keys[0], data))) return Infinity;
      for (var i = 1, l = keys.length; i < l; i++) {
        cmp = iteratee(data[keys[i]], keys[i], data);
        if (cmp < tmp) { tmp = cmp; res = data[keys[i]]; }
      }
    }
    return res;
  };

  function DataIter2(args, num, thiz) {
    if (args.length > num) var data = args[args.length-num], iter = Iter(args);
    else var data = args[0], iter = (_.isString(args[1]) ? _.val(args[1]) : args[1]) || _.idtt;
    if (thiz != _ && thiz != G) iter = _.bind(iter, thiz);
    return [data, iter];
  }
  // async not supported
  _.sortBy = _.sort_by = function f(d, i) {
    if (arguments.length == 1 && _.isFunction(d)) return _(f, ___, d);
    var dni = DataIter2(arguments, 2, this), data = dni[0], iter = dni[1];

    return _.pluck(_.map(data, function(value, index, list) {
      return { value: value, index: index, criteria: iter(value, index, list) };
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };
  // async not supported
  _.groupBy = _.group_by = function f(d, i) {
    if (arguments.length == 1 && _.isFunction(d)) return _(f, ___, d);
    var dni = DataIter2(arguments, 2, this), data = dni[0], iter = dni[1];

    var res = {}, arr = _.map(data, iter);
    for (var i = 0, l = arr.length; i < l ; i++)
      _.has(res, arr[i]) ? res[arr[i]].push(data[i]) : (res[arr[i]] = [data[i]]);
    return res;
  };
  // async not supported
  _.indexBy = _.index_by = function f(d, i) {
    if (arguments.length == 1 && _.isFunction(d)) return _(f, ___, d);
    var dni = DataIter2(arguments, 2, this), data = dni[0], iter = dni[1];

    var res = {}, arr = _.map(data, iter);
    for (var i = 0, l = arr.length; i < l; i++) res[arr[i]] = data[i];
    return res;
  };
  // async not supported
  _.countBy = _.count_by = function f(d, i) {
    if (arguments.length == 1 && _.isFunction(d)) return _(f, ___, d);
    var dni = DataIter2(arguments, 2, this), data = dni[0], iter = dni[1];

    var res = {}, arr = _.map(data, iter);
    for (var i = 0, l = arr.length; i < l; i++) res[arr[i]]++ || (res[arr[i]] = 1);
    return res;
  };

  _.shuffle = function(obj) {
    var set = _.isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };
  _.random = function(min, max) {
    if (max == null) max = min, min = 0;
    return min + Math.floor(Math.random() * (max - min + 1));
  };
  _.sample = function(data, num) {
    if (arguments.length == 2 && num < 1) return [];
    return num ? _.shuffle(data).slice(0, num) : _.shuffle(data)[0];
  };
  _.partition = function f(d, p) {
    if (arguments.length == 1 && _.isFunction(d)) return _(f, ___, d);
    var dni = DataIter2(arguments, 2, this), data = dni[0], predi = dni[1];

    if (this != _ && this != G) predi = _.bind(predi, this);
    var filter = [], reject = [];
    _.each(data, function(v, k, l) { (predi(v, k, l) ? filter : reject).push(v); });
    return [filter, reject];
  };

  _.first = _.head = _.take = function(ary, n, guard) {
    if (ary == null) return void 0;
    if (n == null || guard) return ary[0];
    return _.initial(ary, ary.length - n);
  };
  _.initial = function(ary, n, guard) {
    return slice.call(ary, 0, Math.max(0, ary.length - (n == null || guard ? 1 : n)));
  };
  _.last = function(ary, n, guard) {
    if (ary == null) return void 0;
    if (n == null || guard) return ary[ary.length - 1];
    return _.rest(ary, Math.max(0, ary.length - n));
  };

  _.compact = function(ary) { return _.filter(ary, _.identity); };
  _.without = function(ary) { return _.difference(ary, slice.call(arguments, 1)) };
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
  _.difference = function(list) {
    var rest = _.flatten(arguments, true, 1);
    return _.reject(list, function(value) { return _.contains(rest, value); });
  };

  _.zip = function() { return _.unzip(arguments); };
  _.unzip = function(ary) {
    var length = ary && _.max(ary, getLength).length || 0, result = Array(length);
    for (var index = 0; index < length; index++) result[index] = _.pluck(ary, index);
    return result;
  };

  // async not supported
  _.unique = _.uniq = function f(d, i) {
    if (arguments.length == 1 && _.isFunction(d)) return _(f, ___, d);
    var dni = DataIter2(arguments, 2, this), data = dni[0], iter = dni[1];

    var res = [], tmp = [], cmp = iter ? _.map(data, iter) : data;
    for (var i = 0, l = getLength(data); i < l; i++)
      if (tmp.indexOf(cmp[i]) == -1) { tmp.push(cmp[i]); res.push(data[i]); }
    return res;
  };

  function getLength(list) { return list == null ? void 0 : list.length; }

  // async not supported
  _.sortedIndex = _.sorted_i = function f(d, o, i) {
    if (_.isFunction(d)) return _(f, _, _, d);
    if (arguments.length > 3) {
      var data = arguments[arguments.length-3];
      var obj = arguments[arguments.length-2];
      var iter = _.apply(null, _.last(arguments, 1).concat(_.initial(arguments, 3)));
    } else {
      var data = d, obj = o, iter = i || _.idtt;
    }

    if (this != _ && this != G) iter = _.bind(iter, this);
    var value = iter(obj);
    var low = 0, high = getLength(data);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iter(data[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // async not supported
  _.find_i = _.findIndex = function f(d, p) {
    if (arguments.length == 1) return _(f, ___, d);
    var dni = DataIter(arguments, 2, this), data = dni[0], predi = dni[1];

    for (var i = 0, l = getLength(data); i < l; i++)
      if (predi(data[i], i, data)) return i;
    return -1;
  };

  // async not supported
  _.findLastIndex = _.find_last_i = function f(d, p) {
    if (arguments.length == 1) return _(f, ___, d);
    var dni = DataIter(arguments, 2, this), data = dni[0], predi = dni[1];

    for(var i = getLength(data) - 1; i >= 0; i--)
      if (predi(data[i], i, data)) return i;
    return -1;
  };

  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
          i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }
  _.index_of = _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.last_index_of = _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  _.range = function(start, stop, step) {
    if (stop == null) { stop = start || 0; start = 0; }
    step = step || 1;
    var length = Math.max(Math.ceil((stop - start) / step), 0), range = Array(length);
    for (var idx = 0; idx < length; idx++, start += step) range[idx] = start;
    return range;
  };

  // async not supported
  _.mapObject = _.map_object = function f(d, i) {
    if (arguments.length == 1) return _(f, ___, d);
    var dni = DataIter2(arguments, 2, this), data = dni[0], iter = dni[1];

    var res = {};
    for (var keys = _.keys(data), i = 0, l = keys.length; i < l; i++)
      res[keys[i]] = iter(data[keys[i]], keys[i], data);
    return res;
  };

  _.pairs = function(obj) {
    var keys = _.keys(obj), l = keys.length, res = Array(l);
    for (var i = 0; i < l; i++) res[i] = [keys[i], obj[keys[i]]];
    return res;
  };
  _.functions = function(obj) {
    var names = [];
    for (var key in obj) if (_.isFunction(obj[key])) names.push(key);
    return names.sort();
  };

  // async not supported
  _.find_k = _.find_key = _.findKey = function f(d, p) {
    if (arguments.length == 1) return _(f, ___, d);
    var dni = DataIter2(arguments, 2, this), data = dni[0], predi = dni[1];
    for (var keys = _.keys(data), key, i = 0, l = keys.length; i < l; i++)
      if (predi(data[key = keys[i]], key, data)) return key;
  };

  // async not supported
  _.pick = function f(d, i) { // (data, key1, key2, key3)은 지원 안됨
    if (arguments.length == 1) return _(f, ___, d);
    if (arguments.length == 2) var data = d, iter = i;
    else var data = arguments[arguments.length-2], iter = Iter(arguments);
    if (!data) return {};
    if (this != _ && this != G && _.isFunction(iter)) iter = _.bind(iter, this);
    var res = {};
    if (_.isFunction(iter)) {
      for (var keys = _.keys(data), i = 0, l = keys.length; i < l; i++) {
        var key = keys[i], val = data[key];
        if (iter(val, key, data)) res[key] = val;
      }
    } else {
      var keys = _.wrap_arr(iter);
      for (var i = 0, l = keys.length; i < l; i++) {
        var key = keys[i], val = data[key];
        if (val) res[key] = val;
      }
    }
    return res;
  };

  // async not supported
  _.omit = function f(d, i) { // (data, key1, key2, key3)은 지원 안됨
    if (arguments.length == 1) return _(f, ___, d);
    if (arguments.length == 2) var data = d, iter = i;
    else var data = arguments[arguments.length-2], iter = Iter(arguments);
    if (!data) return {};
    if (this != _ && this != G && _.isFunction(iter)) iter = _.bind(iter, this);
    var res = {};
    if (_.isFunction(iter)) {
      for (var keys = _.keys(data), i = 0, l = keys.length; i < l; i++)
        if (!iter(data[keys[i]], keys[i], data)) res[keys[i]] = data[keys[i]];
    } else {
      var oKeys = _.keys(data), keys = _.wrap_arr(iter);
      for (var i = 0, l = oKeys.length; i < l; i++)
        if (keys.indexOf(oKeys[i]) == -1) res[oKeys[i]] = data[oKeys[i]];
    }
    return res;
  };

  // template
  var TAB, TAB_SIZE, REG1, REG2, REG3, REG4 = {}, REG5, REG6, REG7, REG8;
  var s_matcher_reg1 = /\{\{\{.*?\}\}\}/g;
  var s_matcher_reg2 = /\{\{.*?\}\}/g;
  var insert_datas1 = _.partial(s_exec, s_matcher_reg1, _.escape); // {{{}}}
  var insert_datas2 = _.partial(s_exec, s_matcher_reg2, _.idtt); // {{}}

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

  _.template = _.t = function() { return s.apply(null, [convert_to_html].concat(_.toArray(arguments))); };
  _.template$ = _.t$ = function() { return s.apply(null, [convert_to_html, '$'].concat(_.toArray(arguments))); };
  _.string = _.s = function() { return s.apply(null, [_.idtt].concat(_.toArray(arguments))); };
  _.string$ = _.s$ = function() { return s.apply(null, [_.idtt, '$'].concat(_.toArray(arguments))); };

  var teach = function(_t, _memoize2) {
    return function() {
      _memoize2 = _memoize2 || _.idtt;
      var t = _memoize2(_t.apply(null, arguments));
      return _memoize2(function(data) {
        return _.go(arguments.length == 1 ?
            _.map(_.wrapArray(data), t) : _.map.apply(null, _.to_array(arguments).concat(t)),
          function(val) { return val.join(''); });
      });
    }
  };
  _.teach = _.template.each = _.t.each = teach(_.t);
  _.teach_memoize2 = teach(_.t, _.memoize2);
  _.seach = _.string.each = _.t.seach = teach(_.s);
  _.t$each = _.template$.each = _.t$.each = teach(_.t$);
  _.s$each = _.string$.each = _.t$.seach = teach(_.s$);

  function number_of_tab(a) {
    var snt = a.match(REG1)[0];
    var tab_length = (snt.match(/\t/g) || []).length;
    var space_length = snt.replace(/\t/g, "").length;
    return space_length / TAB_SIZE + tab_length;
  }
  _._ts_storage = {};
  function s(convert, var_names/*, source...*/) {
    var source = remove_comment(_.map(_.rest(arguments, 2), function(str_or_func) {
      if (_.isString(str_or_func)) return str_or_func;
      var key = _.uniqueId("func");
      _._ts_storage[key] = str_or_func;
      return '_p._ts_storage.' + key;
    }).join(""));

    var self = { matcher: {} };
    self.matcher[s_matcher_reg1] = s_matcher(3, s_matcher_reg1, source, var_names);
    source = source.replace(s_matcher_reg1, "__PJT__");
    self.matcher[s_matcher_reg2] = s_matcher(2, s_matcher_reg2, source, var_names);
    source = convert(source.replace(s_matcher_reg2, "{{}}").replace(/__PJT__/g, "{{{}}}"));

    return function() {
      return _.go(_.mr(source, arguments, self), insert_datas1, insert_datas2, _.idtt);
    }
  }
  function s_matcher(length, re, source, var_names) {
    return map(source.match(re), function(matched) {
      return new Function(var_names, "return " + matched.substring(length, matched.length-length) + ";");
    });
  }
  function remove_comment(source) {
    return source.replace(/\/\*(.*?)\*\//g, "").replace(REG2, "");
  }
  function s_exec(re, wrap, source, args, self) {
    var has_p = false;
    var vs = _.map(self.matcher[re], function(func) {
      var v = _.go(func.apply(null, args), wrap, return_check);
      if (maybe_promise(v)) has_p = true;
      return v;
    });
    return _.go(_.mr(source.split(re), has_p ? _.map(vs, _.async(_.idtt)) : vs),
      function(s, vs) { return _.mr(map(vs, function(v, i) { return s[i] + v; }).join("") + s[s.length-1], args, self); });
  }
  function convert_to_html(source) {
    var tag_stack = [], ary = source.match(REG3), btab = number_of_tab(ary[0]), is_paragraph = 0;
    ary[ary.length-1] = ary[ary.length-1].replace(REG4[btab] || (REG4[btab] = new RegExp(TAB+"{"+btab+"}$")), "");

    for (var i = 0; i < ary.length; i++) {
      while (number_of_tab(ary[i]) - btab < tag_stack.length) { //이전 태그 닫기
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

    return ary.join("");
  }
  function line(source, tag_stack) {
    source = source.replace(REG8, "\n").replace(/^[ \t]*/, "");
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
  // template end

  // mutable
  function _set(obj, key, valueOrFunc) {
    if (!_.isFunction(valueOrFunc)) return _.mr(obj[key] = valueOrFunc, key, obj);
    return _.go(_.mr(obj[key], key, obj), valueOrFunc, function(_value) { return _.mr(obj[key] = _value, key, obj) });
  }
  function _unset(obj, key) { var val = obj[key]; delete obj[key]; return _.mr(val, key, obj); }
  _.remove = _remove; function _remove(arr, remove) {
    return _.mr(remove, _.removeByIndex(arr, arr.indexOf(remove)), arr);
  }
  function _pop(arr) { return _.mr(arr.pop(), arr.length, arr); }
  function _shift(arr) { return _.mr(arr.shift(), 0, arr); }
  function _push(arr, itemOrFunc) {
    if (!_.isFunction(itemOrFunc)) return _.mr(itemOrFunc, arr.push(itemOrFunc), arr);
    return _.go(arr, itemOrFunc, function(_item) { return _.mr(_item, arr.push(_item), arr); });
  }
  function _unshift(arr, itemOrFunc) {
    if (!_.isFunction(itemOrFunc)) return _.mr(itemOrFunc, arr.unshift(itemOrFunc), arr);
    return _.go(arr, itemOrFunc, function(_item) { return _.mr(_item, arr.unshift(_item), arr); });
  }
  _.remove_by_i = _.removeByIndex = function(arr, from) {
    if (from !== -1) {
      var rest = arr.slice(from + 1 || arr.length);
      arr.length = from;
      arr.push.apply(arr, rest);
    }
    return from;
  };

  // mutable/immutable with selector
  _.sel = _.select = function(start, selector) {
    return selector && _.reduce(selector.split(/\s*->\s*/), function (mem, key) {
        if (!mem || !key) return;
        return !key.match(/^\((.+)\)/) ? (!key.match(/\[(.*)\]/) ? mem[key] : function(mem, numbers) {
          if (numbers.length > 2 || numbers.length < 1 || _.filter(numbers, function(v) { return isNaN(v); }).length) return _.Err('[] selector in [num] or [num ~ num]');
          var s = numbers[0], e = numbers[1]; return !e ? mem[s<0 ? mem.length+s : s] : slice.call(mem, s<0 ? mem.length+s : s, e<0 ? mem.length+e : e + 1);
        }(mem, _.map(RegExp.$1.replace(/\s/g, '').split('~'), _.parseInt))) : _.find(mem, _.lambda(RegExp.$1));
      }, start);
  };

  _.extend(_, {
    set: function f(start, selector, value) {
      if (arguments.length == 2) return _(f, _, start, selector);
      if (arguments.length == 1) return _(f, _, start);
      var _arr = selector.split(/\s*->\s*/), last = _arr.length - 1;
      return _.mr_cat(start, _set(_arr.length == 1 ? start : _.sel(start, _arr.slice(0, last).join('->')), _arr[last], value));
    },
    unset: function(start, selector) {
      var _arr = selector.split(/\s*->\s*/), last = _arr.length - 1;
      return _.mr_cat(start, _unset(_arr.length == 1 ? start : _.sel(start, _arr.slice(0, last).join('->')), _arr[last]));
    },
    remove2: function(start, selector, remove) {
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

  _.immutable = _.im = _.extend(function(start, selector) {
    var im_start = _.clone(start);
    return {
      start: im_start,
      selected: _.reduce(selector.split(/\s*->\s*/), function(clone, key) {
        return !key.match(/^\((.+)\)/) ? /*start*/(!key.match(/\[(.*)\]/) ? clone[key] = _.clone(clone[key]) : function(clone, numbers) {
          if (numbers.length > 2 || numbers.length < 1 || _.filter(numbers, _.pipe(_.identity, isNaN)).length) return _.Err('[] selector in [num] or [num ~ num]');
          var s = numbers[0], e = numbers[1]; return !e ? clone[s] = _.clone(clone[s<0 ? clone.length+s : s]) : function(clone, oris) {
            return each(oris, function(ori) { clone[clone.indexOf(ori)] = _.clone(ori); });
          }(clone, slice.call(clone, s<0 ? clone.length+s : s, e<0 ? clone.length+e : e + 1));
        }(clone, map(RegExp.$1.replace(/\s/g, '').split('~'), _.pipe(_.identity, parseInt))))/*end*/ :
          function(clone, ori) { return clone[clone.indexOf(ori)] = _.clone(ori); } (clone, _.find(clone, _.lambda(RegExp.$1)))
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
    remove2: function(start, selector, remove) {
      var _arr = selector.split(/\s*->\s*/), im = _.im(start, selector);
      if (remove) return to_mr([start].concat(_remove(im.selected, remove)));
      return _.mr_cat(im.start, _remove(_.sel(im.start, _arr.slice(0, _arr.length - 1).join('->')), im.selected));
    },
    extend: function(start/*, objs*/) {
      return _.extend.apply(null, [_.is_array(start) ? [] : {}, start].concat(_.toArray(arguments).slice(1, arguments.length)));
    },
    defaults: function(start/*, objs*/) {
      return _.defaults.apply(null, [_.is_array(start) ? [] : {}, start].concat(_.toArray(arguments).slice(1, arguments.length)));
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

  function Box() {}
  function help_result(result, box) {
    result[0] = box || _.box(result[0]);
    return result;
  }
  _.box = function (key, value) {
    var _box_data = new Box();
    var is_string = _.isString(key), k;
    if (is_string && arguments.length == 2) _box_data[key] = value;
    else if (!is_string && arguments.length == 1) for (k in key) _box_data[k] = key[k];
    var _box = function() { return _box_data; };
    return _.extend(_box, {
      select: select,
      sel: select,
      set: function (el, value) {
        var selector = make_selector(el), result = help_result(_.set(_box_data, selector, value), _box);
        return result;
      },
      unset: function(el) {
        var selector = make_selector(el), result = help_result(_.unset(_box_data, selector), _box);
        return result;
      },
      remove2: function(el) {
        var selector = make_selector(el), result = help_result(_.remove2(_box_data, selector), _box);
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
        return result;
      },
      defaults2: function(el) {
        var selector = make_selector(el), result = help_result(_.defaults2.apply(null, [_box_data, selector].concat(_.toArray(arguments).slice(1, arguments.length))), _box);
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
        remove2: function(el) {
          return help_result(_.im.remove2(_box_data, make_selector(el)));
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
    function select(el) {
      if (!el || _.isArrayLike(el) && !el.length) return ;
      var selector = make_selector(el);
      return _.select(_box_data, selector);
    }
    function make_selector(el) {
      return _.isString(el) ? el : _.isArray(el) ? map(el, function(val) {
        return (_.isString(val) ? val : (_.isArrayLike(val) ? val[0] : val).getAttribute('box_selector'));
      }).join('->') : (_.isArrayLike(el) ? el[0] : el).getAttribute('box_selector');
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
}(typeof global == 'object' && global.global == global && (global.G = global) || (window.G = window));