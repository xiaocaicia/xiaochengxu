// 导入wepy
import wepy from 'wepy';
// 导出
export default class extends wepy.mixin {
  data = {
    // 分类数据
    cateList: [],
    // 二级分类数据
    secondCate: [],
    // 默认被激活得索引项
    active: 0,
    // 动态获得得屏幕高度
    whight: 0
  };
  onLoad() {
    this.getCateList();
    this.getWindowHeight();
  }
  methods = {
    onChange(event) {
      // console.log(event.detail)
      this.secondCate = this.cateList[event.detail].children;
      console.log(this.secondCate);
    },
    // 点击跳转到商品列表页面，同时把商品分类得cid传递过去
    goGoodsList(cid) {
    //   console.log(cid);
      // 跳转
      wepy.navigateTo({
          url:'/pages/goods_list?cid=' + cid
      })
    }
  };
  // 获取分类数据
  async getCateList() {
    const { data: res } = await wepy.get('/categories');
    if (res.meta.status !== 200) {
      return wepy.baseToast();
    }
    this.cateList = res.message;
    this.secondCate = res.message[0].children;
    // console.log(this.secondCate)
    this.$apply();
  }
  // 动态获取屏幕得可用高度
  async getWindowHeight() {
    const res = await wepy.getSystemInfo();
    // console.log(res)
    if (res.errMsg == 'getSystemInfo:ok') {
      this.whight = res.windowHeight;
      this.$apply();
    }
  }
}
