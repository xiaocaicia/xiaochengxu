// 导入wepy
import wepy from 'wepy';
// 导出
export default class extends wepy.mixin{
    data = {
        // 轮播图数据
        swiperList: [],
        // 分类数据
        cateItems:[],
        // 楼层数据
        floorData:[]
      };
      onLoad() {
        this.getSwiperData();
        this.getCateItems();
        this.getFloorData()
      }
      onShow() {
        this.$parent.renderCarBadge()
      }
      methods = {
        goGoodsList (url){
          wepy.navigateTo({
            url
          })
        }
      }
      // 获取轮播图数据
      async getSwiperData() {
        const { data: res } = await wepy.get('/home/swiperdata');
        // console.log(res);
        if (res.meta.status !== 200) {
          return wepy.baseToast();
        }
        this.swiperList = res.message;
        this.$apply();
      }
      // 获取分类数据
      async getCateItems () {
        const { data:res } = await wepy.get('/home/catitems')
        // console.log(res)
        if(res.meta.status !== 200){
          return wepy.baseToast();
        }
        this.cateItems = res.message
        this.$apply()
      }
      // 获取楼层数据
      async getFloorData (){
        const {data:res} = await wepy.get('/home/floordata')
        if(res.meta.status !== 200){
          return wepy.baseToast();
        }
        this.floorData = res.message
        // console.log(this.floorData)
        this.$apply()
      }
}
