// console.log('okok')
// 导入wepy
import wepy from 'wepy';
const baseUrl= 'https://www.zhengzhicheng.cn/api/public/v1'
// 封装错误提示消息
wepy.baseToast = function (str = '获取数据失败') {
    wepy.showToast({
        title: str,
        icon: 'none',
        duration: 2000
      })
}

// 定义一个get的封装函数
wepy.get = function (url,data = {}) {
  return wepy.request({
    url: baseUrl+url,
    method: 'GET',
    data
  })
}

// 定义一个封装post请求的封装函数
wepy.post = function(url,data = {}){
  return wepy.request({
    url: baseUrl+url,
    method: 'POST',
    data
  })
}