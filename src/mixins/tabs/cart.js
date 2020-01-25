import wepy from 'wepy'

export default class extends wepy.mixin{
    data = {
        cart:[]
    }
    onLoad() {
        this.cart=this.$parent.globalData.cart
    }
    computed = {
        // 判断购物车是否为空
        isEmpty(){
            if(this.cart.length <=0) {
                return true
            }
            return false
        }
    }
}