#### Express 和 Koa 中间件区别
中间件：处在 HTTP Request 和 HTTP Response 中间，用来实现某种中间功能。app.use()用来加载中间件

在 Koa 和 Express 中，所有关于 HTTP 请求的事情都是在中间件内部完成的，一旦中间件完成了它的事情，它可以选择调用链中的下一个中间件

多个中间件会形成一个栈结构（middlestack），以"先进后出"的顺序执行。

1. 最外层的中间件首先执行
2. 调用next函数，把执行权交给下一个中间件
3. ...
4. 最内层的中间件最后执行
5. 执行结束后，把执行权交回上一层的中间件
6. ...
7. 最外层的中间件收回执行权之后，执行next函数后面的代码
```
const one = (ctx, next) => {
  console.log('>> one');
  next();
  console.log('<< one');
}

const two = (ctx, next) => {
  console.log('>> two');
  next(); 
  console.log('<< two');
}

const three = (ctx, next) => {
  console.log('>> three');
  next();
  console.log('<< three');
}

app.use(one);
app.use(two);
app.use(three);
```
```
>> one
>> two
>> three
<< three
<< two
<< one
```
如果中间件内部没有调用next函数，那么执行权就不会传递下去

**Express**
```
const express = require('express')
const app = express()
// Middleware 1
app.use((req, res, next) => {
  res.status(200)
  console.log('Setting status')
  // Call the next middleware
  next()
})
// Middleware 2
app.use((req, res) => {
  console.log('Setting body')
  res.send(`Hello from Express`)
})
app.listen(3001, () => console.log('Express app listening on 3001'))
```
**Koa**
```
const Koa = require('koa')
const app = new Koa()
// Middleware 1
app.use(async (ctx, next) => {
  ctx.status = 200
  console.log('Setting status')
  // Call the next middleware, wait for it to complete
  await next()
})
// Middleware 2
app.use((ctx) => {
  console.log('Setting body')
  ctx.body = 'Hello from Koa'
})
app.listen(3002, () => console.log('Koa app listening on 3002'))
```
客户端:
```
$ curl http://localhost:3001
Hello from Express
$ curl http://localhost:3002
Hello from Koa
```
终端：
```
Setting status
Setting body
```
Express 中间件链是基于==回调==的，而 Koa 是基于 ==Promise== 的


#### Koa 常见中间件
- koa-compress
- koa-respond
- kcors
- koa-convert
- koa-bodyparser
- koa-compose（合成中间件）
```
const compose = require('koa-compose');

const logger = (ctx, next) => {
  console.log(`${Date.now()} ${ctx.request.method} ${ctx.request.url}`);
  next();
}

const main = ctx => {
  ctx.response.body = 'Hello World';
};

const middlewares = compose([logger, main]);
app.use(middlewares);
```
- koa-router


refer to:
https://hijiangtao.github.io/2017/11/10/Mastering-Koa-Middleware/

http://www.ruanyifeng.com/blog/2017/08/koa.html