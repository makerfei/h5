

<script lang="ts">
export default {
  name: 'wxPay',
};
</script>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import { Dialog, Toast } from 'vant';

import { useUserStoreWithOut } from '../../store/modules/user';
import { wxLogin } from '../../apis/wx'
import { orderDetail } from '../../apis/order'
import { wxPayApi } from '../../utils/index'
import { getQueryString } from '../../utils/index'

const route = useRoute();
const payStatus = ref(0); //0 等在中  1 支付成功  2 支付失败
const code = ref(getQueryString('code', ''));
const state = ref(getQueryString('state', ''));
const orderId = ref(route.query.orderId);
const token = ref(route.query.token);
const openidref = ref<String>('');

const resString =  ref<String>('');
onMounted(async () => {
  //token登录
  if (code && state && orderId && token ) {
    const userStore = useUserStoreWithOut();
    userStore.tokenLogin({ token });
    let { data: { wxInfo: { openid } } } = await wxLogin({ code, state });
    openidref.value = openid;
    payFun();
    resString.value ='211212'
  } else {
    Toast('参数错误');
  }
});


let payFun = async () => {
  if (code && state && orderId && token && openidref) {
    payStatus.value = 0;
    //创建 替他人支付的订单
    let res = await wxPayApi({ orderId, type: 'wx', openid:openidref as any });
    resString.value = JSON.stringify(res)



    // let orderDetail = await orderDetail({ orderNumber: res.data.orderData.orderNumber })
    // if (orderDetail?.data?.orderInfo?.isPay === 1) {

    // } else {

    // }

    payStatus.value = 1



  }
}



</script>


<template>
  <div class="text">{{ payStatus }} {{ resString }} 32323232</div>
</template>
<style lang="less">

</style>
