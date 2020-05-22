// pages/volunteer/detail/index.js

const app = getApp();
const apiServer = require("../../../utils/request")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    background:[
     "/static/images/appointment/background.png",
     "/static/images/appointment/background.png",
     "/static/images/appointment/background.png",
    ],
    detail:{},
    isSign:0,
    token:'',
    uid:0,
    startsignin:'',
    endsignin:'',
    expirydate:'',
    signIn:{},
    signOut:{},

    address:'',
    type:1,
    signid:0,
    isShowSingIn:1,
    isShowSingOut:1,
    signOutCountDown:-1,
    signInCountDown:-1,
    timer:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var token = wx.getStorageSync('token');
    var uid = wx.getStorageSync('uid');
    var isSign = options.isSign || 0
    //isSign=0表示查看详情   =1表示报名id   =2表示排班id
    this.setData({
      id:options.id || 0,
      isSign:options.isSign || 0,
      token:token,
      uid:uid
    })
    if(token && isSign!=0){  //获取签到接口
      this.get_activity_sign();
    }else{
      this.getDetail();
    }
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
  apply(e){  //我要报名
    let uid = app.globalData.uid || wx.getStorageSync('uid');
    let userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo');
    let id = e.currentTarget.dataset.id
    console.log(1,uid,userInfo);
    if(uid || userInfo.user_id){
      wx.navigateTo({
        url: '/pages/volunteer/apply/index?id='+id,
      })
    }else{
      wx.navigateTo({
        url: '/pages/auto/index',
      })
    }
    
    

   
  },
  getDetail(){
    apiServer.post("/Activity/getinfo",{id:this.data.id}).then(res=>{
      console.log(res);
      if(res.code === 1){
        this.setData({
          detail:res.data,
          background:res.data.banner_images,
        })
      }
    })
  },
  get_activity_sign(){
    var that = this;
    var token = this.data.token;
    var uid = this.data.uid;
    var isSign = this.data.isSign;  //isSign=0表示查看详情   =1表示报名id   =2表示排班id
    var paiban_id = isSign==1?0:this.data.id
    var sign_id = isSign==2?0:this.data.id
    apiServer.post("/activity/signinfo",{
      paiban_id:paiban_id,
      sign_id:sign_id,
      token:token,
      uid:uid
    }).then(res=>{
      if(res.code == 1){
        let signIn = res.data.sign[1]
        let signOut = res.data.sign[2]
        let isShowSingIn = 0;
        if(Object.keys(signIn).length === 0){
          isShowSingIn = 1;
        }
        let isShowSingOut = 0;
        if(Object.keys(signOut).length === 0){
          isShowSingOut = 1;
        }
        that.setData({
          detail:res.data.data,
          background:res.data.data.banner_images,
          signid:res.data.data.signid,
          startsignin:res.data.data.startsignin,
          endsignin:res.data.data.endsignin,
          expirydate:res.data.data.expirydate,
          signIn:signIn,
          signOut:signOut,
          isShowSingIn:isShowSingIn,
          isShowSingOut:isShowSingOut,
          signOutCountDown:res.data.data.endcountdown,
          signInCountDown:res.data.data.startcountdown
        })
        if(res.data.data.endcountdown>0){
          that.count_down(res.data.data.endcountdown)
        }
      }
    })
  },
  count_down(signOutCountDown){ //倒计时
    var timer =  this.data.timer;
    var that = this;
    clearInterval(timer)
    timer = setInterval(function () {
      signOutCountDown -- ;
      console.log(signOutCountDown)
      if(signOutCountDown <0){
        clearInterval(timer)
        that.setData({
          timer: timer,
          signOutCountDown:0
        })
      }
    },1000)
    
  },
  clickSignIn(){  //点击签到
    console.log('点击签到')
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        console.log(res)
        const latitude = res.latitude
        const longitude = res.longitude
        const url = "https://apis.map.qq.com/ws/geocoder/v1/?location="+latitude+","+longitude+"&key=O2GBZ-ELSKW-VOHRL-O3J4X-AKR6K-CZFBP&get_poi=1"
        wx.request({
          url: url,
          success(res){
            console.log(res);
            if(res.statusCode == 200){
              let address = res.data.result.address;
              that.setData({
                address:address,
              })
              that.sign_submit(address,1);    //1签到
            }
          }
        })
      }
     })
  },
  clickSignOut(){ //点击签退
    console.log('点击签退')
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        console.log(res)
        const latitude = res.latitude
        const longitude = res.longitude
        const url = "https://apis.map.qq.com/ws/geocoder/v1/?location="+latitude+","+longitude+"&key=O2GBZ-ELSKW-VOHRL-O3J4X-AKR6K-CZFBP&get_poi=1"
        wx.request({
          url: url,
          success(res){
            console.log(res);
            if(res.statusCode == 200){
              let address = res.data.result.address;
              that.setData({
                address:address,
              })
              that.sign_submit(address,2);  //2签退
            }
          }
        })
      }
     })
  },
  sign_submit(address,type){
    var that = this;
    apiServer.post("/activity/sign_submit",{
      uid:this.data.uid,
      sign_id:this.data.signid,
      type:type,
      address:address,
      token:this.data.token
    }).then(res=>{
      console.log(res);
      app.showmessage(res.msg);
      if(res.code == 1){
        if(type == 1){
          let signIn = {
            status:res.data[1].status,
            createtime:res.data[1].createtime
          }
          that.setData({
            isShowSingIn:2,
            signIn:signIn,
          })
        }else{
          let signOut = {
            status:res.data[2].status,
            createtime:res.data[2].createtime
          }
          that.setData({
            isShowSingOut:2,
            signOut:signOut,
          })
        }
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