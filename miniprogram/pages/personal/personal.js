// pages/personal/personal.js
import { tables,admin } from "../../utils/config";
import Db from "../../utils/db";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin:false,
    userInfo:{},
    currentIndex:0,
    myMenu:[],
    myCate:[],
    myFollow:[]
  },

// 获取用户的信息
  _getUserInfo:async function(e){
    // console.log(e);
    if(e.detail.userInfo){ //同意
      wx.showLoading({
        title: '登录中',
      })
         let userInfo = e.detail.userInfo
        // console.log(userInfo);
        // 获取openid(唯一标识符)
      let res = await wx.cloud.callFunction({
          name:"x_login"
        })
      // console.log(res);
      let _openid = res.result.openid
      // 插入之前先查询数据库中有没有存储过该用户（根据openid）
       res =await Db.find(tables.user,{_openid})
       if(res.data.length==0){   //没有查询到数据
            // 将用户信息 存入数据库，user表中
            await Db.add(tables.user,{userInfo})
            // console.log(res);
       }
            // 将用户信息存入缓存中
            wx.setStorageSync('_openid', _openid);
            wx.setStorageSync('userInfo', userInfo)
            wx.setStorageSync('isLogin', true)
            // 修改数据
            this.setData({
              isLogin:true,
              userInfo:userInfo
            })

            // 获取我的菜单
            this._getMyMenu()
            // 获取我的菜谱
            this._getMyCate()
            // 获取我的关注
            this._getMyFollow()
            wx.hideLoading()
    } 
  },
  // 获取我的菜单
  _getMyMenu:async function(){
    let _openid=wx.getStorageSync('_openid')
    let res = await Db.findAll(tables.menu,{_openid:_openid,menu_status:1})
    // console.log(res);
    if(res.data.length){
      this.setData({myMenu:res.data})
    }
    
  },

  // 删除菜谱
  _deleteMenu:async function(e){
    let index = e.currentTarget.dataset.index
    let res = await Db.updata(tables.menu,this.data.myMenu[index]._id,{menu_status:0})
    console.log(res);
    if(res.stats.updated){
      // splice返回的是切割掉的一项
      this.data.myMenu.splice(index,1)
      this.setData({
        myMenu:this.data.myMenu
      })
      wx.showToast({
        title: '删除成功',
      })
    }else{
      wx.showToast({
        title: '删除失败',
        icon:'none'
      })
    }
    
  },

  // 点击图片跳转至图片详情页
  _goDetail:function(e){
    let index = e.currentTarget.dataset.index
    let id = this.data.myMenu[index]._id
    let menuname = this.data.myMenu[index].menu_name
    wx.navigateTo({
      url: `../recipeDetail/recipeDetail?id=${id}&menuname=${menuname}`,
    })
  },
   // 我的关注  点击图片跳转至图片详情页  没写

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._login()
  },
  // 登录
  _login:function(){
    wx.getSetting({
     success:(res)=>{
      //  console.log(res);
       if(res.authSetting['scope.userInfo']){ //说明授权过了
        wx.showLoading({
          title: '登录中',
        })
          this.setData({
            isLogin:true,
            userInfo:wx.getStorageSync("userInfo")
          })
          // 获取我的菜单
          this._getMyMenu()
          // 获取我的菜谱
          this._getMyCate()
          // 获取我的关注
          this._getMyFollow()
          wx.hideLoading()
       }else{
         wx.removeStorageSync('_openid');
         wx.removeStorageSync('userInfo');
         wx.removeStorageSync('isLogin');
       }
       
      // if(res)
     }
    })
  },
      // 获取我的关注
      _getMyFollow:async function(){
      let _openid = wx.getStorageSync('_openid')
      let res = await Db.findAll(tables.collect,{_openid})
      if(res.data.length){
        let tasks = []
        // console.log(res.data.length)
        res.data.forEach(item=>{
          let promise = Db.findOne(tables.menu,item.menu_id)
          tasks.push(promise)
        })
        res = await Promise.all(tasks)
        // console.log(res);
       let myfollow= res.map(item=>{
          return item.data
        })
        this.setData({
          myFollow:myfollow
        })
        
      }
  },
  // 进入菜谱分类管理
  _goCate:function(){
    // 只有管理员才能进入
    let _openid = wx.getStorageSync('_openid')
    if(_openid==admin){
       wx.navigateTo({
      url: '../pbmenutype/pbmenutype',
    })
    }
   
  },

  // 切换选项卡
  _switchTab:function(e){
    let {index} = e.currentTarget.dataset
    this.setData({
      currentIndex:index
    })
  },
  
// 进入发布页面
_goPublishMenu:function(){
  wx.navigateTo({
    url: '../pbmenu/pbmenu',
  })
},

// 获取我发布过的菜谱分类
_getMyCate:async function(){
  let _openid = wx.getStorageSync('_openid')
 let res =await Db.findAll(tables.user_cate,{_openid})
//  console.log(res);
if(res.data.length!=0){
  let tasks=[]
  res.data.forEach(item=>{
    let promise = Db.findOne(tables.cate,item.cate_id)
    tasks.push(promise)
  })
res = await Promise.all(tasks)
// console.log(res);
let cate = res.map(item=>{
  return item.data
})
// console.log(cate);
this.setData({myCate:cate})



}
 
},

// 进入到分类列表页
_goCateList:function(e){
  let index = e.currentTarget.dataset.index
  let id = this.data.myCate[index]._id
  let  cateName = this.data.myCate[index].cateName
  wx.navigateTo({
    url: `../recipelist/recipelist?id=${id}&cateName=${cateName}`,
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