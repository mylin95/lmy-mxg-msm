module.exports = {
	devServer: {
		port: 8888, // 端口号，如果被占用，自动+1
		host: "127.0.0.1", // 主机名, 127.0.0.1, 真机 0.0.0.0
		https: false, // 协议
		open: true, // 启动服务是，是否自动打开浏览器访问
		proxy: { // 开发环境代理配置
			// '/dev-api': {
			[process.env.VUE_APP_BASE_API]: {
				// 目标服务器地址，代理访问 http://127.0.0.1:8001
				target: process.env.VUE_APP_SERVICE_URL,
				changeOrigin: true, // 开启代理服务器
				pathRewrite: {
					// /dev-api/db.json 最终会发送 http://127.0.0.1:8001/db.json
					// 将 请求地址前缀 /dev-api 替换为空
					// '^/dev-api': '',
					['^' + process.env.VUE_APP_BASE_API ]: '',
				}
			}
		}
	},
	
	lintOnSave: false, // 关闭格式校验
	productionSourceMap: false, // 打包时不会生产 .map文件 加快打包速度
}