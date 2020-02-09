import wepy from 'wepy'

export default class extends wepy.mixin{
    data = {
      addressInfo : null,
      cart:[],
      isLogin:false
    }
    methods = {
        // 选择收获地址
      async chooseAddress () {
          // 这里调用了商品详情页的函数 选择地址
        const res = await wepy.chooseAddress().catch(err =>err)
        // console.log(res)
        if(res.errMsg !== 'chooseAddress:ok'){
          return
        }
        this.addressInfo = res
        wepy.setStorageSync('address',res)
        this.$apply()
     },
     // 获取用户信息
     async getUserInfo (userInfo) {
      // 判断是否获取用户信息失败
      if(userInfo.detail.errMsg !== 'getUserInfo:ok') {
        return wepy.baseToast('获取用户信息失败')
      }
      //  console.log(userInfo)  // 这里就是登录后打印出的除了code的后四个参数
       // 获取用户登录的凭证code
       const loginRes = await wepy.login()
      //  console.log(loginRes)
       if(loginRes.errMsg !== 'login:ok') {
         return wepy.baseToast('微信登录失败')
        }

        // 登录的参数
        const loginParams = {
          code: loginRes.code,
          encryptedData: userInfo.detail.encryptedData,
          iv: userInfo.detail.iv,
          rawData: userInfo.detail.rawData,
          signature: userInfo.detail.signature
        }
  
        console.log(loginParams)
        // 发起登录请求，换取登录成功之后的token值
        const { data: res } = await wepy.post('/users/wxlogin', loginParams)

        console.log(res)
       if(res.meta.status !== 200 ) {
        return wepy.baseToast('微信登录失败')
       }
       //  把登录成功之后的token 保存导storage里面
       wepy.setStorageSync('token',res.message.token)
       //如果改变了 data的值之后 必须要重新渲染
       this.isLogin = true
       this.$apply()
     },
     // 支付订单  这个代码以后可以直接粘贴过去 修改一下下面的请求地址就可以了
     async onSubmit () {
        if(this.amount <= 0) {
          return wepy.baseToast('订单金额不能为0')
        }
        if(this.addressStr.length <= 0) {
          return wepy.baseToast('请选择地址')
        }

        // 创建订单
        const {data : createResult} = await wepy.post('/my/orders/create',{
          // 订单金额 单位元
          order_price:'0.01',
          consignee_addr:this.addressStr,
          order_detail:JSON.stringify(this.cart),
          goods:this.cart.map(x => {
            return {
              goods_id:x.id,
              goods_number:x.count,
              goods_price:x.price
            }
          })
        })
        console.log(createResult)
        if(createResult.meta.status !== 200) {
          return wepy.baseToast('创建订单失败！')
        }

        // 创建订单成功了
        const orderInfo = createResult.message
        console.log(orderInfo)

        // 生成预支付订单 这里的order_number是后台给的
        const {data:orderResult} = await wepy.post('/my/orders/req_unifiedorder',{
          "order_number": "GD20180507000000000110"
        })

        // 生成预支付订单失败
        if(orderResult.meta.status !== 200){
          return wepy.baseToast('生成预支付订单失败！')
        }

        // 走支付的流程
        // 调用微信支付的API
        //  console.log(orderResult)  因为没有token所以获取不到生成订单的信息
        // 发起请求
        const payResult = await wepy.requestPayment(orderResult.message.pay).catch(err => err)
        // 调用requestPayment 支付以后会生成一个二维码进行扫码支付
        // 同时如果我们点击小叉号取消支付的话 就会报错 所以这里我们需要进行错误捕捉
        console.log(payResult)

        // 当用户取消了支付
        if(payResult.errMsg === 'requestPayment:fail cancal'){
          return wepy.baseToast('您已取消了支付')
        }

        // 用户完成了支付的过程
        // 检查用户支付的结果
        const {data:payCheckResult} = await wepy.post('/my/orders/chkOrder',{
          order_number:orderInfo.order_number
        })

        if(payCheckResult.meta.status !== 200) {
          return wepy.baseToast('订单支付失败！')
        }

        // 提示用户支付成功
        wepy.showToast({
          title:'支付成功！'
        })

        // 跳转到订单列表页面
        wepy.navigateTo({
          url:'/pages/orderlist'
        })
     }

    }
    computed = {
      // 是否显示收获地址
      isHaveAddress () {
        if(this.addressInfo === null){
          return false
        }
        return true
      },
      // 收获地址
      addressStr (){
        if(this.addressInfo === null ) {
          return ''
        }
        return ( this.addressInfo.provinceName + this.addressInfo.cityName +  this.addressInfo.countyName + this.addressInfo.detailInfo)

      },
      amount(){
        let total=0
        this.cart.forEach(x => {
          total += x.price * x.count
        })
        return total*100
      }
    }
    onLoad(){
      // 在页面已加载的时候 就读取过去 以免后续加载的时候刷新变为null
      this.addressInfo =  wepy.getStorageSync('address') || null
      // 从购物车列表中，将那些被勾选的商品，过滤出来，形成一个新的数组
      const newArr = this.$parent.globalData.cart.filter(x => x.isCheck)
      console.log(newArr)
      this.cart = newArr
    }
  }