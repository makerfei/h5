

<script lang="ts" setup>
import { computed } from '@vue/reactivity';

let Props = defineProps({
  picList: { type: Array<any> },
});



let hasVideo = computed<boolean>(() => {
  let res = false;
  (Props.picList as Array<any>).map((item: any) => {
    if (item?.type === 1) {
      res = true
    }
  })
  return res
})


let coverImg = computed<string>(() => {
  let res = '';
  (Props.picList as Array<any>).map((item: any) => {
    if (!item?.type && item?.type !== 0) {
      res = item.pic
    }
  })
  return res
})

let picListCom = computed<Array<any>>(() => {
  let resList: Array<any> = [];
  (Props.picList as Array<any>).map((item: any) => {
    if (!(hasVideo && !item.type && item.type !== 0)) {
      resList.push(({ ...item }))
    }
  })
  return resList
})
</script>
<template>
  <van-swipe :autoplay="5000" class="swiper">

    <van-swipe-item v-for="item in picListCom" :key="item.id" class="swiper-item">
      {{ item.coverUrls }}
      <van-image v-if="item.type === 0" class="swiper-item-img" fit="contain" :src="item.pic" alt="" />
      <video v-if="item.type === 1" webkit-playsinline="true" x-webkit-airplay="true" x5-playsinline="true"
        playsinline="true" :src="item.pic" :controls='true' :poster='coverImg' class="video" :show-fullscreen-btn='false'
        id="lss-product-swiper-video" muted="true"></video>
    </van-swipe-item>

  </van-swipe>
</template>
<style lang="less" scoped>
.swiper {
  width: 100%;
  height: 375px;
  background-color: black;

  &-item,
  &-item-img {
    width: 100%;
    height: 100%;
  }
}

.video {
  width: 375px;
  height: 375px;
  object-fit: contain;
}
</style>

