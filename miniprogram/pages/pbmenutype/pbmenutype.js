// pages/pbmenutype/pbmenutype.js
import { tables,admin } from "../../utils/config";
import Db from "../../utils/db";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showAddInput:false,
    showUpdataInput:false,
    cateName:'',
    cates:[],  //所有的菜谱
    cate:{}  //要修改的菜谱
  },
// 显示添加输入框
_showAddBtn:function(){
  this.setData({
    showAddInput:!this.data.showAddInput
  })
},

// 修改显示修改输入框
_showUpdateBtn:function(e){
  // console.log(e);
  let index = e.currentTarget.dataset.index
  this.setData({
    cate: this.data.cates[index] ,
    cateName:this.data.cates[index].cateName
  })
  this.setData({
    showUpdataInput:true
  })
},

// 获取用户输入的内容
_getCateName:function(e){
  // console.log(e);
  this.setData({
    cateName:e.detail.value
  })
},

// 添加
_addCate:async function(){
  // 检查输入的分类名称的合法性
  if(this.data.cateName==""){
    wx.showToast({
      title: '分类名不能为空',
      icon:'none'
    })
    return 
  }

  // 检查分类名称是否存在
let index = this.data.cates.findIndex(item=>{
  return item.cateName==this.data.cateName
})

  if(index==-1){
    // 往cate表中添加一条记录
    let res = await Db.add(tables.cate,{
      cateName:this.data.cateName
    })
    // console.log(res);
    if(res._id){
      wx.showToast({
        title: '添加分类成功',
      })
      this._getCates()
    }else{
      wx.showToast({
        title: '添加分类失败',
        icon:'none'
      })
    }
    this._showAddBtn()
  }else{
    wx.showToast({
      title: '分类名称已存在',
    })
  }
},

 // 获取所有的菜谱
 _getCates:async function(){
  wx.showLoading({
    title: '加载中',
  })
  // 从数据库查询 小程序最多查20条
  let res=await Db.findAll(tables.cate)
  // console.log(res);
  if(res.data.length!=0){
    this.setData({
      cates:res.data
    })
  }else{
    this.setData({
      cates:[]
    })
  }
  wx.hideLoading()
},
// 删除分类
_deleteCate:async function(e){
  // console.log(e);
  let index = e.currentTarget.dataset.index
  //删除数据库中数据
  let res = await Db.remove(tables.cate,this.data.cates[index]._id)
  if(res.stats.removed){
    wx.showToast({
      title: '删除成功',
    })
    this._getCates()
  }else{
    wx.showToast({
      title: '删除失败',
      icon:'none'
    })
  }
},

// 修改数据
_updataCates:async function(){
  if(this.data.cateName==""){
    wx.showToast({
      title: '分类名不能为空',
      icon:'none'
    })
    return 
  }
  //  先从数据库中查询有没有该分类
  let res = await Db.find(tables.cate,{cateName:this.data.cateName})
  if(res.data.length!=0){
    wx.showToast({
      title: '该分类已存在',
      icon:'none'
    })
    return 
  }
  // 修改数据库
  res = await Db.updata(tables.cate,this.data.cate._id,{
    cateName:this.data.cateName
  })
  if(res.stats.updated){
    wx.showToast({
      title: '修改成功',
    })
    this._getCates()
    this._getCates()
  }else{
    wx.showToast({
      title: '修改失败',
      icon:'none'
    })
  }
  this.setData({
    showUpdataInput:false
  })
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getCates()
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