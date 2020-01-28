import wepy from 'wepy';

export default class extends wepy.mixin {
  data = {
    cart: []
  };
  onLoad() {
    this.cart = this.$parent.globalData.cart;
  }
  computed = {
    // 判断购物车是否为空
    isEmpty() {
      if (this.cart.length <= 0) {
        return true;
      }
      return false;
    },
    // 总价格 单位是分
    amount() {
        let total = 0; //单位是元
        this.cart.forEach(x => {
          if (x.isCheck) {
            total += x.price * x.count;
          }
        });
        return total * 100;
      },
      // 定义一个是否全选的一个属性
      isFullChecked() {
          const allCount = this.cart.length
          let c = 0
          this.cart.forEach(x => {
              if(x.isCheck) {
                  c++
              }
          })
          return allCount === c
      }
  };
  methods = {
    // 监听商品数量变化的事件
    countChange(e) {
      // 获取变化之后的 输入的值
      // console.log(e.detail)
      // console.log(e.target.dataset.id)
      const id = e.target.dataset.id;
      const count = e.detail;
      // 这里就要调用全局的数量
      this.$parent.uplateGoodsCount(id, count);
    },
    // 复选框改变
    statusChange(e) {
      // console.log(e)
      // 当前选中的状态
      const status = e.detail;
      // 当前点击项的id
      const id = e.target.dataset.id;
    //   console.log(status);
      this.$parent.updataGoodsStatus(id, status);
    },
    // 根据id来删除对应的数组
    delete(id) {
      // console.log(id)
      this.$parent.removeGoodsById(id);
    },
    // 监听全选按钮改变
    onFullCheckChanged (e) {
        console.log(e.detail)
        this.$parent.updateAllGoodsStatus(e.detail)
    },
    // 提交订单
    submitOrder () {
      if(this.amount  <= 0) {
        return wepy.baseToast('订单金额不能为空')
      }
     // 否则就跳转
     wepy.navigateTo({
       url:'/pages/order'
     })
    }
  };
}
