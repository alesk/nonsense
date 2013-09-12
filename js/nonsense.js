var DEFAULTS = {
  cookie_name: 'nonsense',
  cookie_duration: 356*30,
  annoyer_enabled: "yes",
  annoyer_delay: 15000,
  z_index: 100,

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
      annoyer_on: false,
      annoyer_interval_id: null
    }

/************ helper functions ***************/
/**
 * Get elements attribute with default value.
 * @param {Element} el
 * @param {string} attr_name
 * @param {number|string|boolean} opt_default
 */

var getAttribute = function(el, attr_name, opt_default) {
  var val = el.getAttribute(attr_name);
  return val != null && val || opt_default;
}

/**
 * @param {string} id
 */
var getElementById = function(id) {return document.getElementById(id);}

/**
 * Get settings from element.
 * @param {Element} el
 */
var getSettings = function(el) {
  var key, settings = {};
  for (key in DEFAULTS) {
    if (DEFAULTS.hasOwnProperty(key)) {
      settings[key] = getAttribute(el, 'data-'+key.replace(/_/g, '-'), DEFAULTS[key]);
    }
  }
  return settings;
}

/**
 * Sets Element's style attribute
 * @param {Element} el
 * @param {Object} styles
 */

/**
 * Retrieves cookie value.
 * @param {string} c_name
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
 * @param {string} c_name
 * @param {string} value
 * @param {number} opt_exdays
 */
var setCookie = function(c_name, value, opt_exdays) {
  var exdate=new Date(), c_value;
  exdate.setDate(exdate.getDate() + opt_exdays);
  c_value=escape(value) + ((opt_exdays==null) ? "" : "; expires="+exdate.toUTCString());
  document.cookie=c_name + "=" + c_value;
}

/***************** jumper ******************/

/**
 * Makes element jumping.
 * @param {Element} el
 * @param {Object} state
 */
var jumper = function(el, state) {

  clearInterval(state.interval_id);
  function recalc(state) {


    // touching the ground
    if (state.y < 0) {
      state.y = 0;
      state.v = -state.v * state.ro;
    } else {
      state.v = state.v - state.g * state.dt;
      state.y = state.y + state.v * state.dt;
    }

    var ypos = (state.yg - state.y) * state.yscale;
    if (Math.abs(ypos) < 0.1) state.stillness ++;
    el.style.top = ((ypos < 0) && ypos || 0) + "px";
    if (state.stillness > 100) {clearInterval(state.interval_id) }
  }

  state.interval_id = setInterval(function() {recalc(state)}, state.dt);
  return state.interval_id;
}


/**
 * @param {Element} el
 */
var launchJumper = function(el) {
  el.style.top = 0;
  var k,s = {};
  for(k in JUMPER) {s[k] = JUMPER[k]};
  s.yscale = window.innerHeight / 70;
  jumper(el, s);
}



/**
 * Asks user for permition to set cookies.
 * @param {Element} el
 */
var askForPermission = function(el) {
  el.onclick = onClick;

  if (settings_.annoyer_enabled == 'yes') {
  setInterval(function(){
    launchJumper(el.children[0])}, settings_.annoyer_delay)
  }
}


/**
 * Click handler
 * @param {Event} event
 */
var onClick = function(event) {
  var action = getAttribute(event.target, 'data-action');

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
    state_.root_el.style.display = 'none';
    state_.annyoer_interval_id && clearInterval(state_.annyoer_interval_id);
}


var onPreviousAgree = function() {
  if (settings_.on_previous_agree in window) {
    window[settings_.on_previous_agree]();
  }
}


var main = function() {
  state_.root_el = getElementById('nonsense_root');
  state_.more_info_el = getElementById('nonsense_more_info');
  settings_ = getSettings(state_.root_el);
  state_.cookie = getCookie(settings_.cookie_name);


  if (state_.cookie == null) {
    state_.root_el.style.zIndex = settings_.z_index;
    state_.root_el.style.display = "block";
    state_.root_el.style.bottom = "0px";
    askForPermission(state_.root_el);
  } else {
    if (state_.cookie == 'agreed') {
    onPreviousAgree();
    }
    switchOff();
  }
}

main();
