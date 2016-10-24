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
    return function() { return fn.apply(this, merge_args(args1, arguments, args3)); };
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
    while (f = fs[++i]) v = (v && v._mr) ? f.apply(self, v) : f.call(self, v);
    return v;
  }
  function pipea2(v, fs) {
    var i = 0, f;
    while (f = fs[++i]) v = (v && v._mr) ? f.apply(undefined, v) : f(v);
    return v;
  }
  function mr() {
    arguments._mr = true;
    return arguments;
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

  _.Tap = _.tap = function() {
    // var fns = C.toArray(arguments);
    // return function() { return A(arguments, fns.concat([J(arguments), toMR]), this); };
  };
  // B.boomerang = function() { // fork
  //   var fns = arguments;
  //   return JCB(function(res, cb) {
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
  //   err = isMR(err) ? err[0] : err;
  //   return err && err.constructor == Error && err._ABC_is_err;
  // }

  // TODO
  _.async = {};
  _.async.Pipe = _.Pipe;
  _.async.Indent = _.Indent;
  _.async.pipe = _.pipe;
  _.async.pipec = _.pipec;
  _.async.pipea = _.pipea;

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
  _.Always = _.always = function(v) { return function() { return v; }; };
  _.true = _.Always(true);
  _.false = _.Always(false);
  _.null = _.Always(null);
  _.not = function(v) { return !v; };
  _.nnot = function(v) { return !!v; };
  _.log = window.console && window.console.log ? console.log.bind ? console.log.bind(console) : function() { console.log.apply(console, arguments); } : I;
  _.loge = window.console && window.console.error ? console.error.bind ? console.error.bind(console) : function() { console.error.apply(console, arguments); } : I;
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
  _.escape = (function(map) {
    var escaper = function(match) { return map[match]; };
    var source = '(?:' + Object.keys(map).join('|') + ')';
    var testRegexp = RegExp(source), replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  })({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '`': '&#x60;'});
  var idCounter = 0;
  _.unique_id = _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };
  _.clone = function(obj) {
    return !_.isObject(obj) ? obj : _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };
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

  _.keys = function(obj) { return _.isObject(obj) ? Object.keys(obj) : []; };
  _.is_array = _.isArray = Array.isArray;
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
  };
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
  _.method =function(obj, method) { return obj[method].apply(obj, _.rest(arguments, 2)); };

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
    push: function (start, selector, item) { return _.to_mr([start].concat(_.push(_.sel(start, selector), item))); },
    unshift: function (start, selector, item) { return _.to_mr([start].concat(_.unshift(_.sel(start, selector), item))); },
    im: _.extend(function (start, selector) {
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
      push: function (start, selector, item) {
        var im = _.sel.im(start, selector);
        return _.to_mr([im.start].concat(_.push(im.selected, item)));
      },
      unshift: function (start, selector, item) {
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

  /* each - reduce */
  function Iter(iter, args, num) {
    if (args.length == num) return iter;
    var args2 = _.rest(args, num);
    var args3;
    return function() {
      if (args3) for (var i = 0, l = arguments.length; i < l; i++) args3[i] = arguments[i];
      else args3 = _.to_array(arguments).concat(args2);
      return iter.apply(null, args3);
    }
  }

  _.map = function(data, iteratee) {
    iteratee = Iter(iteratee, arguments, 2);
    if (_.isArrayLike(data)) {
      for (var i = 0, l = data.length, res = Array(l); i < l; i++)
        res[i] = iteratee(data[i], i, data);
    } else {
      for (var keys = _.keys(data), i = 0, l = keys.length, res = Array(l); i<l; i++)
        res[i] = iteratee(data[keys[i]], keys[i], data);
    }
    return res;
  };

  _.each = function(data, iteratee) {
    iteratee = Iter(iteratee, arguments, 2);
    if (_.isArrayLike(data)) {
      for (var i = 0, l = data.length; i < l; i++)
        iteratee(data[i], i, data);
    } else {
      for (var k in data)
        iteratee(data[k], k, data);
    }
    return data;
  };

  _.filter = function(data, predicate) {
    predicate = Iter(predicate, arguments, 2);
    var res = [];
    if (_.isArrayLike(data)) {
      for (var i = 0, l = data.length; i < l; i++)
        if (predicate(data[i], i, data)) res.push(data[i]);
    } else {
      for (var keys = _.keys(data), i = 0, l = keys.length; i < l; i++)
        if (predicate(data[keys[i]], keys[i], data)) res.push(data[keys[i]]);
    }
    return res;
  };

  _.reject = function(data, predicate) {
    predicate = Iter(predicate, arguments, 2);
    var res = [];
    if (_.isArrayLike(data)) {
      for (var i = 0, l = data.length; i < l; i++)
        if (!predicate(data[i], i, data)) res.push(data[i]);
    } else {
      for (var keys = _.keys(data), i = 0, l = keys.length; i < l; i++)
        if (!predicate(data[keys[i]], keys[i], data)) res.push(data[keys[i]]);
    }
    return res;
  };

  _.find = function(data, predicate) {
    predicate = Iter(predicate, arguments, 2);
    if (_.isArrayLike(data)) { // 배열, 문자열일 경우
      for (var i = 0, l = data.length; i < l; i++)
        if (predicate(data[i], i, data)) return data[i];
    } else { // 안배열. 객체일 경우
      for (var keys = _.keys(data), i= 0, l = keys.length; i<l; i++)
        if(predicate(data[keys[i], keys[i], data])) return data[keys[i]];
    }
  };

  _.reduce = function(data, predicate) {
    predicate = Iter(predicate, arguments, 2);
    if (_.isArrayLike(data)) {
      for (var res = data[0], i = 1, len = data.length; i < len; i++)
        res = predicate(res, data[i], i, data);
    } else {
      var keys = _.keys(data);
      for (var res = data[keys[0]], i = 1, len = keys.length; i < len; i++)
        res = predicate(res, data[keys[i]], i, data);
    }
    return res;
  };

  _.find_i = _.find_idx = _.findIndex = function(ary, predicate) {
    for (var i = 0, l = ary.length; i < l; i++)
      if (predicate(ary[i], i, ary)) return i;
  };

  _.find_k = _.find_key = _.findKey = function(obj, predicate) {
    var keys = _.keys(obj), key;
    for (var i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  _.every = function(data, predicate) {
    predicate = Iter(predicate, arguments, 2);
    if (_.isArrayLike(data)) {
      for (var i = 0, l = data.length; i < l; i++)
        if (!predicate(data[i], i, data)) return false;
    } else {
      for (var k in data)
        if (!predicate(data[k], k, data)) return false;
    }
    return true;

  };

  _.some = function(data, predicate) {
    predicate = Iter(predicate, arguments, 2);
    if (_.isArrayLike(data)) {
      for (var i = 0, l = data.length; i < l; i++)
        if (predicate(data[i], i, data)) return true;
    } else {
      for (var k in data)
        if (predicate(data[k], k, data)) return true;
    }
    return false;
  };

  // 객체['key']
  _.uniq = function(ary, iteratee) { // 배열만
    var tmp, res = {}, new_ary = [];
    for (var i = 0, l = ary.length; i < l; i++) {
      tmp = iteratee(ary[i], i, ary);
      if (!res[tmp]) { res[tmp] = true; new_ary.push(ary[i]); }
    }
    return new_ary;
  };

  // indexOf()
  _.uniq = function(ary, iteratee) { // 배열만
    var tmp, res = [], new_ary = [];
    for (var i = 0, l = ary.length; i < l; i++) {
      tmp = iteratee(ary[i], i, ary);
      if (res.indexOf(tmp) == -1) { res.push(tmp); new_ary.push(ary[i]); }
    }
    return new_ary;
  };

  _.all = function(args) {
    var res = [], tmp;
    for (var i = 1, l = arguments.length; i < l; i++) {
      tmp = _.is_mr(args) ? arguments[i].apply(null, args) : arguments[i](args);
      if (_.is_mr(tmp))
        for (var j=0, len=tmp.length; j<len; j++) res.push(tmp[j]);
      else
        res.push(tmp);
    }
    return _.to_mr(res);
  };

  _.spread = function(args) {
    var fns = _.rest(arguments, 1), res = [], value;

    for (var i = 0, fl = fns.length, al = args.length; i < fl && i < al; i++) {
      value = fns[i] ? fns[i](args[i] ? args[i] : _.noop) : _.i(args[i]);

      if (_.is_mr(value) && (value = _.toArray(value)))
        while (value.length) res.push(value.shift());
      else
        res.push(value);
    }

    return _.to_mr(res);
  };

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
  // function maybe_promise(res) { return C.isObject(res) && res.then && C.isFunction(res.then); }
  // function unpack_promise(res, callback) {
  //   var is_r = isMR(res);
  //   return (function u(i, res, length, has_promise) {
  //     if (i == length) {
  //       has_promise && callback(is_r ? res : res[0]);
  //       return;
  //     }
  //     return maybe_promise(res[i]) && (has_promise = true) ? (function(i) {
  //       res[i].then(function(v) {
  //         res[i] = v;
  //         u(i + 1, res, length, has_promise);
  //       });
  //       return true;
  //     })(i) : u(i + 1, res, length, has_promise);
  //   })(0, (res = is_r ? res : [res]), res.length, false);
  // }
  /* async pipe */
  // function C() {
  //   var context = this;
  //   var args = C.toArray(arguments);
  //   if (!C.isArray(args[args.length - 1])) args[args.length - 1] = [args[args.length - 1]];
  //   var fns = C.flatten(args.pop());
  //
  //   if (args.length == 1 && isMR(args[0])) args = args[0];
  //
  //   var i = 0, promise = null, resolve = null, fns_len = fns.length;
  //   function cp() { return hasPromise() ? new Promise(function(rs) { resolve = rs; }) : { then: function(rs) { resolve = rs; } } }
  //   return (function c(res) {
  //     do {
  //       if (i === fns_len) return !promise ? res : resolve ? C.lambda(resolve)(res) : setTimeout(function() { resolve && C.lambda(resolve)(res); }, 0);
  //       if (fns[i] && ((isERR(res) && !fns[i]._ABC_is_catch) || (!isERR(res) && fns[i]._ABC_is_catch)) && i++) continue;
  //       if (unpack_promise(res, c)) return promise || (promise = cp());
  //       try {
  //         if (!fns[i]._ABC_is_cb && !fns[i]._ABC_just_cb) res = C.lambda(fns[i++]).apply(context, C.args.trim(MRI(res)));
  //         else if (!fns[i]._ABC_is_cb) C.lambda(fns[i++]).apply(context, C.args.trim(MRI(res)).concat(function() { res = toMR(arguments); }));
  //       } catch (e) { res = ERR(e); }
  //     } while (i == fns_len || i < fns_len && !fns[i]._ABC_is_cb);
  //     if ((promise || (promise = cp())) && unpack_promise(res, c)) return promise;
  //     try { C.lambda(fns[i++]).apply(context, C.args.trim(MRI(res)).concat(function() { arguments.length <= 1 ? c.apply(null, arguments) : c(toMR(arguments)); })); }
  //     catch (e) { c(ERR(e)); }
  //     return promise;
  //   })(toMR(args));
  // }
  // function MRI(res) { return isMR(res) ? res : [res]; }
  // function ERR(err, data) {
  //   setTimeout(function() { err._ABC_caught || C.error(err); }, 500);
  //   return err = C.extend(err.constructor == Error ? err : new Error(err), data, {_ABC_is_err: true});
  // }
  /* ERR와 CATCH는 if나 switch나 다른 구조를 만들어서 해결할지 고민 */
  // F.ERR = window.ERR = ERR;
  // F.CATCH = window.CATCH = function(f) {
  //   return C.extend(function(err) { return (err._ABC_caught = true) && f.apply(this, arguments); },
  //     {_ABC_is_catch: true, _ABC_is_cb: f._ABC_is_cb, _ABC_just_cb: f._ABC_just_cb});
  // };

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

}(typeof global == 'object' && global.global == global && (global.G = global) || window);