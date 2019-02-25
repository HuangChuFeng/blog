const index = async(ctx) => {
	ctx.session.flag = "1";
	await ctx.render('build/index', {
    });
}

const testOnlineStatus = async(ctx)=>{
	ctx.response.body = {
      resCode: 500,
      message: 'hello world'
    };
}


// var user = {
// 	name: 'admin',
// 	password: '111111',
// 	avatar: 'www.baidu.com'
//   };
// UserModel.create(user)
//     .then(function (result) {
// 	  // 此 user 是插入 mongodb 后的值，包含 _id
// 	  user = result.ops[0];
// 	  console.log('========', user);
	  
//     })
//     .catch(function (e) {
//       console.log('捕获异常');
	  
//       next(e);
//     });

module.exports = {
	'GET /': index,
	'GET /api/test': testOnlineStatus,
	// "GET /api/login": async ctx => {
	// 	let resCode = 200,
	// 		message;
	// 	try {
	// 	  var user = await UserModel.getUserByName();
	// 	} catch (e) {
	// 	  resCode = 500;
	// 	  message = "服务器出错了";
	// 	}
	// 	console.log('-=====', user);
		
	// 	ctx.response.body = {
	// 	  resCode,
	// 	  message,
	// 	  user,
	// 	};
	// },
}