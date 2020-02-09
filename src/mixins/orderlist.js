import wepy from 'wepy';

export default class extends wepy.mixin {
  data = {
    // 默认显示哪一个标签
    active: 0,
    // 全部订单数据
    allOrderList: [],
    // 待付款数据
    waitOrderList: [],
    // 已付款 订单列表
    finishOrderList: []
  };
  onLoad() {
    this.getOrderList(this.active);
  }
  methods = {
    // 切换标签页
    tabChanged(e) {
    //   console.log(e);
      this.active = e.detail.index;
      this.getOrderList(this.active);
    }
  };
  // 获得订单数据
  async getOrderList(index) {
      console.log(index)
    const { data: res } = await wepy.get('/my/orders/all', {
      type: index + 1
    })
    console.log(res)
    if(res.meta.status !== 200) {
        return wepy.baseToast('获取订单数据失败')
    }
    console.log(res)
    if(index == 0) {
        this.allOrderList = res.message.orders
    }else if (index === 1) {
        this.waitOrderList = res.message.orders
    }else if (index === 2) {
        this.finishOrderList = res.message.orders
    }else {
        wepy.baseToast('订单类型错误')
    }
    this.$apply()
  }
}
