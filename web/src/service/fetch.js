import { get, post, formPost } from "../util/post";

const DEV_URL = 'http://localhost:3000';

/*
    处理所有网络请求_目前没有和action集成异步数据流，
    使用同步数据流达成类似效果的后遗症应该就是组件耦合性巨高。。
 */

/*
    请求所有的照片
    /api/imgs
 */
export const fetchImgs = id => {
  return get(`${DEV_URL}/api/imgs`);
};

export const login = (user) => {
  return post(`${DEV_URL}/api/login`, {
    name: user.name,
    password: user.password
  });
};

// 获取上传图片token
export const getUploadToken = params => {
  return post(`${DEV_URL}/api/token`);
};

// 上传照片
export const uploadImgs = group => {
  return post(`${DEV_URL}/api/imgs/upload`, group);
};

// 获取文章列表
export const fetchArticles = id => {
  return get(`${DEV_URL}/api/articles`);
};

// 创建文章
export const createArticle = article => {
  return post(`${DEV_URL}/api/articles/create`, {
    article: article
  });
};

// 删除文章
export const deleteArticleById = params => {
  return get(`${DEV_URL}/api/articles/${params.articleId}/remove`);
};

// 更新文章
export const updateArticleById = (id, article) => {
  return post(`${DEV_URL}/api/articles/${id}/update`, {
    article: article,
  });
};

// 获取当前城市
export const getLocation = params => {
  return get(`http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js`);
};