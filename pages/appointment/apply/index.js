// pages/appointment/apply/index.js
const app = getApp();
const apiServer = require("../../../utils/request")
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 1, //身份类型  1校内人员  2校外人员
    venue_id: 0, //场馆id
    user_id:0,
    name: '',    //姓名
    company: '', //单位
    purpose: '', //用途
    number: 0,   //使用人数
    phone: 0,    //手机号码

    time: '',
    timeslot: [],
    index: 0,
    array: ['校内人员', '校外人员'],
    agree1:false,
    agree2:false,
    agreement:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type,
      venue_id: options.venue_id,
      user_id:wx.getStorageSync('uid') || 0
    }),
      this.getxuzhi();

  },
  getxuzhi(){
    var that = this;
    apiServer.post("/Venue/getxuzhi").then(res=>{
      if(res.code == 1){
        that.setData({
          agreement:res.data
        })
      }
    })
  },
  choiceTime() {
    wx.navigateTo({
      url: '/pages/appointment/choiceTime/index?type=' + this.data.type,
    })
  },
  inputName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  inputCompany(e) {
    this.setData({
      company: e.detail.value
    })
  },
  inputPurpose(e) {
    this.setData({
      purpose: e.detail.value
    })
  },
  inputNumber(e) {
    this.setData({
      number: e.detail.value
    })
  },
  inputPhone(e) {
    this.setData({
      phone: e.detail.value
    })
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

    this.setData({
      time: app.globalData.timer || '',
      timeslot: app.globalData.timeslot || [],
    })

  },
  submit() {
    if (!this.data.venue_id) {
      app.showmessage('请选择场馆');
      return;
    }
    if (!this.data.type) {
      app.showmessage('请选择身份');
      return;
    }
    if (!this.data.user_id) {
      app.showmessage('请登录');
      return;
    }
    if (!this.data.name) {
      app.showmessage('请输入姓名');
      return;
    }
    if (!this.data.company) {
      app.showmessage('请输入单位');
      return;
    }
    if (!this.data.purpose) {
      app.showmessage('请输入用途');
      return;
    }
    let phone = this.data.phone;
    if (phone) {
      if (app.checkPhone(phone) == false) {
        app.showmessage('请填写正确的手机号');
        return;
      }
    } else {
      app.showmessage('请填写手机号');
      return;
    }
    if (!this.data.number) {
      app.showmessage('请输入使用人数');
      return;
    } if (!this.data.time) {
      app.showmessage('请输入使用时间');
      return;
    } if (!this.data.timeslot) {
      app.showmessage('请选择课时');
      return;
    }
    if (this.data.agree1 == false) {
      app.showmessage('请勾选《预约须知》');
      return;
    }
    if (this.data.agree2 == false) {
      app.showmessage('请勾选《使用须知》');
      return;
    }
    let data = {
      venue_id: this.data.venue_id,
      user_id: this.data.user_id,
      name: this.data.name,
      company: this.data.company,
      yongtu: this.data.purpose,
      mobile: this.data.phone,
      type: this.data.type,
      number: this.data.number,
      yuyuetime: this.data.time,
      timeslot: this.data.timeslot
    }
    apiServer.post("/Venue/submit",data).then(res=>{
      app.showmessage(res.msg);
      if(res.code == 1){
        setTimeout(() => {
          app.globalData.timer = '';
          app.globalData.timeslot = [];
          wx.navigateTo({
            url: '/pages/appointment/examine/index',
          })
        }, 3000);
      }
    })
  },
  clickAgree(e) {
    this.setData({
      agree1: !this.data.agree1,
    })
  },
  clickAgree2(e) {
    this.setData({
      agree2: !this.data.agree2,
    })
  },
  agreement(e){
    let type = e.currentTarget.dataset.type;
    wx.showModal({
      title: this.data.agreement[type].title,
      content: this.data.agreement[type].value,
      success (res) {
        
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