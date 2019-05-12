const DEV_URL = 'http://localhost:3001'; // process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'http://www.huangchufeng.site:3001';
module.exports = {
	port: 3000,
	secretKey: "qy",
	session: {
		secret: 'myblog',
		key: 'myblog',
		maxAge: '2592000000'
	},
	mongodb: 'mongodb://localhost:27017/myblog',
	cors: DEV_URL,
}