import{
  getMultiData,
  getGoodsData
} from '../../service/home'

const types = ['sell','pop','new']
const TOP_DISTACE = 1000

// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner:[],
    recommends:[],
    titles:['精选','流行','新款'],
    goods:{
      'sell':{page:0,list:[]},
      'pop':{page:0,list:[]},
      'new':{page:0,list:[]}
    },
    currentType:'sell',
    showBackTop:false,
    isTabFixed:false,
    tabScrollTop:0
  },


  //------------------网络请求函数


  //请求轮播图以及推荐商品数据
  _getMultiData(){
    getMultiData().then(res => {
      //console.log(res);
      //取出轮播图和推荐商品数据

      const banners = res.data.data.banner.list;
      const recommends = res.data.data.recommend.list;

      //保存轮播图和推荐商品数据
      this.setData({
        banners,
        recommends
      })
    }).catch(err => {
      console.log(err);
    })
  },


  //商品列表数据
  _getGoodsData(type){
    //1.获取页码
    const page = this.data.goods[type].page + 1



    //2.发送网络请求
    getGoodsData(type,page).then(res => {
      console.log(res);

      //2.1取出数据
      const list = res.data.data.list

      //2.2将数据设置到对应type的list中
      const oldList = this.data.goods[type].list
      oldList.push(...list)

      //2.3将数据设置到data中的goods中
      const typeKey = `goods.${type}.list`
      const pageKey = `goods.${type}.page`
      this.setData({
        [typeKey] : oldList,
        [pageKey] : page
      })
    })
  },

  //------------------事件监听函数
  handleTabClick(event){
    // console.log(event);
    //取出index
    const index = event.detail.index
    // console.log(index);

    //设置currentType
    this.setData({
      currentType:types[index]
    })
    
  },
  onPageScroll(options){
    //1.取出scrollTop
    const scrollTop = options.scrollTop

    //2.修改backTop
    //官方文档  不要在滚动的函数中频繁调用setData()

    const flag = scrollTop >= TOP_DISTACE
    if(flag != this.data.showBackTop){
      this.setData({
        showBackTop : flag
      })
    }


    //3.修改isTabFixed
    const flag2 = scrollTop >= this.data.tabScrollTop
    if(flag2 != this.data.isTabFixed){
      this.setData({
        isTabFixed : flag2
      })
    }
  },
  imgLoad(){
    wx.createSelectorQuery().select('#tab-control').boundingClientRect(rect => {
      console.log(rect);
      this.data.tabScrollTop = rect.top
    }).exec()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //请求轮播图以及推荐商品数据
    this._getMultiData(),

    //商品列表数据
    this._getGoodsData('pop')
    this._getGoodsData('new')
    this._getGoodsData('sell')

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
    this._getGoodsData(this.data.currentType)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})