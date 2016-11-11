/**
 * Created by marpple on 2016. 10. 27..
 */

// 합치기 전

_.T = function() { // var names, source...
  return s.apply(null, [_.T, '_.T', convert_to_html, _.pipe, {}].concat(_.toArray(arguments)));
};

_.T$ = function() { // source...
  return s.apply(null, [_.T$, '_.T$', convert_to_html, _.pipe, {}, '$'].concat(_.toArray(arguments)));
};


_.t = function(args) { // _.mr(인자들), var names, source...
  var f = s.apply(null, [_.t, '_.t', convert_to_html, _.pipe, null].concat(_.rest(arguments)));
  return _.is_mr(args) ? f.apply(null, args) : f(args);
};

_.t$ = function(args) { // _.mr(인자들), source...
  var f = s.apply(null, [_.t$, '_.t$', convert_to_html, _.pipe, null, '$'].concat(_.rest(arguments)));
  return _.is_mr(args) ? f.apply(null, args) : f(args);
};

_.t.func_storage = {};





_.S = function() { // var names, source...
  return s.apply(null, [_.S, '_.S', _.mr, _.pipe, {}].concat(_.toArray(arguments)));
};

_.S$ = function() { // source...
  return s.apply(null, [_.S$, '_.S$', _.mr, _.pipe, {}].concat('$').concat(_.toArray(arguments)));
};


_.s = function(args) { // _.mr(인자들), var names, source...
  var f = s.apply(null, [_.s, '_.s', _.mr, _.pipe, null].concat(_.rest(arguments)));
  return _.is_mr(args) ? f.apply(null, args) : f(args);
};

_.s$ = function(args) { // _.mr(인자들), source...
  var f = s.apply(null, [_.s$, '_.s$', _.mr, _.pipe, null].concat('$').concat(_.rest(arguments)));
  return _.is_mr(args) ? f.apply(null, args) : f(args);
};

_.s.func_storage = {};


function s(func, func_name, convert, pipe, self, var_names/*, source...*/) {      // used by H and S
  var source = _.map(_.rest(arguments, 6), function(str_or_func) {
    if (_.isString(str_or_func)) return str_or_func;

    var key = _.uniqueId("func_storage");
    func._ABC_func_storage[key] = str_or_func;
    return func_name + ".func_storage." + key;
  }).join("");

  return function() {
    return pipe(_.mr(source, var_names, arguments, self), remove_comment, convert, insert_datas1, insert_datas2, _.i);
  }
}











_.Template.each = _.T.each = function() {
  return s_each.apply(null, [_.T].concat(_.toArray(arguments)));
};

_.String.each = _.S.each = function() { // 'var names', '소스'
  return s_each.apply(null, [_.S].concat(_.toArray(arguments)));
};
// ("var names", "source")(ary, a, b)


// (_.mr(ary, a, b), "var names", "source")
_.template.each = _.t.each = function(args) {
  var f = s_each.apply(null, [_.T].concat(_.rest(arguments)));
  return _.is_mr(args) ? f.apply(null, args) : f(args);
};

_.string.each = _.s.each = function(args) { // mr(datas)| |data, 'var names', '소스'
  var f = s_each.apply(null, [_.S].concat(_.rest(arguments)));
  return _.is_mr(args) ? f.apply(null, args) : f(args);
};


//변경 전
function s_each(func, var_names/*, source...*/) {     // used by H.each and S.each
  var map = _.partial(_.map, _, func.apply(null, _.rest(arguments)));
  return function(ary /*, args...*/) {
    return pipe(ary, _.partial.apply(null, [map, _].concat(_.rest(arguments))), function(res) { return res.join(""); });
  };
}







// 변경 후
function s_each(func, pipe/*, var_names, source...*/) {     // used by H.each and S.each
  var map = _.partial(_.map, _, func.apply(null, _.rest(arguments, 2)));
  return function(ary /*, args...*/) {
    return pipe(ary, _.partial.apply(null, [map, _].concat(_.rest(arguments))), function(res) { return res.join(""); });
  };
}

_.Template.each = _.T.each = function() { // var_names, source...
  return s_each.apply(null, [_.T, _.pipe].concat(_.toArray(arguments)));
};

_.template.each = _.t.each = function(args) { // _.mr(datas..), var_names, source...
  //return s_each.apply(null, [_.t, args]);
  return s_each.apply(null, [_.t, _.pipe].concat(_.toArray(arguments)));
};






// 다시 변경


_.template.each = _.t.each = function(args) { // _.mr(datas..), var_names, source...

  var map = _.partial(_.map, _, _.t.apply(null, _.rest(arguments)));
  var ary;
  if (_.is_mr(args)) ary = args.shift();
  else {ary = args; args = []; }

  return _.pipe(ary, _.partial.apply(null, [map, _].concat([args])), function(res) { return res.join(""); });

  //return _.pipe(ary, _.partial.apply(null, [map, _].concat(_.rest(arguments))), function(res) { return res.join(""); });

};


_.t(_.mr(ary, d1, d2), "var names", "source...");


_.template.each = _.t.each = function(args) { // _.mr(datas..), var_names, source...
  var ary;
  if (_.is_mr(args)) ary = args.shift();
  else { ary = args; args = []; }
  //return _.pipe(ary, _.partial(_.map, _, _.partial(_.t, _, _, _, args)), function(res) { return res.join(""); });
  return _.pipe(ary, _.partial(_.map, _, _.partial.apply([_.t, _, _, _].concat(args))), function(res) { return res.join(""); });

};





































































// memo 필요없는 애들 공통 limiter
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
};

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
};

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
};

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
};

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
};

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
};

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
};
