// pages/home/pages/scheduling/index.js

const app = getApp();
const apiServer = require("../../../../utils/request")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    week:['日','一','二','三','四','五','六'],
    days:[],
    isShow:false,
    time:'',
    token:'',
    uid:'',
    lists:[],
    height:0,
    page:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data.time)
    let token = wx.getStorageSync('token') || app.globalData.token;
    let uid = wx.getStorageSync('uid') || app.globalData.uid;
    if(token){
      this.setData({
        token:token,
        uid:uid
      })
      this.get_paiban(token,uid,this.data.time)
    }else{
      wx.navigateTo({
        url: '/pages/auto/index',
      })
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
  onClickCalendar: function(e){
    let height = 0;
    if(e.detail.height == 1){
      height = 180;
    }else{
      height = 355;
    }
    console.log(e,height)
    this.setData({
      height:height
    })
  },
  onMyEvent: function(e){   //日历组件提交的时间
    let time = e.detail.year + '-' + e.detail.month + '-'+e.detail.date
    this.setData({
      time:time
    })
    this.get_paiban(this.data.token,this.data.uid,time)
  },
  clickCalendar(){
    this.setData({
      isShow:!this.data.isShow
    })
  },
  // 去详情页面签到
  gotoDetail(e){
    let id = e.currentTarget.dataset.id
    console.log(id);  //isSign=0表示查看详情   =1表示报名id   =2表示排班id
    wx.navigateTo({
      url: '/pages/volunteer/detail/index?id='+id + '&isSign=2',
    })
  },
  get_paiban(token,uid,time){
    var that = this;
    let page = this.data.page;
    let lists = this.data.lists
    apiServer.post("/paiban/index",{
      token,
      uid,
      time,
      offset:page
    }).then(res=>{
      console.log(res);
      if(res.code == 1){
        if(page == 0){
          lists = res.data.list;
        }else{
          lists.push(...res.data.list)
        }
        that.setData({
          lists:lists
        })
        setTimeout(() => {
          wx.stopPullDownRefresh()
        }, 3000);
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
    console.log('下拉刷新')
    this.setData({
      page:0,
    })
    this.get_paiban(this.data.token,this.data.uid,this.data.time)
  }, 
  loadMore() { // 触底加载更多
    console.log('触底加载更多');
    this.setData({
      page:this.data.page + 1,
    })
    this.get_paiban(this.data.token,this.data.uid,this.data.time)
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