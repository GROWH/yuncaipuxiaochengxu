// pages/typelist/typelist.js
import { tables } from "../../utils/config";
import Db from "../../utils/db";
Page({

  /**
   * 页面的初始数据
   */
  data: {
   cates:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getCates()
  },

  // 获取所有分类，不仅仅是用户的
  _getCates:async function(){
    wx.showLoading({
      title: '加载中',
    })
    let res = await Db.findAll(tables.cate,{})
    if(res.data.length!=0){
      this.setData({cates:res.data})
    }
    wx.hideLoading()
  },

  // 跳转到菜谱列表页面
  _goMenuList:function(e){
    wx.showLoading({
      title: '加载中',
    })
    let index = e.currentTarget.dataset.index
    let id = this.data.cates[index]._id
    let  cateName = this.data.cates[index].cateName
    wx.navigateTo({
      url: `../recipelist/recipelist?id=${id}&cateName=${cateName}`,
    })
    wx.hideLoading()
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