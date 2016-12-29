/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _loadingSvg = __webpack_require__(1);
	
	var _loadingSvg2 = _interopRequireDefault(_loadingSvg);
	
	var _reqwest = __webpack_require__(2);
	
	var _reqwest2 = _interopRequireDefault(_reqwest);
	
	var _laytpl = __webpack_require__(4);
	
	var _laytpl2 = _interopRequireDefault(_laytpl);
	
	__webpack_require__(5);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Index = {
		app: document.getElementById('app'),
		cache: {},
		init: function init() {
			var search = renderControl.search();
			if (search && search.app && search.name) this.get();else {
				location.href = 'http://video.statics.jituancaiyun.com/error/404.html';
			}
		},
		get: function get() {
			var _this = this;
	
			(0, _reqwest2.default)({
				url: '/hta/template/get.do',
				method: 'get',
				data: { name: decodeURIComponent(renderControl.search().name) },
				success: function success(resp) {
					if (resp.success) {
						if (resp.code == 601) {
							alert('未登录！');
							location.href = resp.data;
						} else _this.render(resp.data);
					} else {
						alert(resp.msg);
						location.href = 'http://video.statics.jituancaiyun.com/error/404.html';
					}
				},
				error: function error() {
					location.href = 'http://video.statics.jituancaiyun.com/error/500.html';
				}
			});
		},
	
		/**
	  * 事件的绑定与移除，dom与方法fn的缓存
	  * @param page
	  * @param obj
	  * @param type
	  */
		bindEvent: function bindEvent(page, obj, type) {
			var tmp,
			    dom,
			    fn,
			    text = obj.children.text,
			    btn = obj.children.btn,
			    picture = obj.children.picture,
			    bind = function bind(obj2) {
				var _loop = function _loop(i) {
					tmp = obj2[i];
					// 存在事件的情况下
					if (tmp.eventLink) {
						if (Index.cache[tmp.id]) {
							dom = Index.cache[tmp.id].dom;
							fn = Index.cache[tmp.id].fn;
						} else {
							dom = document.getElementById(tmp.id);
							fn = function fn() {
								// 块级作用域
								tmp = obj2[i];
								if (tmp.eventName && tmp.eventContent) {
									window[tmp.eventName[0]](tmp.eventContent);
								}
								if (/^\d+$/.test(tmp.eventLink)) {
									// 本页面跳转
									var s = renderControl.changeSearch('page', tmp.eventLink);
									s && (location.search = s);
								} else {
									location.href = tmp.eventLink;
								}
							};
							Index.cache[tmp.id] = { dom: dom, fn: fn };
						}
						if (type) renderControl.addEvents(dom, 'touchstart', fn);else renderControl.removeEvents(dom, 'touchstart', fn);
					}
				};
	
				for (var i = 0; i < obj2.length; i++) {
					_loop(i);
				}
			};
			if (text.length > 0) bind(text);
			if (btn.length > 0) bind(btn);
			if (picture.length > 0) bind(picture);
		},
		render: function render(data) {
			var meta = document.head.getElementsByTagName('meta');
			meta.share_title.content = data.name;
			meta.share_content.content = data.description;
			data.logo && (meta.share_image.content = data.logo);
	
			// console.log('标题', data.name)
			document.title = data.name;
	
			var isLongPage = false,
			    content = JSON.parse(data.content);
			content.map(function (item) {
				if (item.longPage) isLongPage = true;
			});
			if (isLongPage) {
				this.renderLongPage(content);
			} else {
				this.renderSpa(content);
			}
		},
		renderLongPage: function renderLongPage(data) {
			// console.log(data)
			var search = renderControl.search();
			if (!search.page) {
				var s = renderControl.changeSearch('page', 1);
				s && (location.search = s);
			}
	
			var me = this;
			(0, _laytpl2.default)(document.getElementById('lp').innerHTML).render(data, function (html) {
				me.app.innerHTML = html;
	
				var page = document.getElementsByClassName('page');
				for (var i = 0; i < page.length; i++) {
					me.bindEvent(page[i], data[i], true);
				}
	
				// hide loading
				_loadingSvg2.default.hide();
			});
		},
		renderSpa: function renderSpa(data) {
			var me = this;
	
			(0, _laytpl2.default)(document.getElementById('spa').innerHTML).render(data, function (html) {
				me.app.innerHTML = html;
				var spaContainer = document.getElementsByClassName('spa-container');
				for (var i = 0; i < spaContainer.length; i++) {
					spaContainer[i].style.marginTop = (renderControl.h - 480) / 2 + 'px';
				}
	
				var pageContainer = document.getElementsByClassName('wp-inner')[0];
				var page = pageContainer.getElementsByClassName('page');
				// 进度条
				var progress = document.getElementById('progress');
				var tip = document.getElementsByClassName('page-tip')[0];
	
				// fullpage init
				pageContainer.fullpage({
					loop: true,
					duration: 300,
					afterChange: function afterChange(pageData) {
						// animate name add
						var items = page[pageData.cur].getElementsByClassName('item');
						for (var i = 0; i < items.length; i++) {
							renderControl.attr(items[i], 'class', items[i].getAttribute('class') + ' ' + items[i].getAttribute('data-animate'));
						}
						// add event
						// 版权尾页 是没有data的
						if (data[pageData.cur]) {
							me.bindEvent(page[pageData.cur], data[pageData.cur], true);
						}
						// 当前页面的进度条
						console.log(pageData.cur);
						progress.style.width = (pageData.cur + 1) / (data.length + 1) * 100 + '%';
						tip.innerText = pageData.cur + 1 + '/' + (data.length + 1);
					},
					beforeChange: function beforeChange(pageData) {
						if (pageData.cur > -1) {
							// animate name remove
							var items = page[pageData.cur].getElementsByClassName('item'),
							    cl;
							for (var i = 0; i < items.length; i++) {
								cl = items[i].getAttribute('class');
								cl = cl.substr(0, cl.indexOf(items[i].getAttribute('data-animate')) - 1);
								renderControl.attr(items[i], 'class', cl);
							}
							// remove event
							// 版权尾页 是没有data的
							if (data[pageData.cur]) {
								me.bindEvent(page[pageData.cur], data[pageData.cur], false);
							}
						}
					}
				});
				// hide loading
				_loadingSvg2.default.hide();
			});
		}
	};
	Index.init();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	(function (window) {
		var Loading = {
			init: function init() {
				this.img = null;
				Element.prototype.addStyle = function (styles) {
					for (var property in styles) {
						this.style[property] = styles[property];
					}
				};
				this.createImg();
			},
			createImg: function createImg() {
				this.img = document.createElement('img');
				this.img.src = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHdpZHRoPSc1MHB4JyBoZWlnaHQ9JzUwcHgnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIiBjbGFzcz0idWlsLWhvdXJnbGFzcyI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9Im5vbmUiIGNsYXNzPSJiayI+PC9yZWN0PjxnPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZhNTY1YSIgc3Ryb2tlLXdpZHRoPSI1IiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIGQ9Ik01OC40LDUxLjdjLTAuOS0wLjktMS40LTItMS40LTIuM3MwLjUtMC40LDEuNC0xLjQgQzcwLjgsNDMuOCw3OS44LDMwLjUsODAsMTUuNUg3MEgzMEgyMGMwLjIsMTUsOS4yLDI4LjEsMjEuNiwzMi4zYzAuOSwwLjksMS40LDEuMiwxLjQsMS41cy0wLjUsMS42LTEuNCwyLjUgQzI5LjIsNTYuMSwyMC4yLDY5LjUsMjAsODUuNWgxMGg0MGgxMEM3OS44LDY5LjUsNzAuOCw1NS45LDU4LjQsNTEuN3oiIGNsYXNzPSJnbGFzcyI+PC9wYXRoPjxjbGlwUGF0aCBpZD0idWlsLWhvdXJnbGFzcy1jbGlwMSI+PHJlY3QgeD0iMTUiIHk9IjIwIiB3aWR0aD0iNzAiIGhlaWdodD0iMjUiIGNsYXNzPSJjbGlwIj48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJoZWlnaHQiIGZyb209IjI1IiB0bz0iMCIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIHZsYXVlcz0iMjU7MDswIiBrZXlUaW1lcz0iMDswLjU7MSI+PC9hbmltYXRlPjxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InkiIGZyb209IjIwIiB0bz0iNDUiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiB2bGF1ZXM9IjIwOzQ1OzQ1IiBrZXlUaW1lcz0iMDswLjU7MSI+PC9hbmltYXRlPjwvcmVjdD48L2NsaXBQYXRoPjxjbGlwUGF0aCBpZD0idWlsLWhvdXJnbGFzcy1jbGlwMiI+PHJlY3QgeD0iMTUiIHk9IjU1IiB3aWR0aD0iNzAiIGhlaWdodD0iMjUiIGNsYXNzPSJjbGlwIj48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJoZWlnaHQiIGZyb209IjAiIHRvPSIyNSIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIHZsYXVlcz0iMDsyNTsyNSIga2V5VGltZXM9IjA7MC41OzEiPjwvYW5pbWF0ZT48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJ5IiBmcm9tPSI4MCIgdG89IjU1IiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgdmxhdWVzPSI4MDs1NTs1NSIga2V5VGltZXM9IjA7MC41OzEiPjwvYW5pbWF0ZT48L3JlY3Q+PC9jbGlwUGF0aD48cGF0aCBkPSJNMjksMjNjMy4xLDExLjQsMTEuMywxOS41LDIxLDE5LjVTNjcuOSwzNC40LDcxLDIzSDI5eiIgY2xpcC1wYXRoPSJ1cmwoI3VpbC1ob3VyZ2xhc3MtY2xpcDEpIiBmaWxsPSIjZmE1NjVhIiBjbGFzcz0ic2FuZCI+PC9wYXRoPjxwYXRoIGQ9Ik03MS42LDc4Yy0zLTExLjYtMTEuNS0yMC0yMS41LTIwcy0xOC41LDguNC0yMS41LDIwSDcxLjZ6IiBjbGlwLXBhdGg9InVybCgjdWlsLWhvdXJnbGFzcy1jbGlwMikiIGZpbGw9IiNmYTU2NWEiIGNsYXNzPSJzYW5kIj48L3BhdGg+PGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJyb3RhdGUiIGZyb209IjAgNTAgNTAiIHRvPSIxODAgNTAgNTAiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBkdXI9IjFzIiB2YWx1ZXM9IjAgNTAgNTA7MCA1MCA1MDsxODAgNTAgNTAiIGtleVRpbWVzPSIwOzAuNzsxIj48L2FuaW1hdGVUcmFuc2Zvcm0+PC9nPjwvc3ZnPg==';
	
				var width = 34;
				this.img.addStyle({
					'position': 'fixed', 'top': '50%', 'left': '50%',
					'margin-left': width / -2 + 'px',
					'margin-top': width / -2 + 'px',
					'width': width + 'px',
					'height': width + 'px'
				});
				document.body.appendChild(this.img);
			},
			show: function show() {
				this.img.style.display = 'block';
			},
			hide: function hide() {
				this.img.style.display = 'none';
			}
		};
		Loading.init();
	
		if (( false ? 'undefined' : _typeof(exports)) === 'object') {
			module.exports = Loading;
		} else {
			window.Loading = Loading;
		}
	})(window);

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	  * Reqwest! A general purpose XHR connection manager
	  * license MIT (c) Dustin Diaz 2015
	  * https://github.com/ded/reqwest
	  */
	
	!function (name, context, definition) {
	  if (typeof module != 'undefined' && module.exports) module.exports = definition()
	  else if (true) !(__WEBPACK_AMD_DEFINE_FACTORY__ = (definition), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
	  else context[name] = definition()
	}('reqwest', this, function () {
	
	  var context = this
	
	  if ('window' in context) {
	    var doc = document
	      , byTag = 'getElementsByTagName'
	      , head = doc[byTag]('head')[0]
	  } else {
	    var XHR2
	    try {
	      XHR2 = __webpack_require__(3)
	    } catch (ex) {
	      throw new Error('Peer dependency `xhr2` required! Please npm install xhr2')
	    }
	  }
	
	
	  var httpsRe = /^http/
	    , protocolRe = /(^\w+):\/\//
	    , twoHundo = /^(20\d|1223)$/ //http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
	    , readyState = 'readyState'
	    , contentType = 'Content-Type'
	    , requestedWith = 'X-Requested-With'
	    , uniqid = 0
	    , callbackPrefix = 'reqwest_' + (+new Date())
	    , lastValue // data stored by the most recent JSONP callback
	    , xmlHttpRequest = 'XMLHttpRequest'
	    , xDomainRequest = 'XDomainRequest'
	    , noop = function () {}
	
	    , isArray = typeof Array.isArray == 'function'
	        ? Array.isArray
	        : function (a) {
	            return a instanceof Array
	          }
	
	    , defaultHeaders = {
	          'contentType': 'application/x-www-form-urlencoded'
	        , 'requestedWith': xmlHttpRequest
	        , 'accept': {
	              '*':  'text/javascript, text/html, application/xml, text/xml, */*'
	            , 'xml':  'application/xml, text/xml'
	            , 'html': 'text/html'
	            , 'text': 'text/plain'
	            , 'json': 'application/json, text/javascript'
	            , 'js':   'application/javascript, text/javascript'
	          }
	      }
	
	    , xhr = function(o) {
	        // is it x-domain
	        if (o['crossOrigin'] === true) {
	          var xhr = context[xmlHttpRequest] ? new XMLHttpRequest() : null
	          if (xhr && 'withCredentials' in xhr) {
	            return xhr
	          } else if (context[xDomainRequest]) {
	            return new XDomainRequest()
	          } else {
	            throw new Error('Browser does not support cross-origin requests')
	          }
	        } else if (context[xmlHttpRequest]) {
	          return new XMLHttpRequest()
	        } else if (XHR2) {
	          return new XHR2()
	        } else {
	          return new ActiveXObject('Microsoft.XMLHTTP')
	        }
	      }
	    , globalSetupOptions = {
	        dataFilter: function (data) {
	          return data
	        }
	      }
	
	  function succeed(r) {
	    var protocol = protocolRe.exec(r.url)
	    protocol = (protocol && protocol[1]) || context.location.protocol
	    return httpsRe.test(protocol) ? twoHundo.test(r.request.status) : !!r.request.response
	  }
	
	  function handleReadyState(r, success, error) {
	    return function () {
	      // use _aborted to mitigate against IE err c00c023f
	      // (can't read props on aborted request objects)
	      if (r._aborted) return error(r.request)
	      if (r._timedOut) return error(r.request, 'Request is aborted: timeout')
	      if (r.request && r.request[readyState] == 4) {
	        r.request.onreadystatechange = noop
	        if (succeed(r)) success(r.request)
	        else
	          error(r.request)
	      }
	    }
	  }
	
	  function setHeaders(http, o) {
	    var headers = o['headers'] || {}
	      , h
	
	    headers['Accept'] = headers['Accept']
	      || defaultHeaders['accept'][o['type']]
	      || defaultHeaders['accept']['*']
	
	    var isAFormData = typeof FormData !== 'undefined' && (o['data'] instanceof FormData);
	    // breaks cross-origin requests with legacy browsers
	    if (!o['crossOrigin'] && !headers[requestedWith]) headers[requestedWith] = defaultHeaders['requestedWith']
	    if (!headers[contentType] && !isAFormData) headers[contentType] = o['contentType'] || defaultHeaders['contentType']
	    for (h in headers)
	      headers.hasOwnProperty(h) && 'setRequestHeader' in http && http.setRequestHeader(h, headers[h])
	  }
	
	  function setCredentials(http, o) {
	    if (typeof o['withCredentials'] !== 'undefined' && typeof http.withCredentials !== 'undefined') {
	      http.withCredentials = !!o['withCredentials']
	    }
	  }
	
	  function generalCallback(data) {
	    lastValue = data
	  }
	
	  function urlappend (url, s) {
	    return url + (/\?/.test(url) ? '&' : '?') + s
	  }
	
	  function handleJsonp(o, fn, err, url) {
	    var reqId = uniqid++
	      , cbkey = o['jsonpCallback'] || 'callback' // the 'callback' key
	      , cbval = o['jsonpCallbackName'] || reqwest.getcallbackPrefix(reqId)
	      , cbreg = new RegExp('((^|\\?|&)' + cbkey + ')=([^&]+)')
	      , match = url.match(cbreg)
	      , script = doc.createElement('script')
	      , loaded = 0
	      , isIE10 = navigator.userAgent.indexOf('MSIE 10.0') !== -1
	
	    if (match) {
	      if (match[3] === '?') {
	        url = url.replace(cbreg, '$1=' + cbval) // wildcard callback func name
	      } else {
	        cbval = match[3] // provided callback func name
	      }
	    } else {
	      url = urlappend(url, cbkey + '=' + cbval) // no callback details, add 'em
	    }
	
	    context[cbval] = generalCallback
	
	    script.type = 'text/javascript'
	    script.src = url
	    script.async = true
	    if (typeof script.onreadystatechange !== 'undefined' && !isIE10) {
	      // need this for IE due to out-of-order onreadystatechange(), binding script
	      // execution to an event listener gives us control over when the script
	      // is executed. See http://jaubourg.net/2010/07/loading-script-as-onclick-handler-of.html
	      script.htmlFor = script.id = '_reqwest_' + reqId
	    }
	
	    script.onload = script.onreadystatechange = function () {
	      if ((script[readyState] && script[readyState] !== 'complete' && script[readyState] !== 'loaded') || loaded) {
	        return false
	      }
	      script.onload = script.onreadystatechange = null
	      script.onclick && script.onclick()
	      // Call the user callback with the last value stored and clean up values and scripts.
	      fn(lastValue)
	      lastValue = undefined
	      head.removeChild(script)
	      loaded = 1
	    }
	
	    // Add the script to the DOM head
	    head.appendChild(script)
	
	    // Enable JSONP timeout
	    return {
	      abort: function () {
	        script.onload = script.onreadystatechange = null
	        err({}, 'Request is aborted: timeout', {})
	        lastValue = undefined
	        head.removeChild(script)
	        loaded = 1
	      }
	    }
	  }
	
	  function getRequest(fn, err) {
	    var o = this.o
	      , method = (o['method'] || 'GET').toUpperCase()
	      , url = typeof o === 'string' ? o : o['url']
	      // convert non-string objects to query-string form unless o['processData'] is false
	      , data = (o['processData'] !== false && o['data'] && typeof o['data'] !== 'string')
	        ? reqwest.toQueryString(o['data'])
	        : (o['data'] || null)
	      , http
	      , sendWait = false
	
	    // if we're working on a GET request and we have data then we should append
	    // query string to end of URL and not post data
	    if ((o['type'] == 'jsonp' || method == 'GET') && data) {
	      url = urlappend(url, data)
	      data = null
	    }
	
	    if (o['type'] == 'jsonp') return handleJsonp(o, fn, err, url)
	
	    // get the xhr from the factory if passed
	    // if the factory returns null, fall-back to ours
	    http = (o.xhr && o.xhr(o)) || xhr(o)
	
	    http.open(method, url, o['async'] === false ? false : true)
	    setHeaders(http, o)
	    setCredentials(http, o)
	    if (context[xDomainRequest] && http instanceof context[xDomainRequest]) {
	        http.onload = fn
	        http.onerror = err
	        // NOTE: see
	        // http://social.msdn.microsoft.com/Forums/en-US/iewebdevelopment/thread/30ef3add-767c-4436-b8a9-f1ca19b4812e
	        http.onprogress = function() {}
	        sendWait = true
	    } else {
	      http.onreadystatechange = handleReadyState(this, fn, err)
	    }
	    o['before'] && o['before'](http)
	    if (sendWait) {
	      setTimeout(function () {
	        http.send(data)
	      }, 200)
	    } else {
	      http.send(data)
	    }
	    return http
	  }
	
	  function Reqwest(o, fn) {
	    this.o = o
	    this.fn = fn
	
	    init.apply(this, arguments)
	  }
	
	  function setType(header) {
	    // json, javascript, text/plain, text/html, xml
	    if (header === null) return undefined; //In case of no content-type.
	    if (header.match('json')) return 'json'
	    if (header.match('javascript')) return 'js'
	    if (header.match('text')) return 'html'
	    if (header.match('xml')) return 'xml'
	  }
	
	  function init(o, fn) {
	
	    this.url = typeof o == 'string' ? o : o['url']
	    this.timeout = null
	
	    // whether request has been fulfilled for purpose
	    // of tracking the Promises
	    this._fulfilled = false
	    // success handlers
	    this._successHandler = function(){}
	    this._fulfillmentHandlers = []
	    // error handlers
	    this._errorHandlers = []
	    // complete (both success and fail) handlers
	    this._completeHandlers = []
	    this._erred = false
	    this._responseArgs = {}
	
	    var self = this
	
	    fn = fn || function () {}
	
	    if (o['timeout']) {
	      this.timeout = setTimeout(function () {
	        timedOut()
	      }, o['timeout'])
	    }
	
	    if (o['success']) {
	      this._successHandler = function () {
	        o['success'].apply(o, arguments)
	      }
	    }
	
	    if (o['error']) {
	      this._errorHandlers.push(function () {
	        o['error'].apply(o, arguments)
	      })
	    }
	
	    if (o['complete']) {
	      this._completeHandlers.push(function () {
	        o['complete'].apply(o, arguments)
	      })
	    }
	
	    function complete (resp) {
	      o['timeout'] && clearTimeout(self.timeout)
	      self.timeout = null
	      while (self._completeHandlers.length > 0) {
	        self._completeHandlers.shift()(resp)
	      }
	    }
	
	    function success (resp) {
	      var type = o['type'] || resp && setType(resp.getResponseHeader('Content-Type')) // resp can be undefined in IE
	      resp = (type !== 'jsonp') ? self.request : resp
	      // use global data filter on response text
	      var filteredResponse = globalSetupOptions.dataFilter(resp.responseText, type)
	        , r = filteredResponse
	      try {
	        resp.responseText = r
	      } catch (e) {
	        // can't assign this in IE<=8, just ignore
	      }
	      if (r) {
	        switch (type) {
	        case 'json':
	          try {
	            resp = context.JSON ? context.JSON.parse(r) : eval('(' + r + ')')
	          } catch (err) {
	            return error(resp, 'Could not parse JSON in response', err)
	          }
	          break
	        case 'js':
	          resp = eval(r)
	          break
	        case 'html':
	          resp = r
	          break
	        case 'xml':
	          resp = resp.responseXML
	              && resp.responseXML.parseError // IE trololo
	              && resp.responseXML.parseError.errorCode
	              && resp.responseXML.parseError.reason
	            ? null
	            : resp.responseXML
	          break
	        }
	      }
	
	      self._responseArgs.resp = resp
	      self._fulfilled = true
	      fn(resp)
	      self._successHandler(resp)
	      while (self._fulfillmentHandlers.length > 0) {
	        resp = self._fulfillmentHandlers.shift()(resp)
	      }
	
	      complete(resp)
	    }
	
	    function timedOut() {
	      self._timedOut = true
	      self.request.abort()
	    }
	
	    function error(resp, msg, t) {
	      resp = self.request
	      self._responseArgs.resp = resp
	      self._responseArgs.msg = msg
	      self._responseArgs.t = t
	      self._erred = true
	      while (self._errorHandlers.length > 0) {
	        self._errorHandlers.shift()(resp, msg, t)
	      }
	      complete(resp)
	    }
	
	    this.request = getRequest.call(this, success, error)
	  }
	
	  Reqwest.prototype = {
	    abort: function () {
	      this._aborted = true
	      this.request.abort()
	    }
	
	  , retry: function () {
	      init.call(this, this.o, this.fn)
	    }
	
	    /**
	     * Small deviation from the Promises A CommonJs specification
	     * http://wiki.commonjs.org/wiki/Promises/A
	     */
	
	    /**
	     * `then` will execute upon successful requests
	     */
	  , then: function (success, fail) {
	      success = success || function () {}
	      fail = fail || function () {}
	      if (this._fulfilled) {
	        this._responseArgs.resp = success(this._responseArgs.resp)
	      } else if (this._erred) {
	        fail(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t)
	      } else {
	        this._fulfillmentHandlers.push(success)
	        this._errorHandlers.push(fail)
	      }
	      return this
	    }
	
	    /**
	     * `always` will execute whether the request succeeds or fails
	     */
	  , always: function (fn) {
	      if (this._fulfilled || this._erred) {
	        fn(this._responseArgs.resp)
	      } else {
	        this._completeHandlers.push(fn)
	      }
	      return this
	    }
	
	    /**
	     * `fail` will execute when the request fails
	     */
	  , fail: function (fn) {
	      if (this._erred) {
	        fn(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t)
	      } else {
	        this._errorHandlers.push(fn)
	      }
	      return this
	    }
	  , 'catch': function (fn) {
	      return this.fail(fn)
	    }
	  }
	
	  function reqwest(o, fn) {
	    return new Reqwest(o, fn)
	  }
	
	  // normalize newline variants according to spec -> CRLF
	  function normalize(s) {
	    return s ? s.replace(/\r?\n/g, '\r\n') : ''
	  }
	
	  function serial(el, cb) {
	    var n = el.name
	      , t = el.tagName.toLowerCase()
	      , optCb = function (o) {
	          // IE gives value="" even where there is no value attribute
	          // 'specified' ref: http://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-862529273
	          if (o && !o['disabled'])
	            cb(n, normalize(o['attributes']['value'] && o['attributes']['value']['specified'] ? o['value'] : o['text']))
	        }
	      , ch, ra, val, i
	
	    // don't serialize elements that are disabled or without a name
	    if (el.disabled || !n) return
	
	    switch (t) {
	    case 'input':
	      if (!/reset|button|image|file/i.test(el.type)) {
	        ch = /checkbox/i.test(el.type)
	        ra = /radio/i.test(el.type)
	        val = el.value
	        // WebKit gives us "" instead of "on" if a checkbox has no value, so correct it here
	        ;(!(ch || ra) || el.checked) && cb(n, normalize(ch && val === '' ? 'on' : val))
	      }
	      break
	    case 'textarea':
	      cb(n, normalize(el.value))
	      break
	    case 'select':
	      if (el.type.toLowerCase() === 'select-one') {
	        optCb(el.selectedIndex >= 0 ? el.options[el.selectedIndex] : null)
	      } else {
	        for (i = 0; el.length && i < el.length; i++) {
	          el.options[i].selected && optCb(el.options[i])
	        }
	      }
	      break
	    }
	  }
	
	  // collect up all form elements found from the passed argument elements all
	  // the way down to child elements; pass a '<form>' or form fields.
	  // called with 'this'=callback to use for serial() on each element
	  function eachFormElement() {
	    var cb = this
	      , e, i
	      , serializeSubtags = function (e, tags) {
	          var i, j, fa
	          for (i = 0; i < tags.length; i++) {
	            fa = e[byTag](tags[i])
	            for (j = 0; j < fa.length; j++) serial(fa[j], cb)
	          }
	        }
	
	    for (i = 0; i < arguments.length; i++) {
	      e = arguments[i]
	      if (/input|select|textarea/i.test(e.tagName)) serial(e, cb)
	      serializeSubtags(e, [ 'input', 'select', 'textarea' ])
	    }
	  }
	
	  // standard query string style serialization
	  function serializeQueryString() {
	    return reqwest.toQueryString(reqwest.serializeArray.apply(null, arguments))
	  }
	
	  // { 'name': 'value', ... } style serialization
	  function serializeHash() {
	    var hash = {}
	    eachFormElement.apply(function (name, value) {
	      if (name in hash) {
	        hash[name] && !isArray(hash[name]) && (hash[name] = [hash[name]])
	        hash[name].push(value)
	      } else hash[name] = value
	    }, arguments)
	    return hash
	  }
	
	  // [ { name: 'name', value: 'value' }, ... ] style serialization
	  reqwest.serializeArray = function () {
	    var arr = []
	    eachFormElement.apply(function (name, value) {
	      arr.push({name: name, value: value})
	    }, arguments)
	    return arr
	  }
	
	  reqwest.serialize = function () {
	    if (arguments.length === 0) return ''
	    var opt, fn
	      , args = Array.prototype.slice.call(arguments, 0)
	
	    opt = args.pop()
	    opt && opt.nodeType && args.push(opt) && (opt = null)
	    opt && (opt = opt.type)
	
	    if (opt == 'map') fn = serializeHash
	    else if (opt == 'array') fn = reqwest.serializeArray
	    else fn = serializeQueryString
	
	    return fn.apply(null, args)
	  }
	
	  reqwest.toQueryString = function (o, trad) {
	    var prefix, i
	      , traditional = trad || false
	      , s = []
	      , enc = encodeURIComponent
	      , add = function (key, value) {
	          // If value is a function, invoke it and return its value
	          value = ('function' === typeof value) ? value() : (value == null ? '' : value)
	          s[s.length] = enc(key) + '=' + enc(value)
	        }
	    // If an array was passed in, assume that it is an array of form elements.
	    if (isArray(o)) {
	      for (i = 0; o && i < o.length; i++) add(o[i]['name'], o[i]['value'])
	    } else {
	      // If traditional, encode the "old" way (the way 1.3.2 or older
	      // did it), otherwise encode params recursively.
	      for (prefix in o) {
	        if (o.hasOwnProperty(prefix)) buildParams(prefix, o[prefix], traditional, add)
	      }
	    }
	
	    // spaces should be + according to spec
	    return s.join('&').replace(/%20/g, '+')
	  }
	
	  function buildParams(prefix, obj, traditional, add) {
	    var name, i, v
	      , rbracket = /\[\]$/
	
	    if (isArray(obj)) {
	      // Serialize array item.
	      for (i = 0; obj && i < obj.length; i++) {
	        v = obj[i]
	        if (traditional || rbracket.test(prefix)) {
	          // Treat each array item as a scalar.
	          add(prefix, v)
	        } else {
	          buildParams(prefix + '[' + (typeof v === 'object' ? i : '') + ']', v, traditional, add)
	        }
	      }
	    } else if (obj && obj.toString() === '[object Object]') {
	      // Serialize object item.
	      for (name in obj) {
	        buildParams(prefix + '[' + name + ']', obj[name], traditional, add)
	      }
	
	    } else {
	      // Serialize scalar item.
	      add(prefix, obj)
	    }
	  }
	
	  reqwest.getcallbackPrefix = function () {
	    return callbackPrefix
	  }
	
	  // jQuery and Zepto compatibility, differences can be remapped here so you can call
	  // .ajax.compat(options, callback)
	  reqwest.compat = function (o, fn) {
	    if (o) {
	      o['type'] && (o['method'] = o['type']) && delete o['type']
	      o['dataType'] && (o['type'] = o['dataType'])
	      o['jsonpCallback'] && (o['jsonpCallbackName'] = o['jsonpCallback']) && delete o['jsonpCallback']
	      o['jsonp'] && (o['jsonpCallback'] = o['jsonp'])
	    }
	    return new Reqwest(o, fn)
	  }
	
	  reqwest.ajaxSetup = function (options) {
	    options = options || {}
	    for (var k in options) {
	      globalSetupOptions[k] = options[k]
	    }
	  }
	
	  return reqwest
	});


/***/ },
/* 3 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;"use strict";
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	/** 
	 
	 @Name：laytpl-v1.1 精妙的js模板引擎 
	 @Author：贤心 - 2014-08-16
	 @Site：http://sentsin.com/layui/laytpl 
	 @License：MIT license
	 */
	
	;!function () {
	  "use strict";
	  var f,
	      b = { open: "{{", close: "}}" },
	      c = { exp: function exp(a) {
	      return new RegExp(a, "g");
	    }, query: function query(a, c, e) {
	      var f = ["#([\\s\\S])+?", "([^{#}])*?"][a || 0];return d((c || "") + b.open + f + b.close + (e || ""));
	    }, escape: function escape(a) {
	      return String(a || "").replace(/&(?!#?[a-zA-Z0-9]+;)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#39;").replace(/"/g, "&quot;");
	    }, error: function error(a, b) {
	      var c = "Laytpl Error：";return "object" == (typeof console === "undefined" ? "undefined" : _typeof(console)) && console.error(c + a + "\n" + (b || "")), c + a;
	    } },
	      d = c.exp,
	      e = function e(a) {
	    this.tpl = a;
	  };e.pt = e.prototype, e.pt.parse = function (a, e) {
	    var f = this,
	        g = a,
	        h = d("^" + b.open + "#", ""),
	        i = d(b.close + "$", "");a = a.replace(/[\r\t\n]/g, " ").replace(d(b.open + "#"), b.open + "# ").replace(d(b.close + "}"), "} " + b.close).replace(/\\/g, "\\\\").replace(/(?="|')/g, "\\").replace(c.query(), function (a) {
	      return a = a.replace(h, "").replace(i, ""), '";' + a.replace(/\\/g, "") + '; view+="';
	    }).replace(c.query(1), function (a) {
	      var c = '"+(';return a.replace(/\s/g, "") === b.open + b.close ? "" : (a = a.replace(d(b.open + "|" + b.close), ""), /^=/.test(a) && (a = a.replace(/^=/, ""), c = '"+_escape_('), c + a.replace(/\\/g, "") + ')+"');
	    }), a = '"use strict";var view = "' + a + '";return view;';try {
	      return f.cache = a = new Function("d, _escape_", a), a(e, c.escape);
	    } catch (j) {
	      return delete f.cache, c.error(j, g);
	    }
	  }, e.pt.render = function (a, b) {
	    var e,
	        d = this;return a ? (e = d.cache ? d.cache(a, c.escape) : d.parse(d.tpl, a), b ? (b(e), void 0) : e) : c.error("no data");
	  }, f = function f(a) {
	    return "string" != typeof a ? c.error("Template not found") : new e(a);
	  }, f.config = function (a) {
	    a = a || {};for (var c in a) {
	      b[c] = a[c];
	    }
	  }, f.v = "1.1",  true ? !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	    return f;
	  }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : "undefined" != typeof exports ? module.exports = f : window.laytpl = f;
	}();

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
	/*!
	 * zepto.fullpage.js v0.3.1 (https://github.com/yanhaijing/zepto.fullpage)
	 * API https://github.com/yanhaijing/zepto.fullpage/blob/master/doc/api.md
	 * Copyright 2014 yanhaijing. All Rights Reserved
	 * Licensed under MIT (https://github.com/yanhaijing/zepto.fullpage/blob/master/LICENSE)
	 */
	(function (window) {
		document.addEventListener('touchmove', function (e) {
			e.preventDefault();
		});
		var d = {
			page: '.page',
			start: 0,
			duration: 500,
			loop: false,
			drag: false,
			dir: 'v',
			der: 0.1,
			change: function change(data) {},
			beforeChange: function beforeChange(data) {},
			afterChange: function afterChange(data) {},
			orientationchange: function orientationchange(orientation) {}
		};
	
		function fix(cur, pagesLength, loop) {
			if (cur < 0) {
				return !!loop ? pagesLength - 1 : 0;
			}
	
			if (cur >= pagesLength) {
				return !!loop ? 0 : pagesLength - 1;
			}
	
			return cur;
		}
	
		function move(ele, dir, dist) {
			var xPx = "0px",
			    yPx = "0px";
			if (dir === 'v') yPx = dist + "px";else xPx = dist + "px";
			ele.style.cssText += ';-webkit-transform : translate3d(' + xPx + ', ' + yPx + ', 0px);' + 'transform : translate3d(' + xPx + ', ' + yPx + ', 0px);';
		}
	
		function init(option) {
			var o = option ? option : {};
			for (var key in d) {
				if (!o.hasOwnProperty(key)) {
					o[key] = d[key];
				}
			}
	
			var that = this;
			that.curIndex = -1;
			that.o = o;
	
			that.startY = 0;
			that.movingFlag = false;
	
			that.ele.classList.add('fullPage-wp');
			that.parentEle = that.ele.parentNode;
	
			var query = o.page;
			if (query.indexOf(".") == 0) {
				query = query.substring(1, query.length);
			}
			that.pageEles = that.ele.getElementsByClassName(query);
			for (var i = 0; i < that.pageEles.length; i++) {
				var pageEle = that.pageEles[i];
				pageEle.classList.add('fullPage-page');
				pageEle.classList.add('fullPage-dir-' + o.dir);
			}
	
			that.pagesLength = that.pageEles.length;
			that.update();
			that.initEvent();
			that.status = 1;
		}
	
		function Fullpage(ele, option) {
			this.ele = ele;
			init.call(this, option);
		}
		Fullpage.prototype.update = function () {
			if (this.o.dir === 'h') {
				this.width = this.parentEle.offsetWidth;
				for (var i = 0; i < this.pageEles.length; i++) {
					var pageEle = this.pageEles[i];
					pageEle.style.width = this.width + "px";
				}
				this.ele.style.width = this.width * this.pagesLength + "px";
			}
	
			this.height = this.parentEle.offsetHeight;
			for (var i = 0; i < this.pageEles.length; i++) {
				var pageEle = this.pageEles[i];
				pageEle.style.height = this.height + "px";
			}
	
			this.moveTo(this.curIndex < 0 ? this.o.start : this.curIndex);
		};
	
		Fullpage.prototype.initEvent = function () {
			var that = this;
			var ele = that.ele;
	
			ele.addEventListener('touchstart', function (e) {
				if (!that.status) {
					return 1;
				}
				e.preventDefault();
				if (that.movingFlag) {
					return 0;
				}
				// console.log(1)
				that.startX = e.targetTouches[0].pageX;
				that.startY = e.targetTouches[0].pageY;
			});
			ele.addEventListener('touchend', function (e) {
				if (!that.status) {
					return 1;
				}
				//e.preventDefault();
				if (that.movingFlag) {
					return 0;
				}
	
				var sub = that.o.dir === 'v' ? (e.changedTouches[0].pageY - that.startY) / that.height : (e.changedTouches[0].pageX - that.startX) / that.width;
				var der = sub > that.o.der || sub < -that.o.der ? sub > 0 ? -1 : 1 : 0;
				// console.log(der)
				that.moveTo(that.curIndex + der, true);
			});
			if (that.o.drag) {
				ele.addEventListener('touchmove', function (e) {
					if (!that.status) {
						return 1;
					}
					//e.preventDefault();
					if (that.movingFlag) {
						that.startX = e.targetTouches[0].pageX;
						that.startY = e.targetTouches[0].pageY;
						return 0;
					}
	
					var y = e.changedTouches[0].pageY - that.startY;
					if (that.curIndex == 0 && y > 0 || that.curIndex === that.pagesLength - 1 && y < 0) y /= 2;
					var x = e.changedTouches[0].pageX - that.startX;
					if (that.curIndex == 0 && x > 0 || that.curIndex === that.pagesLength - 1 && x < 0) x /= 2;
					var dist = that.o.dir === 'v' ? -that.curIndex * that.height + y : -that.curIndex * that.width + x;
					ele.classList.remove('anim');
					move(ele, that.o.dir, dist);
				});
			}
	
			// 翻转屏幕提示
			// ==============================
			window.addEventListener("orientationchange", function () {
				if (window.orientation === 180 || window.orientation === 0) {
					that.o.orientationchange('portrait');
				}
				if (window.orientation === 90 || window.orientation === -90) {
					that.o.orientationchange('landscape');
				}
			}, false);
	
			window.addEventListener("resize", function () {
				that.update();
			}, false);
		};
	
		Fullpage.prototype.start = function () {
			this.status = 1;
		};
		Fullpage.prototype.stop = function () {
			this.status = 0;
		};
		Fullpage.prototype.getCurIndex = function () {
			return this.curIndex;
		};
		Fullpage.prototype.moveTo = function (next, anim) {
			var that = this;
			var ele = that.ele;
			var cur = that.curIndex;
			next = fix(next, that.pagesLength, that.o.loop);
	
			if (anim) {
				ele.classList.add('anim');
			} else {
				ele.classList.remove('anim');
			}
	
			if (next !== cur) {
				var flag = that.o.beforeChange({
					next: next,
					cur: cur
				});
	
				// beforeChange 显示返回false 可阻止滚屏的发生
				if (flag === false) {
					return 1;
				}
			}
	
			that.movingFlag = true;
			that.curIndex = next;
			move(ele, that.o.dir, -next * (that.o.dir === 'v' ? that.height : that.width));
	
			if (next !== cur) {
				that.o.change({
					prev: cur,
					cur: next
				});
			}
	
			window.setTimeout(function () {
				that.movingFlag = false;
				if (next !== cur) {
					that.o.afterChange({
						prev: cur,
						cur: next
					});
					for (var i = 0; i < that.pageEles.length; i++) {
						var pageEle = that.pageEles[i];
						if (i === next) {
							pageEle.classList.add("cur");
						} else {
							pageEle.classList.remove("cur");
						}
					}
				}
			}, that.o.duration);
		};
		Fullpage.prototype.movePrev = function (anim) {
			this.moveTo(this.curIndex - 1, anim);
		};
		Fullpage.prototype.moveNext = function (anim) {
			this.moveTo(this.curIndex + 1, anim);
		};
	
		Element.prototype.fullpage = function (option) {
			return new Fullpage(this, option);
		};
	})(window);

/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map