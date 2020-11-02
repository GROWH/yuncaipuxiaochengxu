// pages/recipeDetail/recipeDetail.js
import { tables } from "../../utils/config";
import Db from "../../utils/db";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    menu:{},
    userInfo:{},
    isFollow:false , //显示是否收藏
    isLogin:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置加载项
    this._setOption(options)
    // 根据id获取对应的菜谱,获取菜谱对应的用户信息
    this._getMenuById()
    // 获取用户对菜谱的状态(是否关注)
    this._getFollow()
    // 将浏览量+1
    // this._setView()
    //  console.log(options);
  },


  _setFollow:async function(){
    if(this.data.isLogin){
      if(this.data.isFollow){
        let _openid=wx.getStorageSync('_openid')
        let menu_id=wx.getStorageSync('menu_id')
        //说明当前是关注状态  所以要取消关注
        // 往数据表中删除一条数据  根据_openid menu_id
          let res = await Db.removeByWhere(tables.collect,{
            _openid,menu_id
          })
          // console.log(res);
          if(res.stats.removed){
            Db.updata(tables.menu,this.data.id,{
              collect_num:Db._.inc(-1)
            })
            wx.showToast({
              title: '取消成功',
              success:res=>{
                    // 改变状态
                this.setData({
                  isFollow:false
                })
              }
            })
         
          }
      }else{
        // 进行关注
        // 往收藏表中添加一条数据(应该使用事务判断，这里没用)
        let res = await Db.add(tables.collect,{menu_id:this.data.id})
        if(res._id){
          // 将收藏量+1
          Db.updata(tables.menu,this.data.id,{collect_num:Db._.inc(1)})
          wx.showToast({
            title: '收藏成功',
            success:res=>{
              // 改变状态
              this.setData({
                isFollow:true
              })
            }
          })
        }
      }
    }else{
      wx.showToast({
        title: '请先登录',
        icon:'none'
      })
    }
  },

// 设置浏览量
  _setView:function(){
    Db.updata(tables.menu,this.data.id,{
      view_num:Db._.inc(1)
    })
  },
// 获取用户对菜谱的关注状态
_getFollow:async function(){
  let isLogin = wx.getStorageSync('isLogin') || false
  let _openid = wx.getStorageSync('_openid') || ""
  if(isLogin && _openid!=""){  //登录
      // 判断当前登录的用户和访问的菜谱的关系
      this.setData({
        isLogin:true
      })

      let res = await Db.find(tables.collect,{menu_id:this.data.id,_openid})
      if(res.data.length!=0){
        this.setData({
          isFollow:true
        })
      }

  }
},

// 根据id获取对应的菜谱
  _getMenuById:async function(){
    let res = await Db.findOne(tables.menu,this.data.id)
    // console.log(res);
   this.setData({
     menu:res.data
   })
  // 获取用户信息
    res=await Db.find(tables.user,{_openid:res.data._openid})
    this.setData({
      userInfo:res.data[0].userInfo
    })
    // console.log(res);
    // 获取用户对菜谱的状态
    
  },




  // 设置加载项(选项)
  _setOption:function(option){
    this.setData({
      id:option.id
    })
    wx.setNavigationBarTitle({
      title: option.menuname,
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
  onShareAppMessage: function (e) {
    // console.log(e);
    if(e.from=="button"){  //点击分享按钮，分享的是页面
      return {
        title:this.data.menu.menu_name+"的做法",
        path:"/pages/recipeDetail/recipeDetail?id="+this.data.menu._id+"&menuName="+this.data.menu.menu_name,
        imageUrl:this.data.menu.img[0]
      }
    }
    if(e.from=="menu"){  //点击右上角三个点分享，分享的是小程序
      return {
        title:"学做菜--学菜谱",
        path:"/pages/index/index",
        imageUrl:"cloud://myzhaohuan-test-8gwnk222e5119dd1.6d79-myzhaohuan-test-8gwnk222e5119dd1-1304000675/meishi.jpg"
      }
    }
  },
  // 分享到朋友圈
  onShareTimeline(){
    return {
     title:"美味的"+this.data.menu.menu_name,
     imageUrl:this.data.menu.img[0]
    }
  }
})