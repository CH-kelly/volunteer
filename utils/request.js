
const host = "https://changguan.shengbokj.com/api/";
const service = {
  get (url,data) {
  const http = host + url;
    return new Promise((resolve,reject) => {
      wx.request({
        method: 'get',
        url: http,
        data: data,
        header: {"content-type": "application/json"},
        success: (res) =>{
          // 调用接口成功
          resolve(res.data)
        },
        fail: (err) => {
          // 调用接口失败
          reject(err)
        }
      })
    })
  },
  post (url,data) {
    const http = host + url;
    return new Promise((resolve,reject) => {
      wx.request({
        method: 'post',
        url: http,
        data: data,
        header: {"content-type": "application/x-www-form-urlencoded"},
        success: (res) =>{
          // 调用接口成功
          resolve(res.data)
        },
        fail: (err) => {
          // 调用接口失败
          reject(err)
        }
      })
    })
  },
  // 上传图片
  uploadPhoto:(data) => {
    const tempFilePaths = data.tempFilePaths;
    const token = data.token;
    console.log('tempFilePaths',tempFilePaths);
    const http = service.host + '/user/upload';

    return new Promise((resolve,reject)=> {
      wx.uploadFile({
        url: http, //仅为示例，非真实的接口地址
        filePath: tempFilePaths[0],
        name: 'file',
        formData: {
          token:token
        },
        success (res){
          resolve(res.data)
        },fail: (err) => {
          // 调用接口失败
          reject(err)
        }
      })
    })
  },

  host
}

module.exports = service;