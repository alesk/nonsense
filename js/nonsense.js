var DEFAULTS = {
  cookie_name: 'nonsense',
  cookie_duration: 356*30,
  annoyer_enabled: "yes",
  annoyer_area: 30,
  annoyer_period: 50, //ms
  annoyer_delay: 15000,

  on_previous_agree: null
};

var JUMPER = {
  yscale: 10,
  yg: 0, // y position of ground
  g: 9.8, // grav. acc.
  dt: 0.05, // period of recalc in seconds
  ro: 0.85, // energy preservance
  v: 30, // velocity
  y: 0, // y position of element
  stillness: 0,
  interval_id: null
};

var settings_ = {},
    state_ = {
      root_style: {display: 'block', bottom: 0},
      annoyer_on: false,
      annoyer_interval_id: null
    }

/**
 * Get elements attribute with default value.
 * @param Element el
 * @param String attr_name
 * @param Number|String|Boolean opt_default
 */

var getAttr = function(el, attr_name, opt_default) {
  var val = el.getAttribute(attr_name);
  return val != null && val || opt_default;
}

/**
 * Get settings from element.
 * @param Element el
 */
var getSettings = function(el) {
  var key, settings = {};
  for (key in DEFAULTS) {
    if (DEFAULTS.hasOwnProperty(key)) {
      settings[key] = getAttr(el, 'data-'+key.replace(/_/g, '-'), DEFAULTS[key]);
    }
  }
  return settings;
}

/**
 * Makes element jumping.
 * @param Element el
 * @param Object state
 */
var jumper = function(el, s) {

  clearInterval(s.interval_id);
  function recalc(s) {


    // touching the ground
    if (s.y < 0) {
      s.y = 0;
      s.v = -s.v * s.ro;
    } else {
      s.v = s.v - s.g * s.dt;
      s.y = s.y + s.v * s.dt;
    }

    ypos = (s.yg - s.y) * s.yscale;
    if (Math.abs(ypos) < 0.1) s.stillness ++;
    el.style.top = ((ypos < 0) && ypos || 0) + "px";
    if (s.stillness > 100) {clearInterval(s.interval_id) }
  }

  s.interval_id = setInterval(function() {recalc(s)}, s.dt);
  return s.interval_id;
}


/**
 * @param Element el
 */
var launchJumper = function(el) {
  el.style.top = 0;
  var k,s = {};
  for(k in JUMPER) {s[k] = JUMPER[k]};
  s.yscale = window.innerHeight / 70;
  jumper(el, s);
}


/**
 * Sets Element's style attribute
 * @param Element el
 * @param Object styles
 */

var setStyle = function(el, styles) {
  var style = [];
  for (var key in styles) {
    style.push(key+":"+styles[key]);
  }
  el.setAttribute('style', style.join(";"))
}

/**
 * Asks user for permition to set cookies.
 * @param Element el
 */
var askForPermission = function(el) {
  setStyle(el, state_.root_style);
  el.onclick = onClick;

  if (settings_.annoyer_enabled == 'yes') {
  setInterval(function(){
    launchJumper(el.children[0])}, settings_.annoyer_delay)
  }
}

/**
 * Randomly moves element up and down to distract user.
 * @param Element el
 */
var annoyer = function(el) {
  if (state_.annoyer_on) {
    var bottom = Math.round(Math.random()*settings_.annoyer_area, 0);
    state_.root_style['bottom'] = bottom+"px";
    setStyle(el, state_.root_style);
  }
}

/**
 * Click handler
 * @param Event event
 */
var onClick = function(event) {
  var target = event.target,
      action = target.getAttribute('data-action');

  if (action == 'agree') {
    setCookie(settings_.cookie_name, 'agreed', settings_.cookie_duration);
    switchOff();
    onPreviousAgree();
  } else if (action == 'disagree') {
    setCookie(settings_.cookie_name, 'disagreed', settings_.cookie_duration);
    switchOff();
  } else if (action == 'show-more-info' && state_.more_info_el) {
    state_.more_info_el.setAttribute('style', 'display:block');
  }

}

var switchOff = function() {
    setStyle(state_.root_el, 'none');
    state_.annyoer_interval_id && clearInterval(state_.annyoer_interval_id);
}

/**
 * Retrieves cookie value.
 * @param String c_name
 */
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

/**
 * Sets browser cookie
 * @param String c_name
 * @param String value
 * @param Number opt_exdays
 */
var setCookie = function(c_name, value, opt_exdays) {
  var exdate=new Date(), c_value;
  exdate.setDate(exdate.getDate() + opt_exdays);
  c_value=escape(value) + ((opt_exdays==null) ? "" : "; expires="+exdate.toUTCString());
  document.cookie=c_name + "=" + c_value;
}

var main = function() {
  state_.root_el = document.getElementById('nonsense_root');
  state_.more_info_el = document.getElementById('nonsense_more_info');
  settings_ = getSettings(state_.root_el);
  state_.cookie = getCookie(settings_.cookie_name);

  if (state_.cookie == null) {
    askForPermission(state_.root_el);
  } else if (state_.cookie == 'agreed' && settings_.on_previous_agree in window) {
    window[settings_.on_previous_agree]();
  }

}

main();
