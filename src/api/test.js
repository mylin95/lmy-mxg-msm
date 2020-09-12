// 在脚手架中，自动封装了 @ 代表 src目录
import request from "@/utils/request";

// 调用方式一
// request.get('/db.json').then(response => {
// 	const data = response.data
// 	console.log('test axios', data)
// })

// 调用方式二：以对象配置的方式，指定请求方式
// request({
// 	method: 'get',
// 	url: '/db.json'
// }).then(response => {
// 	console.log('get', response.data)
// })

export default {
	getList() {
		const req = request({
			method: 'get',
			url: '/db.json'
		})
		return req
	}
}