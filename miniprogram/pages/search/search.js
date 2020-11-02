// pages/search/search.js
import { tables,admin } from "../../utils/config";
import Db from "../../utils/db";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotSearch:[],
    keyword:"",
    lastSearch:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getHotSearch()
    this._getLastSearch()
  },
// 获取最近搜索
  _getLastSearch:function(){
    this.setData({
      lastSearch:wx.getStorageSync('keywords') || []
    })
  },
  // 点击搜索
  _search:function(){
    let keyword = this.data.keyword
    if(keyword==""){
      wx.showToast({
        title: '关键字不能为空',
        icon:'none'
      })
      return 
    }
    //  获取关键字
     let keywords = wx.getStorageSync('keywords') || []
     let index = keywords.findIndex(item=>{
       return item==keyword
     })
     if(index==-1){  //没查到
      keywords.unshift(keyword)
     }else{
      keywords.splice(index,1)
      keywords.unshift(keyword)
     }
     keywords = keywords.splice(0,9)
     wx.setStorageSync("keywords",keywords)
     wx.navigateTo({
       url: '../recipelist/recipelist?flag=1&keyword='+this.data.keyword,
     })
  },
// 获取搜索关键字
  _inputSearch:function(e){
    this.setData({
      keyword:e.detail.value
    })
  },
  // 获取热门搜索
  _getHotSearch:async function(){
    let res = await Db.findByPage(tables.menu,{menu_status:1},1,6,
      {filed:'view_num',sort:'desc'})
      if(res.data.length!=0){
        this.setData({
          hotSearch:res.data
        })
      }
  },
  // 跳转详情页
  _goDetail:function(e){
    // console.log(e);
    let {id,menuName} =e.currentTarget.dataset
    wx.navigateTo({
      url: `../recipeDetail/recipeDetail?id=${id}&menuName=${menuName}`,
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