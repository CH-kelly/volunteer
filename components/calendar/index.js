// components/calendar/index.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type:{
      type:Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    week:['日','一','二','三','四','五','六'],
    days:[],
    isShow:false,

    //所选日期
    selectDate:{
      "year":new Date().getFullYear(),
      "month":new Date().getMonth()+1,
      "date":new Date().getDate(),
    },
    //日期list
    calendarDays:[],
    calendarTitle:'',
    current:0,

  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickCalendar(){
      this.setData({
        isShow:!this.data.isShow
      })
      
      // 向父组件发送事件
      this.triggerEvent('clickcalendar', {height:this.data.isShow == true?2:0})

    },
    getMonthDaysCurrent(e){
      let year = e.getFullYear()
      let month = e.getMonth() + 1
      let date = e.getDate()
      let day = e.getDay() // 周几
      let days = new Date(year, month, 0).getDate() //当月天数(即下个月0号=当月最后一天)

      let type = app.globalData.identityType;

      if(type ==0){
        // 更新选择日期
        this.data.selectDate = {
          'year': year,
          'month': month,
          'date': date,
        }
        // 更新顶部显示日期
        this.setData({
        calendarTitle: year + "年" + (month > 9 ? month : "0" + month) + "月" + (date > 9 ? date : "0" + date)
        })
        
        // 向父组件发送事件
        let myEventDetail = this.data.selectDate
        this.triggerEvent('myevent', myEventDetail)
      }else{
        // 更新选择日期
        this.data.selectDate = {
          'year': year,
          'month': month,
          'date': date+1,
        }
        // 更新顶部显示日期
        this.setData({
        calendarTitle: year + "年" + (month > 9 ? month : "0" + month) + "月" + ((date+1) > 9 ? (date+1) : "0" + (date+1))
        })
        
        // 向父组件发送事件
        let myEventDetail = this.data.selectDate
        this.triggerEvent('myevent', myEventDetail)
      }
      
      let calendarDays = []
      // 循环已过去的时间
      for (let i = day; i>0; i--) {
        let datei = this.data.selectDate.date - i;
        let selected = false
        if(type == 0){
          selected = true;
        }
        calendarDays.push({
          'year': year,
          'month': month,
          'date': datei,
          'day':new Date(year, month - 1, i).getDay(),
          'current': false,
          'today':false,
          'selected': selected
        })
      }
      // 当前日期
      calendarDays.push({
        'year': year,
        'month': month,
        'date': date,
        'day':day,
        'current': type == 0 ? true : false,
        'today':true,
        'selected': type == 0 ? true : false
      })
        
      // 当月显示的日期
      for (let i = 1; i <= days; i++) {
        if(date < i){
          let day = new Date(year, month - 1, i).getDay();

          let selected = false;
          let current = false;
          if([0,6].indexOf(day)!==-1 && type == 2){  //身份类型  1校内人员周一到周五  2校外人员可预约周六到周日
            selected = true;
            current = i==date+1;
          }
          if([1,2,3,4,5].indexOf(day)!==-1  && type == 1){  //身份类型  1校内人员周一到周五  2校外人员可预约周六到周日

            selected = true;
            current =  i==date+1;
          }
          if(type == 0){
            selected = true;
            current = i==date;
          }
          
          
          calendarDays.push({
            'year': year,
            'month': month,
            'date': i,
            'day':day ,
            'current':current ,
            'today':false,
            'selected': selected // 判断当前日期
          })
        }
        
      }
      console.log(calendarDays)
  
  
      // 下个月显示的天数及日期
      let lastDay = 36 - (calendarDays.length);
      for (let i = 1; i < lastDay; i++) {
        let date = new Date(year, month, i)

        calendarDays.push({
          'year': date.getFullYear(),
          'month': date.getMonth() + 1,
          'date': date.getDate(),
          'day': date.getDay(),
          'current': false,
          'today':false,
          'selected': false
        })
      }
      // console.log(calendarDays);
      this.setData({
        calendarDays: calendarDays
      })
    },

    // 手动选中日期
    clickDate(e) {
      let index = e.currentTarget.dataset.index
      let list = this.data.calendarDays;
      let days = list[index];
      list.forEach(item=>{
        item.current=false
      })
      list[index].current = true;
      // 更新顶部显示日期
      this.setData({
        calendarTitle: days.year + "年" + (days.month > 9 ? days.month : "0" + days.month) + "月" + (days.date > 9 ? days.date : "0" + days.date),
        calendarDays:list
      })
      // 向父组件发送事件
      let myEventDetail = days
      this.triggerEvent('myevent', myEventDetail)
    },

    lastMonth: function (e) {  //上个月
     //全部时间的月份都是按0~11基准，显示月份才+1

      let year = this.data.selectDate.year;
      let month = this.data.selectDate.month
      let date1 = this.data.selectDate.date
      let year1 = month - 2 < 0 ? year - 1 : year;
      let month1 = month - 2 < 0 ? 11 : month - 2;
      // 如果选择日期不在当月范围内，则重新刷新日历数据
     
      let date = new Date(year1, month1, date1)
      this.getMonthDaysCurrent(date)

    },
   nextMonth: function (e) { //下个月
     //全部时间的月份都是按0~11基准，显示月份才+1

    let year = this.data.selectDate.year;
    let month = this.data.selectDate.month
    let date1 = this.data.selectDate.date
    let year1 = month > 11 ? year + 1 : year;
    let month1 = month > 11 ? 0 : month;
    // 如果选择日期不在当月范围内，则重新刷新日历数据
    
    let date = new Date(year1, month1, date1)
    this.getMonthDaysCurrent(date)
      


    }
  },
  attached:function(){  //组件完全初始化完毕、进入页面节点树后， attached 生命周期被触发
 
    this.getMonthDaysCurrent(new Date())
    
      // 向父组件发送事件
      this.triggerEvent('clickcalendar', {height:this.data.isShow == true?2:0})
  },
})
