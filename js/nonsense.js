(function() {
  var root_el, 
      more_info_el,
      cookie_name, 
      cookie_duration = 356*30, // 30 years
      cookie, 
      annoyer_enabled = true,
      annyoer_interval_id, 
      annoyer_area = 30,
      annoyer_period = 50,
      root_style = {display: "block", bottom: 0};

var main = function() {
  root_el = document.getElementById('nonsense_root');
  more_info_el = document.getElementById('nonsense_more_info');
  cookie_name = root_el.getAttribute('data-cookie') || 'nonsense';
  cookie = getCookie(cookie_name);

  if (cookie == null) {
    ask();
  } else if (cookie == 'agreed') {
    onPreviousAgree();
  }

}

var setStyle = function(el, styles) {
  var style = [];
  for (var key in styles) {
    style.push(key+":"+styles[key]);
  } 
  el.setAttribute('style', style.join(";"))
}

var ask = function() {
  setStyle(root_el, root_style);
  root_el.onclick = onClick;
  root_el.onmouseover = function() {
    annoyer_enabled = false;
  }
  root_el.onmouseout = function() {annoyer_enabled = true;}
  annyoer_interval_id = setTimeout(function() {
    setInterval(annoyer, annoyer_period);
  }, 5000);
}

var annoyer = function() {
  var bottom = Math.round(Math.random()*annoyer_area, 0);
  root_style['bottom'] = bottom+"px";
  annoyer_enabled && setStyle(root_el, root_style);
}

var onClick = function(event) {
  var target = event.target,
      action = target.getAttribute('data-action');

  if (action == 'agree') {
    setCookie(cookie_name, 'agreed', cookie_duration);
    switchOff();
    onPreviousAgree();
  } else if (action == 'disagree') {
    setCookie(cookie_name, 'disagreed', cookie_duration);
    switchOff();
  } else if (action == 'show-more-info' && more_info_el) {
    more_info_el.setAttribute('style', 'display:block');
  }

}

var switchOff = function() {
    root_style['display'] = 'none';
    setStyle(root_el, root_style);
    annyoer_interval_id && clearInterval(annyoer_interval_id);
}

var onPreviousAgree = function() {
  var onPreviousAgree = root_el.getAttribute('data-on-previous-agree');
  debugger;
  if (onPreviousAgree in window) {
    window[onPreviousAgree]();
  }
}

var getCookie = function(c_name) {
  var c_value = document.cookie;
  var c_start = c_value.indexOf(" " + c_name + "=");
  if (c_start == -1) {
    c_start = c_value.indexOf(c_name + "=");
  }
  if (c_start == -1) {
    c_value = null;
  }
  else {
    c_start = c_value.indexOf("=", c_start) + 1;
    var c_end = c_value.indexOf(";", c_start);
    if (c_end == -1) {
      c_end = c_value.length;
    }
    c_value = unescape(c_value.substring(c_start,c_end));
  }
  return c_value;
}

var setCookie = function(c_name,value,exdays) {
  var exdate=new Date();
  exdate.setDate(exdate.getDate() + exdays);
  var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
  document.cookie=c_name + "=" + c_value;
}
main();
})();
