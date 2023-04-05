

<script lang="ts">
export default {
  name: 'wxPay',
};
</script>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import { Toast } from 'vant';

import { useUserStoreWithOut } from '../../store/modules/user';
import { wxLogin } from '../../apis/wx'
// import ORDER_API from '../../apis/order'
import { wxPayApi } from '../../utils/index'
import { getQueryString } from '../../utils/index'
import { unref } from 'vue';

const route = useRoute();
const payStatus = ref(1); //0 等在中  1 支付成功  2 支付失败
const code = getQueryString('code', '');
const state = getQueryString('state', '');
const orderId = route.query.orderId;
const token = route.query.token;
const openidref = ref<String>('');

const resString = ref<String>('');
onMounted(async () => {
  //token登录
  if (code && state && orderId && token) {
    const userStore = useUserStoreWithOut();
    userStore.tokenLogin({ token });
    let { data: { wxInfo: { openid } } } = await wxLogin({ code, state });
    openidref.value = openid;
    payFun();
  } else {
    Toast('参数错误');
  }
});
let payFun = async () => {
  if (code && state && orderId && token && unref(openidref)) {
    payStatus.value = 0;
    //创建 替他人支付的订单
    let res = await wxPayApi({ orderId, type: 'wx', openid: unref(openidref) as any });
    resString.value = JSON.stringify(res)
    if (res.errMsg == 'chooseWXPay:ok') {
      Toast('支付成功');
      payStatus.value = 1
    } else {
      payStatus.value = 2
    }
  }
}
let out = () => {
  window.close();
}



</script>


<template>
  <div class="wxpay">
    <div>
      <div>
        {{ unref(payStatus) === 0 ? '支付中...' :
          unref(payStatus) === 1 ? '支付成功' :
            '支付失败' }}
      </div>
      <br />



      <div v-if="unref(payStatus) && unref(payStatus) === 1">

        请返回浏览器点击验证支付

      </div>
      <div v-if="unref(payStatus) && unref(payStatus) === 2" @click="payFun()"> <van-button type="primary">

          重新支付


        </van-button></div>

    </div>
  </div>
</template>
<style lang="less">
.wxpay {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

}
</style>
