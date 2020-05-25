// pages/home/pages/signUp/index.js

const app = getApp();
// const apiServer = require("../../../../utils/request")

const apiServer = require("../../../../utils/request")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:3,
    uid:0,
    token:'',
    lists:[],
    page:0,
    type:3,   //0 未审核 1 审核成功 2审核失败 3全部
    signLists:{ //页码  0 未审核 1 审核成功 2审核失败 3全部
      'not':{
        page:0,
        lists:[]
      },
      'pass':{
        page:0,
        lists:[]
      },
      'fail':{
        page:0,
        lists:[]
      },
      'all':{
        page:0,
        lists:[]
      },
    }
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
      this.get_lists(uid,this.data.current,1);
    }else{
      wx.navigateTo({
        url: '/pages/auto/index',
      })
    }
  },
  get_key(type){
    let key = '';
    if(type == 0){ //0 未审核 1 审核成功 2审核失败 3全部
      key = 'not'
    }else if(type == 1){
      key = 'pass';
    }else if (type == 2){
      key = 'pass';
    }else{
      key = 'all'
    }
    return key;
  },
  //isPull 1下拉刷新页码为0  2上拉加载页码
  get_lists(uid,type,isPull){
    var that = this;
    var type1 = type == 3 ? '' : type;
    let keys = that.get_key(type);
    let lists = that.data.signLists[keys].lists;
    let page = that.data.signLists[keys].page + 1;
    apiServer.post("/Venue/myvenueYuyue",{
      uid,
      switch:type1,
      offset:page,
    }).then(res=>{
      console.log(res);
        if(res.code == 1){
          if(isPull==1){
            page = 0
            lists = res.data.list;
          }else{
            lists.push(...res.data.list);
          }
          let newLists = {
            page:page,
            lists:lists
          }
          let keyOjb = `signLists.${keys}`;
          that.setData({
            lists:lists,
            [keyOjb]:newLists
          })
        }
    })
  },
  timeslot(e){
    let timeslot = e.currentTarget.dataset.timeslot
    wx.showModal({
      title: '课时',
      content: timeslot,
      success (res) {
        
      }
    })
  },
  bindrefresherrefresh(){
    console.log('下拉');
    var that = this;
    this.get_lists(this.data.uid,this.data.current,1);
    setTimeout(()=>{
      app.showmessage('加载成功');
      that.setData({
        triggered:false,
      })
    },3000)
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
  clickHeader(e){ //点击标题
    let id = e.currentTarget.dataset.id
    this.setData({
      current:id,
    })
    this.get_lists(this.data.uid,id,1);
  },
  gotoEvaluate(e){ //评价
    let yuyue_id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/home/pages/evaluate/index?yuyue_id='+yuyue_id,
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