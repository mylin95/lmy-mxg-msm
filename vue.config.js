module.exports = {
	devServer: {
		port: 8001, // 端口号，如果被占用，自动+1
		host: "127.0.0.1", // 主机名, 127.0.0.1, 真机 0.0.0.0
		https: false, // 协议
		open: false, // 启动服务是，是否自动打开浏览器访问
		proxy: {
			['/']: {
				target: 'http://127.0.0.1:8888',
				changeOrigin: true, // 开启代理服务器
				pathRewrite: {
					["^/"]: "/"
				}
			}
		}
	},
	
	lintOnSave: false, // 关闭格式校验
	productionSourceMap: false, // 打包时不会生产 .map文件 加快打包速度
}