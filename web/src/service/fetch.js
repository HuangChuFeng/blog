import { get, post, formPost } from "../util/post";
/*
    处理所有网络请求_目前没有和action集成异步数据流，
    使用同步数据流达成类似效果的后遗症应该就是组件耦合性巨高。。
 */

/*
    请求所有的照片
    /api/imgs
 */
export const fetchImgs = id => {
  return get(`http://localhost:3000/api/imgs`);
};

export const login = (user) => {
  return post(`http://localhost:3000/api/login`, {
    name: user.name,
    password: user.password
  });
};

// 获取文章列表
export const fetchArticles = id => {
  return get(`http://localhost:3000/api/articles`);
};

// 创建文章
export const createArticle = article => {
  return post(`http://localhost:3000/api/articles/create`, {
    article: article
  });
};

// 删除文章
export const deleteArticleById = params => {
  return get(`http://localhost:3000/api/articles/${params.articleId}/remove`);
};

// 获取当前城市
export const getLocation = params => {
  return get(`http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js`);
};