// pages/recipelist/recipelist.js
import { tables } from "../../utils/config";
import Db from "../../utils/db";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'' ,  //分类id
    flag:"",
    keyword:"",
    menu:[],
    page:1,
    isMore:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this._setOptions(options)
  // 根据分类的id去取该分类下的第一页的数据
  this._getMenuList(1) 
  },

_setOptions:function(options){
  // 从分类页过来
  let flag = options.flag || 0
  this.setData({
    id:options.id || "",
    flag:flag,
    keyword:options.keyword || ""
  })
wx.setNavigationBarTitle({
  title: options.cateName || "搜索结果"
})
},

  _getMenuList:async function(p){
    if(!this.data.isMore) return
    wx.showLoading({
      title: '加载中',
    })
    let where = null
    if(this.data.flag==1){  
      //从搜索页过来的  进行搜索查询
      where={
        menu_name: Db.db.RegExp({
          regexp: this.data.keyword,
          options: 'i',
        }),
        menu_status:1
      }

    }else{
      where={cate_id:this.data.id,menu_status:1}
    }
    
    // 根据分类id值取菜谱
    let res = await Db.findByPage(tables.menu,where,
      p,4,{filed:'menu_time',sort:'desc'})
      // console.log(res);
   
      if(res.data.length!=0){
        let tasks=[]
        res.data.forEach(item=>{
            let promise = Db.find(tables.user,{_openid:item._openid})
            tasks.push(promise)
        })
        let result = await Promise.all(tasks)
      //   console.log(res);  //菜谱
      //   console.log(result);  //用户
        res.data.forEach((item,index)=>{
          item.userInfo =result[index].data[0].userInfo
        })
        // console.log(res);
        wx.hideLoading()
        this.setData({
          menu:this.data.menu.concat(res.data)
        })
      }else{
        wx.hideLoading()
        this.setData({
          isMore:false
        })
      }
  },

  // 进入详情

  _goDetail:function(e){
    let index = e.currentTarget.dataset.index
    let id = this.data.menu[index]._id
    let menuname = this.data.menu[index].menu_name
    wx.navigateTo({
      url: `../recipeDetail/recipeDetail?id=${id}&menuname=${menuname}`,
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
    this.setData({
      page:this.data.page+1
    })
    this._getMenuList(this.data.page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})