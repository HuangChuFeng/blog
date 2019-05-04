import { get, post } from "../util/post"; // , formPost 

const DEV_URL = 'http://localhost:3000';

/*
    处理所有网络请求_目前没有和action集成异步数据流，
    使用同步数据流达成类似效果的后遗症应该就是组件耦合性巨高。。
 */

// 获取上传图片token
export const getUploadToken = params => {
  return post(`${DEV_URL}/api/token`);
};

// 上传照片
export const uploadImgs = group => {
  return post(`${DEV_URL}/api/imgs/upload`, group);
};

/*
    请求所有的照片
    /api/imgs
 */
export const fetchImgs = (params) => {
  return get(`${DEV_URL}/api/imgs?pageNum=${params.pageNum}&category=${params.category}`);
};

// 获取照片详情
export const getImgDetail = (id, typeNum) => {
  return get(`${DEV_URL}/api/imgs/${id}?typeNum=${typeNum}`);
};

// 删除照片
export const deleteImgById = params => {
  return get(`${DEV_URL}/api/imgs/${params.imgId}/remove`);
};

// 更新文章浏览量
export const addImgPv = (id, num) => {
  return get(`${DEV_URL}/api/imgs/${id}/addImgPv`, {
    num: num,
  });
};

// 更新文章喜欢数量
export const addImgFavor = (id) => {
  return get(`${DEV_URL}/api/imgs/${id}/addImgFavor`);
};


export const login = (user) => {
  return post(`${DEV_URL}/api/user/login`, user);
};

export const register = (user) => {
  return post(`${DEV_URL}/api/user/register`, user);
};

// 退出
export const quit = () => {
  return get(`${DEV_URL}/api/user/quit`);
};

// 获取文章列表
export const fetchArticles = (params) => {
  return get(`${DEV_URL}/api/articles?pageNum=${params.pageNum}&type=${params.type}`);
};

// 获取文章详情
export const getArticleDetail = (id, typeNum) => {
  return get(`${DEV_URL}/api/articles/${id}?typeNum=${typeNum}`);
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

// 更新文章浏览量
export const addArticlePv = (id) => {
  return get(`${DEV_URL}/api/articles/${id}/addArticlePv`);
};

// 发表评论
export const comment = (id, comment) => {
  return post(`${DEV_URL}/api/${id}/comment`, comment);
};

// 增加新标签
export const createTag = (tag) => {
  return post(`${DEV_URL}/api/articleTags/create`, tag);
};

// 删除标签
export const removeTag = params => {
  return get(`${DEV_URL}/api/articleTags/${params.tagId}/remove`);
};

// 获取所有标签
export const getTags = params => {
  return get(`${DEV_URL}/api/articleTags`);
};

// 获取某篇文章的所有标签
export const getTagsByArticleId = params => {
  return get(`${DEV_URL}/api/articleTags/${params.articleId}`);
};

// 根据标签name获取对应文章
export const getArticlesByTagName = tag => {
  return get(`${DEV_URL}/api/tag/articles?tag=${tag}`);
};



// 获取当前城市
export const getLocation = params => {
  return get(`http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js`);
};