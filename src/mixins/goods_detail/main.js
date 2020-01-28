import wepy from 'wepy';

export default class extends wepy.mixin {
  data = {
    // 发送请求的商品ID
    goods_id: '',
    // 商品详情页的数据
    goodsDetailList: {},
    // tab标签页默认激活
    active: 0,
    // 收获地址数据
    addressList: null
  };
  onLoad(options) {
    console.log(options);
    this.goods_id = options.goods_id;
    this.getGoodsDetailList();
  }
  methods = {
    // 点击预览图片
    preview(current) {
      wepy.previewImage({
        // 所有图片的路劲
        urls: this.goodsDetailList.pics.map(x => x.pics_big),
        // 当前默认看到的图片
        current: current
      });
    },
    // 选择收获地址
    async chooseAddress() {
      const res = await wepy.chooseAddress().catch(err => err);
      if (res.errMsg !== 'chooseAddress:ok') {
        return wepy.baseToast('获取收获地址失败');
      }
      //   console.log(res)
      this.addressList = res;
      wepy.setStorageSync('address', res);
      // 异步函数的话 必须调用这个函数
      this.$apply();
    },
     // 加入购物车
     addToCart () {
         console.log(this.$parent.globalData)
         this.$parent.addGoodsToCart(this.goodsDetailList)
        wepy.showToast({
            title:'已加入购物车',
            icon:'success'
        })
    }
  };
  computed = {
      addressStr(){
          if(this.addressList === null) {
              return '请选择收获地址'
          }
          const addr = this.addressList
          const str = 
          addr.provinceName + addr.cityName + addr.countyName + addr.detailInfo
          return str
      },
      // 定义一个计算属性 把全部的全选状态的数量传给下面的
      total(){
        return this.$parent.globalData.total
      }
  }
  // 触发标签选择的
  onChange() {}
  // 获取商品详情数据
  async getGoodsDetailList() {
    const { data: res } = await wepy.get('/goods/detail', {
      goods_id: this.goods_id
    });
    console.log(res);
    if (res.meta.status !== 200) {
      return wepy.baseToast();
    }
    this.goodsDetailList = res.message;
    this.$apply();
  }
}
