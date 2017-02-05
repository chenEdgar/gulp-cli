var PAGE = {// 默认分页参数
	defaultPage: 1,
	defaultPageSize: 10
}
var CONFIG = {
	page: {
		defaultPage: PAGE.defaultPage,
		defaultPageSize: PAGE.defaultPageSize
	},
	listPageObserve: { // 分页存放
	
	},
	api: { // 接口
	
	},
	tips: { // 弹窗提示等
	
	}
}

var MI= window.MI = { // 全局对象
	config: {

	},
	bridge: {
		isAjaxFinished: true
	},
	init: function () {
		MI.artTemplateDateFormatHelper()
		MI.artTemplateArrToString()
		MI.artTemplateTodayIs()
	},
	artTemplateDateFormatHelper: function () {
		template.helper('dateFormat', function(date, format) {
			date = new Date(date.replace(/-/g, '/'))
		    var map = {
		        "M": date.getMonth() + 1, //月份 
		        "d": date.getDate(), //日 
		        "h": date.getHours(), //小时 
		        "m": date.getMinutes(), //分 
		        "s": date.getSeconds(), //秒 
		        "q": Math.floor((date.getMonth() + 3) / 3), //季度 
		        "S": date.getMilliseconds() //毫秒 
		    }
		    format = format.replace(/([yMdhmsqS])+/g, function(all, t){
		        var v = map[t]
		        if(v !== undefined){
		            if(all.length > 1){
		                v = '0' + v
		                v = v.substr(v.length-2)
		            }
		            return v
		        }
		        else if(t === 'y'){
		            return (date.getFullYear() + '').substr(4 - all.length)
		        }
		        return all
		    })
		    return format
		})
	},
	artTemplateTodayIs: function () {
		template.helper('todayIs', function(date) {
			var curDate = new Date().getDate() // 号
			var curDay = new Date().getDay() // 周几
			date = new Date(date.replace(/-/g, '/'))
			var mapDay = {
				1: '周一',
				2: '周二',
				3: '周三',
				4: '周四',
				5: '周五',
				6: '周六',
				0: '周日'
			}
			if (date.getDate() == curDate) {
				return '今天'
			} else if (date.getDate() == curDate + 1) {
				return '明天'
			} else if (date.getDate() == curDate + 2) {
				return '后天'
			} else {
				return mapDay[date.getDay()]
			}		
		})
	},
	artTemplateArrToString: function () { // 模板中存储对象（数组）使用
		template.helper('arrToString', function (arr) {
			if (arr instanceof Array) {
				return JSON.stringify(arr)
			} else {
				throw new Error('artTemplateObjToString 方法传入的数据' + arr + '不是一个数组')
			}
		})
	},
	isLeapYear: function (year) {
		// （1）能被4整除，但不能被100整除（2）能被4整除，但又能被400整除
		return(0 == year%4 && (year%100 !=0 || year%400 == 0))
	},
	loading: function () {
		layer.open({
			type: 2,
			time: 10,
			className: 'layer-loading'
		})
	},
	close: function () {
		layer.closeAll()
	},
	alert: function (msg) {
		layer.open({
		  content: msg,
		  // style: 'background-color:#09C1FF; color:#fff; border:none;',
		  time: 3 // 3秒
		})
	},
	compile: function(source, data,hook) {
		// source 为字符串模板
		// template 方法第一个参数为id，自动查找
		// 返回一个渲染函数
		var render = template.compile(source) 
		var html = render(data)
		if (hook) {
			hook.append(html)
		} else {
			return html
		}
		
	},
	formatData: function (date, format) {
		    date = new Date(date.replace(/-/g, '/'))
		    var map = {
		        "M": date.getMonth() + 1, //月份 
		        "d": date.getDate(), //日 
		        "h": date.getHours(), //小时 
		        "m": date.getMinutes(), //分 
		        "s": date.getSeconds(), //秒 
		        "q": Math.floor((date.getMonth() + 3) / 3), //季度 
		        "S": date.getMilliseconds() //毫秒 
		    }
		    format = format.replace(/([yMdhmsqS])+/g, function(all, t){
		        var v = map[t]
		        if(v !== undefined){
		            if(all.length > 1){
		                v = '0' + v
		                v = v.substr(v.length-2)
		            }
		            return v
		        }
		        else if(t === 'y'){
		            return (date.getFullYear() + '').substr(4 - all.length)
		        }
		        return all
		    })
		    return format
	},
	ajax: {
		get: function(obj, cb, error) {
			var ajax
			var requestArr = []
			var options = {
				type: 'Get',
				url: obj.url,
				data: obj.data,
				dataType: 'json',
				beforeSend: function (xhr, seting){
					MI.bridge.isAjaxFinished = false
					MI.loading()
				},
				success: function (data, status, xhr) {
					MI.bridge.isAjaxFinished = true
					console.log('三姑舅');
					var json
					try {
						if (typeof data === 'object') {
							json = data
						} else if (typeof data === 'string') {
							json = JSON.parse(data)
						}
					} catch (err) {
						console.log('数据格式不能转为json')
						console.log(data)
					}

					if (json.code == 0) {
						console.log('success')
						cb && cb(json, xhr)
						// MI.close()
					} else if (json.code == 2007) {
						MI.close()
						MI.alert('登录超时,请重新登录')
					} else {
						console.log(JSON.stringify(json));
						console.log('异常接口' + obj.url);
						MI.close()
						MI.alert(json.msg && json.msg)
					}
					
				},
				error: function (data, errorType, err) {
					MI.bridge.isAjaxFinished = true
					// console.log('请求失败' + obj.url)
					error && error(data, errorType, err)
					// console.log('errorData' + data);
					// console.log('errorType' + errorType);
					// console.log('error' + err);
					MI.close()	
				},
				complete: function (xhr, status) {
					// MI.close()
				}
			}
			$.extend(true, options, obj)
			ajax = $.ajax(options)
			return ajax
		}
	},
	store: {
		isLocalStorageSurpport: function () {
			var testKey = 'test',
	           	storage = window.sessionStorage;
	       try {
	           storage.setItem(testKey, 'testValue')
	           storage.removeItem(testKey)
	           return true
	       } catch (error) {
	           return false
	       }
		},
		set: function(key, val) {
			if (this.isLocalStorageSurpport()) {
				if (val === undefined) {
					return this.remove(key)
				}
				localStorage.setItem(key, JSON.stringify(val))
				return val
			}
		},
		get: function (key) {
			var val
			if (this.isLocalStorageSurpport()) {
				val = localStorage.getItem(key)
				return JSON.parse(val)
			}
		},
		remove:  function(key) {
			if (this.isLocalStorageSurpport()) { 
				localStorage.removeItem(key)
			}
		}
	}
}

MI.init()
