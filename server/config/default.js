module.exports = {
	port: 3000,
	secretKey: "qy",
	session: {
		secret: 'myblog',
		key: 'myblog',
		maxAge: '2592000000'
	},
	mongodb: 'mongodb://localhost:27017/myblog',
	cors: "http://106.14.159.7:3001",
}