
// 上线时修改
// const DEV_URL = 'http://localhost';
const DEV_URL = 'http://www.huangchufeng.site';

module.exports = {
	port: 3000,
	secretKey: "qy",
	session: {
		secret: 'myblog',
		key: 'myblog',
		maxAge: '2592000000'
	},
	mongodb: 'mongodb://huangchufeng:235021qy@localhost:27017/my_blog', // 106.14.159.7
	cors: DEV_URL + ':3001/',
}