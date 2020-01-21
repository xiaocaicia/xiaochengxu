import wepy from 'wepy';

export default class extends wepy.mixin {
  data = {
    // 搜索框里面默认的内容
    value: '',
    // 搜索出来的内容
    suggestList: [],
    // 搜索历史列表
    kwList: []
  };
  onLoad() {
    const kwList = wx.getStorageSync('key') || [];
    console.log(kwList);
  }
  methods = {
    // 当收索框发生变化的时候
    onChange(event) {
      // console.log(event.detail)
      this.value = event.detail.trim()
      // 这里要发送请求
      if (event.detail.trim().length <= 0) {
        this.suggestList = [];
        return;
      }
      this.getSuggestList(event.detail);
    },
    // 点击搜索
    onSearch(event) {
      // 这里的必须点击了enter的时候才会触发
      // console.log(event.detail)
      //  点击了搜索之后要进行跳转
      const kw = event.detail;
      if (kw.trim().length <= 0) {
        return;
      }
      // 也就是说里面没有重复的就添加
      if (this.kwList.indexOf(kw) === -1) {
        this.kwList.unshift(kw);
      }
      // 我们只需要十个 所以用slice 这个数组的方法 不会更改原来的数组 只会返回一个新的数组
      this.kwList.slice(0,10)
      // 保存到本地存储里面
      wx.setStorageSync('kw', this.kwList);
      wepy.navigateTo({
        url: '/pages/goods_list?query=' + kw.trim()
      });
    },
    // 点击取消
    onCancel() {
      this.suggestList = [];
    },
    // 点击跳转到商品详情页
    goGoodsDetail(goods_id) {
      wepy.navigateTo({
        url: '/pages/goods_detail/main?goods_id=' + goods_id
      });
    },
    // 当点击历史搜索跳转到相应的列表上去
    goGoodsList (query) {
      wepy.navigateTo({
        url:'/pages/goods_list?query=' + query
      })
    },
    // 点击删除图标清空历史记录
    clearHistory () {
      // console.log('1111')
      this.kwList = []
      wepy.setStorageSync('kw',[])
    }
  };
  computed = {
    // 定义一个显示还是隐藏历史搜索的
    isShowHistory(){
       if( this.value.length<=0){
           // true是显示搜索框
           return true
       }
       // false 是隐藏搜索框
       return false
    } 
  }
  // 获取输入搜索的内容
  async getSuggestList(searchStr) {
    const { data: res } = await wepy.get('/goods/qsearch', {
      query: searchStr
    });
    // console.log(res)
    if (res.meta.status !== 200) {
      return wepy.baseToast();
    }
    this.suggestList = res.message;
    this.$apply();
  }
}
