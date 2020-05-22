// pages/home/pages/editInfo/index.js

const app = getApp();
const apiServer = require("../../../../utils/request")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar:'',
    nickname:'',
    mobile:0,
    userInfo:[],
    token:'',
    region:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let token = wx.getStorageSync('token');
    this.setData({
      token:token
    })
    this.get_user_info(token);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  get_user_info(token){  //获取用户信息
    var that = this;
    apiServer.post("/user/getuserinfo",{token}).then(res=>{
      console.log(res);
      if(res.code == 1){
        let region = [
          res.data.province,res.data.city,''
        ]
        that.setData({
          userInfo:res.data,
          region:region,
          avatar:res.data.avatar,
          nickname:res.data.nickname,
          mobile:res.data.mobile,
        })
      }
    })
  },
  inputName(e){
    this.setData({
      nickname:e.detail.value 
    })
  },
  inputPhone(e){
    this.setData({
      mobile:e.detail.value 
    })
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  submit(){ //提交
    let avatar = this.data.avatar;
    if(!avatar){
      app.showmessage('请上传头像');
      return 
    }
    let nickname = this.data.nickname;
    if(!nickname){
      app.showmessage('请输入昵称');
      return 
    }
    let province = this.data.region[0];
    if(!province){
      app.showmessage('请选择省份');
      return 
    }
    let city = this.data.region[1];
    if(!city){
      app.showmessage('请选择城市');
      return 
    }
    let mobile = this.data.mobile;
    if(mobile){
      if(app.checkPhone(mobile) == false){
        app.showmessage('请填写正确的手机号');
        return 
      }
    }else{
      app.showmessage('请输入手机号');
      return 
    }
    let data = {
      uid:this.data.userInfo.id,
      nickname,
      province,
      city,
      mobile,
      avatar,
      token:this.data.token,
    };
    var that = this;
    console.log(data);
    apiServer.post("/user/profile",data).then(res=>{
      if(res.code == 1){
        app.showmessage('修改成功','success');
        this.get_user_info(that.data.token);
      }else{
          app.showmessage(res.msg);
      }
    })

  },
  changeAvatar(){
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths);
        apiServer.uploadPhoto({
          token:that.data.token,
          tempFilePaths: res.tempFilePaths
        }).then(res=>{
          console.log(res);
          let result = JSON.parse(res);
          app.showmessage(result.msg);
          if(result.code == 1){
            that.setData({
              avatar:result.data.url,
              [`userInfo.avatar`]:result.data.url,
            })
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})