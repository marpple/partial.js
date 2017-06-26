(function($){
  // var $widget_wrap = $('.widget-wrap');
  //
  // $(document).on('scroll', function() {
  //    if (this.body.scrollTop > 65) {
  //      $widget_wrap.addClass('widget-fixed')
  //    } else {
  //      $widget_wrap.removeClass('widget-fixed')
  //    }
  // });


  if (/docs/.test(window.location.href))
    _.go($('h3'),
      _.take(3), _.rest, _.to_mr,
      _.spread(
        function(v) { v.id = '_' },
        function(v) { v.id = '___' }));

  var tags = _.map($('#sidebar a'), _.v('hash'));
  var idx = 0, len = tags.length - 1, move_href = function(href) { window.location.href = href; };

  _.go($(document),
    _('on', 'keydown', function(e) {
      if (window.location.hash) idx = _.index_of(tags, window.location.hash);
      if (e.which == 74) { move_href(tags[idx < len ? ++idx : len]) }
      if (e.which == 75) { move_href(tags[idx > 0 ? --idx : 0]) }
    }));

  // Page Position hold
  var $sidebar = $('#sidebar'), $main = $('#main');
  $main.on('scroll', function() { sessionStorage.mainState = $main.scrollTop(); });
  $sidebar.on('scroll', function() { sessionStorage.sidebarState = $sidebar.scrollTop(); });

  window.addEventListener('DOMContentLoaded', function() {
    sessionStorage.currentLocation = window.location.href;
    if (sessionStorage.prevLocation == sessionStorage.currentLocation) {
      if (sessionStorage.mainState != "undefined") $main.scrollTop(sessionStorage.mainState);
      if (sessionStorage.sidebarState != "undefined") $sidebar.scrollTop(sessionStorage.sidebarState);
    }
    sessionStorage.mainState = sessionStorage.sidebarState = undefined;
    sessionStorage.prevLocation = sessionStorage.currentLocation;
  });

  // Search
  var $searchWrap = $('#search-form-wrap'),
    isSearchAnim = false,
    searchAnimDuration = 200;

  var startSearchAnim = function(){
    isSearchAnim = true;
  };

  var stopSearchAnim = function(callback){
    setTimeout(function(){
      isSearchAnim = false;
      callback && callback();
    }, searchAnimDuration);
  };

  $('#nav-search-btn').on('click', function(){
    if (isSearchAnim) return;

    startSearchAnim();
    $searchWrap.addClass('on');
    stopSearchAnim(function(){
      $('.search-form-input').focus();
    });
  });

  $('.search-form-input').on('blur', function(){
    startSearchAnim();
    $searchWrap.removeClass('on');
    stopSearchAnim();
  });

  // Share
  $('body').on('click', function(){
    $('.article-share-box.on').removeClass('on');
  }).on('click', '.article-share-link', function(e){
    e.stopPropagation();

    var $this = $(this),
      url = $this.attr('data-url'),
      encodedUrl = encodeURIComponent(url),
      id = 'article-share-box-' + $this.attr('data-id'),
      offset = $this.offset();

    if ($('#' + id).length){
      var box = $('#' + id);

      if (box.hasClass('on')){
        box.removeClass('on');
        return;
      }
    } else {
      var html = [
        '<div id="' + id + '" class="article-share-box">',
          '<input class="article-share-input" value="' + url + '">',
          '<div class="article-share-links">',
            '<a href="https://twitter.com/intent/tweet?url=' + encodedUrl + '" class="article-share-twitter" target="_blank" title="Twitter"></a>',
            '<a href="https://www.facebook.com/sharer.php?u=' + encodedUrl + '" class="article-share-facebook" target="_blank" title="Facebook"></a>',
            '<a href="http://pinterest.com/pin/create/button/?url=' + encodedUrl + '" class="article-share-pinterest" target="_blank" title="Pinterest"></a>',
            '<a href="https://plus.google.com/share?url=' + encodedUrl + '" class="article-share-google" target="_blank" title="Google+"></a>',
          '</div>',
        '</div>'
      ].join('');

      var box = $(html);

      $('body').append(box);
    }

    $('.article-share-box.on').hide();

    box.css({
      top: offset.top + 25,
      left: offset.left
    }).addClass('on');
  }).on('click', '.article-share-box', function(e){
    e.stopPropagation();
  }).on('click', '.article-share-box-input', function(){
    $(this).select();
  }).on('click', '.article-share-box-link', function(e){
    e.preventDefault();
    e.stopPropagation();

    window.open(this.href, 'article-share-box-window-' + Date.now(), 'width=500,height=450');
  });

  // Caption
  $('.article-entry').each(function(i){
    $(this).find('img').each(function(){
      if ($(this).parent().hasClass('fancybox')) return;

      var alt = this.alt;

      if (alt) $(this).after('<span class="caption">' + alt + '</span>');

      $(this).wrap('<a href="' + this.src + '" title="' + alt + '" class="fancybox"></a>');
    });

    $(this).find('.fancybox').each(function(){
      $(this).attr('rel', 'article' + i);
    });
  });

  if ($.fancybox){
    $('.fancybox').fancybox();
  }

  // Mobile nav
  var $container = $('#container'),
    isMobileNavAnim = false,
    mobileNavAnimDuration = 200;

  var startMobileNavAnim = function(){
    isMobileNavAnim = true;
  };

  var stopMobileNavAnim = function(){
    setTimeout(function(){
      isMobileNavAnim = false;
    }, mobileNavAnimDuration);
  }

  $('#main-nav-toggle').on('click', function(){
    if (isMobileNavAnim) return;

    startMobileNavAnim();
    $container.toggleClass('mobile-nav-on');
    stopMobileNavAnim();
  });

  $('#wrap').on('click', function(){
    if (isMobileNavAnim || !$container.hasClass('mobile-nav-on')) return;

    $container.removeClass('mobile-nav-on');
  });
})(jQuery);