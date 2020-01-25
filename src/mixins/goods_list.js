import wepy from 'wepy';

export default class extends wepy.mixin {
  data = {
    // 查询关键词
    query: '',
    // 商品分类ID
    cid: '',
    // 页数索引
    pagenum: 1,
    // 每页长度
    pagesize: 20,
    // 分类列表数据
    goodsList: [],
    // 总数据条数
    total: 0,
    // 数据是否加载完毕的布尔值
    isover: false,
    // 是否显示加载
    isloading: false
  };
  onLoad(options) {
    console.log(options);
    // 这里进行一个传递参数的校验
    this.query = options.query || '';
    this.cid = options.cid || '';
    this.getGoodsList();
  }
  methods = {
    goGoodsDetail (goods_id) {
        wepy.navigateTo({
            url:'/pages/goods_detail/main?goods_id='+goods_id
        })
    }
  }
  // 获取商品列表
  async getGoodsList(cb) {
    this.isloading = true;
    const { data: res } = await wepy.get('/goods/search', {
      query: this.query,
      cid: this.cid,
      pagenum: this.pagenum,
      pagesize: this.pagesize
    });
    if (res.meta.status !== 200) {
      return wepy.baseToast();
    }
    this.goodsList = [...this.goodsList, ...res.message.goods];
    this.isloading = false;
    this.total = res.message.total;
    this.$apply();
    cb && cb()
  }
  // 触底操作
  onReachBottom() {
    // 判断是否正在发送请求
    // 如果正在进行发送请求 那么下面的就不再发送
    if (this.isloading) {
      return;
    }
    console.log('触底了');
    // 当发送的请求大于总页数的时候 就不需要再次重复发起请求了
    if (this.pagenum * this.pagesize >= this.total) {
      this.isover = true;
      return;
    }
    this.pagenum++;
    this.getGoodsList();
  }
  // 下拉刷新的操作
  onPullDownRefresh() {
    // 初始化必要请求
    this.pagenum = 1;
    this.total = 0;
    this.goodsList = [];
    this.isover = this.isloading = false;
    this.getGoodsList(() => {
      // 当发送请求完毕之后就停止下拉刷新的行为
      wepy.stopPullDownRefresh();
    });
  }
}
