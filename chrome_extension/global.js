var global_authurl = "http://simplicitii.net/includes/auth.php";
var global_authurl = "http://webdever.net/simplii/simplicitii/includes/auth.php";

function param_caller(param) {
    return function(o) {
        return o[param](); }; }

function returner(x) {
    return x; }

function remove_element(element) {
    if (element && element.parentNode)
        return element.parentNode.removeChild(element); }

function words(string) {
    return string.split(/\s+/)
        .filter(returner); }

function get_option(key) {
    if (key == 'authurl')
        return global_authurl;

    return get_options()[key]; }

function set_option(key, value) {
    var options = get_options();
    options[key] = value;
    set_options(options);
    return value; }

function get_options() {        
    if (!localStorage['settings'])
        return {authurl: global_authurl,
                username: '',
                password: ''};

    return JSON.parse(localStorage['settings']); }

function set_options(options) {
    return localStorage['settings'] = JSON.stringify(options); }

function delay(that) {
    var args = to_array(arguments).slice(1);

    return function() {
	var oldargs = args.slice(0);
	var newargs = to_array(arguments);
	var j = 0;
	for (var i in oldargs)
	    if (oldargs[i] == undefined) {
		oldargs[i] = newargs[j];
		j += 1; }

	var as = oldargs.concat(newargs.slice(j));

	return that.apply(that, as); };}
var curry = delay;

function to_array(what) {
    var i; 
    var ar = [];
 
    for (i = 0; i < what.length; i++) {
        ar.push(what[i]); }

    return ar; }

function send_message_to_tabs(message, query) {
    run_on_tabs(function(tab) {
        chrome.tabs.sendMessage(tab.id, message); },
               query); }

function send_message_to_active_tab(message) {
    send_message_to_tabs(message, {active: true});

    var msg = clone(message);
    msg.enqueue = true;
    send_message_to_tabs(msg, {active: false}); }

function run_on_tabs(fn, query) {
    chrome.tabs.query(
        (query || {}), 
        function(tabs) {
            console.log(['run_on_tabs_result', query, tabs]);
            tabs.map(fn); }); }

function param_tester(key, value) {
    return function(obj) {
        return obj[key] == value; }; }


function clone(i) {
    if (i instanceof Array)
        return i.slice(o);

    if (typeof i != "object")
        return i;
    
    var o = {};
    for (var j in i) 
        o[j] = clone(i[j]); 
    return o; }
        
function http(method, url, data, success, fail) {
    var xmlhttp = new XMLHttpRequest;
    xmlhttp.open((method || 'get'), url, true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.onreadystatechange = function() {
        if(xmlhttp.readyState == 4 ){
            if(xmlhttp.status == 200){
                success(xmlhttp.responseText); }
            else
                fail(xmlhttp.responseText); }};
        
    if (typeof data == "object")
        data = obj_to_urlstring(data); 

    xmlhttp.send(data ? data : null); }

function do_nothing() {}


function sel(sel, el) {
    return (el || document).querySelector(sel); }

function sel_all(sel, el) {
    return to_array((el || document).querySelectorAll(sel)); }

function o(fna, fnb) {
    return function(arg) {
        fna(fnb(arg)); }; }

function member(ar, value) {
    return ar.indexOf(value) >= 0; }

function object_matches(obj, pattern) {
    for (var i in pattern)
        if (obj[i] != pattern[i])
            return false;
    return true; }

function set_styles(el, styles) {
    for (var i in styles) 
        el.style[i] = styles[i];
    return el; }


function add_style(css) {
  var head = document.getElementsByTagName('head')[0];
  if (!head) 
      head = document.body;

  var style = document.createElement('style'); 
  style.type = 'text/css';
  if (style.styleSheet) 
    style.styleSheet.cssText = css;
  else
    style.appendChild(document.createTextNode(css)); 

  head.appendChild(style); }

function get_offset(el, addto) {
    var offset = {top: el.offsetTop,
                  left: el.offsetLeft};

    if (addto) {
        offset.top += addto.top;
        offset.left += addto.left; }

    if (!el.offsetParent)
        return offset;

    return get_offset(el.offsetParent, offset); }

function get_bounds(el) {
    var offset = get_offset(el);
    var bounds = el.getBoundingClientRect();
    
    offset.width = bounds.width;
    offset.height = bounds.height; 

    return offset; }
    
function last(a) {
    return a[a.length - 1]; }

function hash(obj) {
    if (typeof obj != "string")
        obj = JSON.stringify(obj); 

    var hash = 0, i, chr, len;
    if (obj.length == 0) return hash;

    for (i = 0, len = obj.length; i < len; i++) {
        chr   = obj.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; } // Convert to 32bit integer 

  return hash; }


