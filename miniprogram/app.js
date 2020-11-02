//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // 这个是测试环境（开发时使用）默认为设置中的第一个
        // env: 'my-env-id',


        // 这个是线上环境的id（上线时使用）
        // env:'myzhaohuan-release-5d2aob02b2da7',
        traceUser: true,
      })
    }

    this.globalData = {}
  }
})
