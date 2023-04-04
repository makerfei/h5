export { throttle, debounce, deepClone } from './lodash';
import wx from 'weixin-js-sdk'
import { Toast } from 'vant';
import API_USER from '@/apis/user/index'
/**
 * 获取链接某个参数
 * @param {string} key 参数名称
 * @param {string} [url]  链接
 * @returns {string} 返回参数值
 * @example
 * getQueryString('name');
 * getQueryString('name', 'http://www.baidu.com?name=1&age=2');
 */


//微信分享
export function wxShare(data: any): any {
  return new Promise<void>(async (resolve: any, reject: any) => {
    let { title, desc, link, imgUrl } = data;
   let {timeStamp,nonceStr,signature}  =await API_USER.wxShare({url:link})
    
    wx.config({
      debug: true, // 测试阶段可用 true 打包返回给后台用 false
      appId: 'wxb3ac0230f6387556',
      timestamp: timeStamp,
      nonceStr: nonceStr,
      signature: signature,
      jsApiList: ['updateTimelineShareData', 'updateAppMessageShareData', 'onMenuShareWeibo', 'onMenuShareQZone', 'hideMenuItems', 'showMenuItems', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage']
    });

    let shareConfig = {
      title,
      desc,
      link,
      imgUrl,
      success: function () {
        Toast('分享成功')
      },
      cancel: function () {
        Toast('分享已取消')
      }
    };


    wx.ready(function () {
      wx.showMenuItems({
        menuList: ['menuItem:copyUrl', 'menuItem:share:timeline', 'menuItem:share:appMessage', 'menuItem:share:qq', 'menuItem:share:QZone'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
      });
      // 分享到朋友圈
      wx.updateTimelineShareData(shareConfig);

      // 分享给朋友
      wx.updateAppMessageShareData(shareConfig);

      // 分享到QQ
      wx.onMenuShareQQ(shareConfig);

      // 分享到腾讯微博
      wx.onMenuShareWeibo(shareConfig);

      // 分享到QQ空间
      wx.onMenuShareQZone(shareConfig);
      resolve();
    });


  })

}









export function wxPayApi(data: any): any {

  return new Promise<void>((resolve: any, reject: any) => {
    let { appId, nonceStr, timeStamp, paySign, signType, packageData } = data;

    wx.config({
      debug: false, // 测试阶段可用 true 打包返回给后台用 false
      appId: appId,
      timestamp: timeStamp,
      nonceStr: nonceStr,
      signature: paySign,
      jsApiList: ['chooseWXPay']
    });
    wx.ready(function () {
      wx.chooseWXPay({
        appId: appId,
        timestamp: timeStamp, // 时间戳
        nonceStr: nonceStr, // 随机字符串
        package: packageData, // 统一支付接口返回的prepay_id参数值
        signType: signType, //  签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        paySign: paySign, // 支付签名
        success: function () {
          resolve(true)
        },
        cancel: function () {
          resolve(false)
        },
        fail: function () {
          resolve(false)
        }
      });
    });
  })
}



export function getQueryString(key: string, url: string): string {
  const reg = new RegExp(`([?&]+)${key}=([^&#]*)`);
  const href = url || window.location.href;
  const matches = href.substring(1).match(reg);

  return matches ? decodeURIComponent(matches[2]) : '';
}

/**
 * 获取链接全部参数
 * @description 兼容search，hash并存情况
 * @param {string} [url]  链接
 * @returns {Record<string, string>} 返回包含当前URL参数的对象
 * @example
 * getURLParameters();
 * getURLParameters('http://www.baidu.com?name=1&age=2#/demoPage?weight=3&o=4');
 */
export function getURLParameters(url: string) {
  const reg = /([^?=&]+)(=([^&#]*))/g;
  const href = url || window.location.href;
  const matchList = href.match(reg) || [];
  const obj = {};

  matchList.forEach((v) => {
    obj[v.slice(0, v.indexOf('='))] = decodeURIComponent(v.slice(v.indexOf('=') + 1));
  });

  return obj;
}

/**
 * 客户端平台
 */
export function getDevicePlatform(): Record<string, boolean> {
  const ua = navigator.userAgent;
  const platform = navigator.platform;

  const isAndroid = /android/i.test(ua);
  const isIOS = /iphone|ipad|ipod|ios/i.test(ua);
  const isMobile = Boolean(isAndroid || isIOS);
  const isDesktop = /(Win32|Win64|MacIntel|Linux x86_64)/i.test(platform);
  const isInWeChatApp = /micromessenger/i.test(ua); // 是否微信内打开
  const isInMiniProgram = /miniProgram/i.test(ua); // 是否小程序内打开
  const isInWeChatDevTools = /wechatdevtools/i.test(ua); // 是否微信开发者工具内打开

  return {
    isAndroid,
    isIOS,
    isMobile,
    isDesktop,
    isInWeChatApp,
    isInMiniProgram,
    isInWeChatDevTools,
  };
}

/**
 * rpx2px
 * @param {number} n
 * @param {number} destWidth 设计稿基准屏幕宽度
 */
export function rpx2px(n: number, destWidth = 375) {
  const ratio = document.documentElement.clientWidth / destWidth;

  return (n * ratio).toFixed(2);
}

/**
 * 动态扩展运行时环境
 */
export function getEnv() {
  let ENV = 'dev';
  if (/正式域名/.test(location.host)) {
    ENV = 'prod';
  } else if (/测试域名/.test(location.host)) {
    ENV = 'test';
  } else {
    ENV = 'dev';
  }

  return {
    PROD: import.meta.env.PROD,
    DEV: import.meta.env.DEV,
    MODE: import.meta.env.MODE,
    ENV,
  };
}

/**
 * 获取接口前缀
 * @param {string} code api, host, origin
 */
export function getAPI(code = 'api') {
  const host: string = import.meta.env.PROD ? import.meta.env.VITE_APP_API_HOST : location.host;
  const origin = `${location.protocol}//${host}`;
  const basePath = import.meta.env.PROD ? '/api' : '/api';
  const api = `${origin}${basePath}`; // 基础接口

  switch (code) {
    case 'host':
      return host;
    case 'origin':
      return origin;
    default:
      return api;
  }
}
