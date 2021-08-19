#### mongodb

-   mongodb 路径: /usr/local/mongodb
-   启动命令: mongod
-   mongod 是用来连接到 mongodb 数据库服务器的，即服务器端。
-   mongo 是用来启动 MongoDB shell 的，是 mongodb 的命令行客户端, 可以在终端查询数据库相关信息，详见 https://www.cnblogs.com/TankMa/archive/2011/06/08/2074947.html

指定数据库目录启动：`js mongod --dbpath ~/mongodb/db`

使用配置文件启动：`mongod --config /etc/mongod.conf`

远程连接 mongodb 需要指定 bind_ip, 如下面命令运行可以不限 ip：
`mongod --bind_ip 0.0.0.0`

-   创建用户

```js
> use testDb

> db.createUser(
     {
       user:"huangchufeng",
       pwd:"235021qy",
       roles:[{role:"readWrite",db:"testDb"}]
     }
  )
```

-   删除用户
    `db.dropUser('testUser')`
    详见：https://www.yiibai.com/mongodb/create-users.html
    我的 mongodb 用户密码：huangchufeng/235021qy

-   更改数据库名

```js
db.copyDatabase('old_name', 'new_name');
use old_name
db.dropDatabase();
```
