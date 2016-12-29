import loading from "./canvas/loading-svg.js"
import reqwest from 'reqwest'
import laytpl from './laytpl/laytpl.js'
import './fullpage/fullpage.js'

var Index = {
	app: document.getElementById('app'),
	cache: {},
	init () {
		var search = renderControl.search()
		if (search && search.app && search.name) this.get()
		else { location.href = 'http://video.statics.jituancaiyun.com/error/404.html' }
	},
	get () {
		reqwest({
			url: '/hta/template/get.do'
			, method: 'get'
			, data: {name: decodeURIComponent(renderControl.search().name)}
			, success: (resp) => {
				if (resp.success) {
					if (resp.code == 601) {
						alert('未登录！')
						location.href = resp.data;
					}
					else this.render(resp.data)
				}
				else {
					alert(resp.msg)
					location.href = 'http://video.statics.jituancaiyun.com/error/404.html'
				}
			}
			, error: () => {
				location.href = 'http://video.statics.jituancaiyun.com/error/500.html'
			}
		})
	},
	/**
	 * 事件的绑定与移除，dom与方法fn的缓存
	 * @param page
	 * @param obj
	 * @param type
	 */
	bindEvent: function (page, obj, type) {
		var tmp, dom, fn,
		text = obj.children.text,
		btn = obj.children.btn,
		picture = obj.children.picture,
		bind = function (obj2) {
			for (let i=0; i< obj2.length; i++) {
				tmp = obj2[i]
				// 存在事件的情况下
				if (tmp.eventLink) {
					if (Index.cache[tmp.id]) {
						dom = Index.cache[tmp.id].dom
						fn = Index.cache[tmp.id].fn
					} else {
						dom = document.getElementById(tmp.id)
						fn = function () {
							// 块级作用域
							tmp = obj2[i]
							if (tmp.eventName && tmp.eventContent) {
								window[tmp.eventName[0]](tmp.eventContent)
							}
							if (/^\d+$/.test(tmp.eventLink)) {
								// 本页面跳转
								var s = renderControl.changeSearch('page', tmp.eventLink);
								s && (location.search = s)
							} else {
								location.href = tmp.eventLink
							}
						}
						Index.cache[tmp.id] = { dom: dom, fn: fn }
					}
					if (type) renderControl.addEvents(dom, 'touchstart', fn)
					else renderControl.removeEvents(dom, 'touchstart', fn)
				}
			}
		};
		if (text.length > 0) bind(text);
		if (btn.length > 0) bind(btn);
		if (picture.length > 0) bind(picture);
	},
	render (data) {
		var meta = document.head.getElementsByTagName('meta')
			meta.share_title.content = data.name
			meta.share_content.content = data.description
			data.logo && (meta.share_image.content = data.logo)
		
		// console.log('标题', data.name)
		document.title = data.name
		
		let isLongPage = false, content = JSON.parse(data.content)
		content.map(item => {
			if (item.longPage) isLongPage = true
		})
		if (isLongPage) {
			this.renderLongPage(content)
		} else {
			this.renderSpa(content)
		}
	},
	renderLongPage (data) {
		// console.log(data)
		var search = renderControl.search()
		if (!search.page) {
			var s = renderControl.changeSearch('page', 1);
			s && (location.search = s)
		}
		
		var me = this;
		laytpl(document.getElementById('lp').innerHTML).render(data, function(html){
			me.app.innerHTML = html;
			
			var page = document.getElementsByClassName('page')
			for (var i=0; i< page.length; i++) {
				me.bindEvent(page[i], data[i], true)
			}
			
			// hide loading
			loading.hide()
		});
	},
	renderSpa (data) {
		var me = this;
		
		laytpl(document.getElementById('spa').innerHTML).render(data, function(html){
			me.app.innerHTML = html;
			var spaContainer = document.getElementsByClassName('spa-container')
			for (var i = 0; i< spaContainer.length; i++) {
				spaContainer[i].style.marginTop = (renderControl.h - 480) / 2 + 'px';
			}
				
			var pageContainer = document.getElementsByClassName('wp-inner')[0]
			var page = pageContainer.getElementsByClassName('page')
			// 进度条
			var progress = document.getElementById('progress')
			var tip = document.getElementsByClassName('page-tip')[0]
			
			// fullpage init
			pageContainer.fullpage({
				loop: true,
				duration: 300,
				afterChange: function (pageData) {
					// animate name add
					var items = page[pageData.cur].getElementsByClassName('item')
					for (var i=0; i< items.length; i++) {
						renderControl.attr(items[i], 'class', items[i].getAttribute('class') + ' ' + items[i].getAttribute('data-animate'))
					}
					// add event
					// 版权尾页 是没有data的
					if (data[pageData.cur]) {
						me.bindEvent(page[pageData.cur], data[pageData.cur], true)
					}
					// 当前页面的进度条
					console.log(pageData.cur)
					progress.style.width = (pageData.cur+1)/(data.length+1)*100 + '%'
					tip.innerText = (pageData.cur+1) + '/' + (data.length+1)
				},
				beforeChange: function (pageData) {
					if (pageData.cur > -1) {
						// animate name remove
						var items = page[pageData.cur].getElementsByClassName('item'), cl
						for (var i=0; i< items.length; i++) {
							cl = items[i].getAttribute('class')
							cl = cl.substr(0, cl.indexOf(items[i].getAttribute('data-animate')) - 1)
							renderControl.attr(items[i], 'class', cl)
						}
						// remove event
						// 版权尾页 是没有data的
						if (data[pageData.cur]) {
							me.bindEvent(page[pageData.cur], data[pageData.cur], false)
						}
					}
				}
			})
			// hide loading
			loading.hide()
		});
	}
}
Index.init()



