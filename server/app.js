const Koa = require("koa");

const fs = require('fs')
// const bodyParser = require("koa-bodyparser");                 // 主要用于获取post请求的参数
const controller = require("./middlewares/controller");
// const session = require("koa2-session-store");
const session = require('koa-session');
const MongoStore = require("koa2-session-mongolass");
const convert = require("koa-convert");
const path = require("path");
const os = require('os');
const koaBody = require('koa-body');
// EJS是一个JavaScript模板库，用来从JSON数据中生成HTML字符串, Koa2框架中ejs可以把数据库查询的数据渲染到模板上面，实现一个动态网站。
const render = require("koa-ejs");
const server = require("koa-static");  
const config = require("config-lite");                        // 读取配置文件的模块
const historyFallback = require("koa2-history-api-fallback");
const koaWinston = require("./middlewares/koa-winston");      // 基于winston的用于koa的日志中间件
const onerror = require("koa-onerror");

// koa2后台允许跨域的方法主要有两种：1.jsonp 2、koa2-cors让后台允许跨域直接就可以在客户端使用ajax请求数据。
const cors = require('koa2-cors');
const app = new Koa();
// error handler
onerror(app);

const isProduction = (process.env.NODE_ENV || "production") === "production";

const log = require("./logs/log");

const sessionConfig = {
  secret: 'myblog',
  key: 'myblog',
  maxAge: '2592000000'
}

app.use(historyFallback())
app.use(koaBody({ 
  multipart: true,
  formLimit: "50mb",
  jsonLimit: "50mb",
  textLimit: "50mb",
  enableTypes: ['json', 'form', 'text'],
  formidable: {
    uploadDir: path.join(__dirname, 'build/photograph/'), // 设置文件上传目录
    keepExtensions: true, // 保持文件的后缀
    maxFieldsSize: 20 * 1024 * 1024, // 文件上传大小，缺省2M
    onFileBegin: (name, file) => { // 文件上传前的设置
      const fp = path.join(__dirname, 'build/photograph/');
      if (!fs.existsSync(fp)) { // 检查是否有“public/upload/”文件夹
        fs.mkdirSync(fp); // 没有就创建
      }
    }
  }
}));
// app.use(bodyParser({
//   formLimit: "50mb",
//   jsonLimit: "50mb",
//   textLimit: "50mb",
//   enableTypes: ['json', 'form', 'text']
// }));

// app.keys = [config.session.secret];
app.keys = [sessionConfig.secret];
const CONFIG = {
  key: 'koa:sess',   //cookie key (default is koa:sess)
  maxAge: 86400000,  // cookie的过期时间 maxAge in ms (default is 1 days)
  overwrite: true,  //是否可以overwrite    (默认default true)
  httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
  signed: true,   //签名默认true
  rolling: false,  //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
  renew: false,  //(boolean) renew session when session is nearly expired,
};
app.use(session(CONFIG, app));
// app.use(
//   session({
//     name: sessionConfig.key,       // 设置 cookie 中保存 session id 的字段名称
//     secret: sessionConfig.secret,  // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
//     resave: true,                   // 强制更新 session
//     saveUninitialized: false,       // 设置为 false，强制创建一个 session，即使用户未登录
//     cookie: {
//       maxAge: sessionConfig.maxAge // 过期时间，过期后 cookie 中的 session id 自动删除
//     },
//     store: new MongoStore()
//   })
// );


// 具体参数我们在后面进行解释
app.use(cors({
  origin: "http://localhost:3001",
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  store: new MongoStore(),
}))


// 静态资源就可以被koa中间件解析了
app.use(convert(server(path.join(__dirname, "/build/"))));
app.use(convert(server(path.join(__dirname, "/upload/"))));


render(app, {
  root: path.join(__dirname, "/build/"),
  layout: false,
  viewExt: "html",
  cache: isProduction ? true : false,
  debug: isProduction ? false : true
});

// 正常请求的日志 加载中间件
app.use(koaWinston(log.logger));
// add controller:
app.use(controller());
// 错误请求的日志
app.use(koaWinston(log.errorloger));

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;