// pages/volunteer/apply/index.js
const app = getApp();
const apiServer = require("../../../../utils/request")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sex:1,
    declare:1,    //申报类型  1成人  2学生
    studentPosition:[], //学生申报岗位 
    AdultPosition:[],   //成人申报岗位
    chengren:'',
    student:'',
    activity_id:0,
    user_id:0,
    name:'',  //姓名
    age:'',
    mobile:'',  //手机号
    sex_data:'',  //性别 参数值：男 女
    type:'',  //类型 参数值：成人 学生
    school:'',  //学校 在类型为学生时传入
    classs:'',  //班级 在类型为学生时传入
    gangwei:'',  //申请岗位
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let uid = app.globalData.uid || wx.getStorageSync('uid');
    let userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo');

    this.setData({
      activity_id:options.id || null,
      user_id:uid || userInfo.user_id
    })
    // 获取岗位列表
    this.get_position();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  get_position(){
    apiServer.get("/Activity/user_type").then(res=>{
      if(res.code==1){
        this.setData({
          studentPosition:res.data.student,
          AdultPosition:res.data.chengren,
        })
      }
    },err=>{
      console.log(err);
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  inputName(e){
    let name = e.detail.value;
    this.setData({
      name:name
    })
  },
  inputAge(e){
    let name = e.detail.value;
    this.setData({
      age:name
    })
  },
  inputPhone(e){
    this.setData({
      phone:e.detail.value 
    })
  },
  inputCompany(e){
    this.setData({
      company:e.detail.value 
    })
  },
  inputSchool(e){
    this.setData({
      school:e.detail.value 
    })
  },
  inputClass(e){
    this.setData({
      classs:e.detail.value 
    })
  },
  bindApplyType(e){   //选择成人申报岗位
    let index = e.detail.value;
    let chengren = this.data.AdultPosition[index];
    this.setData({
      chengren:chengren
    })
  },
  bindApplyTypeStudent(e){   //选择学生申报岗位
    let index = e.detail.value;
    let chengren = this.data.studentPosition[index];
    this.setData({
      student:chengren
    })
  },
  changeSex(e){ //选择性别
    let sex = e.currentTarget.dataset.sex
    this.setData({
      sex:sex
    })
  },

  changeDeclare(e){ //申报类型
    let id = e.currentTarget.dataset.sex
    this.setData({
      declare:id
    })
  },
  submit(){ //提交
    let activity_id = this.data.activity_id
    if(!activity_id){
      app.showmessage('请选择活动');
      return
    }
    let user_id = this.data.user_id
    if(!user_id){
      app.showmessage('请登录');
      return
    }
    let name = this.data.name
    if(!name){
      app.showmessage('请输入姓名');
      return
    }
    let sex_data = this.data.sex == 1? '男': '女'
    if(!sex_data){
      app.showmessage('请选择性别');
      return
    }
    let age = this.data.age
    if(!age){
      app.showmessage('请输入年龄');
      return
    }
    
    let mobile = this.data.phone
    if(mobile){
      if(app.checkPhone(mobile) == false){
        app.showmessage('请填写正确的手机号');
        return
      }
    }else{
      app.showmessage('请输入手机号');
      return
    }
   
    let type = this.data.declare    //申报类型 1成人  2学生
    if(!type){
      app.showmessage('请选择申报类型');
      return
    }
 
    let company = this.data.company
    let school = this.data.school
    let classs = this.data.classs
    if(type === 1){
      if(!company){
        app.showmessage('请输入申报人单位');
        return
      }
    }else{
      if(!school){
        app.showmessage('请输入学校名称');
        return
      }
      if(!classs){
        app.showmessage('请输入班级');
        return
      } 
    }
       
    let gangwei = type == 1 ? this.data.chengren : this.data.student;
    if(!gangwei){
      app.showmessage('请选择申报的岗位');
      return
    }

    let data = {
      activity_id,
      user_id,
      name,
      mobile,
      sex_data,
      type:type==1?'成人':'学生',
      school:type==1?'':school,
      classs:type==1?'':classs,
      gangwei,
      age,
      company:type==1?company:''
    };
    apiServer.post("/Activity/submit",data).then(res=>{
          app.showmessage(res.msg);
          if(res.code == 1){
            setTimeout(() => {
              console.log('-------');
              wx.navigateBack({
                delta:1
              })
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