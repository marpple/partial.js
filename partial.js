!function(G) {
  function _(fn) {
    fn = lambda(fn);
    var args1 = [], args3, len = arguments.length, ___idx = len;
    for (var i = 1; i < len; i++) {
      var arg = arguments[i];
      if (arg == ___ && (___idx = i) && (args3 = [])) continue;
      if (i < ___idx) args1.push(arg);
      else args3.push(arg);
    }
    return function() { return fn.apply(this, merge_args(args1, arguments, args3)); };
  }
  function _to_unde(args1, args2, args3) {
    if (args2) args1 = args1.concat(args2);
    if (args3) args1 = args1.concat(args3);
    for (var i = 0, len = args1.length; i < len; i++) if (args1[i] == _) args1[i] = undefined;
    return args1;
  }
  function merge_args(args1, args2, args3) {
    if (!args2.length) return args3 ? _to_unde(args1, args3) : _to_unde(clone(args1));
    var n_args1 = clone(args1), args2 = _.to_array(args2), i = -1, len = n_args1.length;
    while (++i < len) if (n_args1[i] == _) n_args1[i] = args2.shift();
    if (!args3) return _to_unde(n_args1, args2.length ? args2 : undefined);
    var n_arg3 = clone(args3), i = n_arg3.length;
    while (i--) if (n_arg3[i] == _) n_arg3[i] = args2.pop();
    return args2.length ? _to_unde(n_args1, args2, n_arg3) : _to_unde(n_args1, n_arg3);
  }
  var window = typeof window != 'object' ? G : window;
  window._ ? window.__ = _ : window._ = _;
  var ___ = window.___ = ___;

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
  function rest(array, n, guard) { return slice.call(array, n == null || guard ? 1 : n); };
  _.rest = rest;
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
  function clone(obj) { return !_.isObject(obj) ? obj : _.isArray(obj) ? obj.slice() : _.extend({}, obj); };
  _.clone = clone;
  // </respect _>

  function each(list, iter, start) {
    if (!list) return list;
    for (var i = start || 0, length = list.length; i < length ;i++) iter(list[i], i, list);
    return list;
  }
  _.keys = function(obj) {
    return _.isObject(obj) ? Object.keys(obj) : [];
  };
  _.is_array = _.isArray = Array.isArray;
  _.wrapArray = _.wrap_arr = function(v) { return _.isArray(v) ? v : [v]; };
  try { var has_lambda = true; eval('a=>a'); } catch (err) { var has_lambda = false; }
  function lambda(str) {
    if (typeof str !== 'string') return str;
    if (!str.match(/=>/)) return new Function('$', 'return (' + str + ')');
    if (has_lambda) return eval(str); // es6 lambda
    var ex_par = str.split(/\s*=>\s*/);
    return new Function(
      ex_par[0].replace(/(?:\b[A-Z]|\.[a-zA-Z_$])[a-zA-Z_$\d]*|[a-zA-Z_$][a-zA-Z_$\d]*\s*:|this|arguments|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/g, '').match(/([a-z_$][a-z_$\d]*)/gi) || [],
      'return (' + ex_par[1] + ')');
  };
  _.lambda = lambda;
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

  _.pipe = function() {};
  _.mr = function() {};

}(typeof global == 'object' && global.global == global && (global.G = global) || window);

