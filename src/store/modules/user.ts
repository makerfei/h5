import { defineStore } from 'pinia';
import { store } from '@/store';
import storage from 'good-storage';
import { router } from '@/router';
import API_USER from '@/apis/user';
import API_wx from '@/apis/wx';
import { loginProviderType } from '@/constants/modules/user';
import { getDevicePlatform } from '@/utils';
export interface UserInfo {
  id?: number;
  nick?: string;
  avatar?: string;
  [key: string]: any;
}
export interface UserLevel {
  id?: number;
  [key: string]: any;
}

export interface UserState {
  token: string;
  userInfo: NonNullable<UserInfo>;
  userLevel: NonNullable<UserLevel>;
}

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    token: storage.get('token', ''),
    userInfo: storage.get('userInfo', {}),
    userLevel: {},
  }),
  getters: {
    getToken: (state): string => state.token,
    hasLogin: (state): boolean => !!state.token,
    getUserInfo: (state): UserInfo => state.userInfo,
    getUserLevel: (state): UserLevel => state.userLevel,
  },
  actions: {

    async tokenLogin(payload: Recordable = {}) {
      return new Promise<void>(async (resolve, reject) => {
        this.token = payload.token;
        storage.set('token', payload.token);
        resolve();
      })
    },



    async wxLogin(payload: Recordable = {}) {
      return new Promise<void>(async (resolve, reject) => {
        let wxHaslogin =  sessionStorage.getItem('wxHaslogin');
        if (wxHaslogin!='1' && getDevicePlatform().isInWeChatApp) {
          const wxLoginRes = await API_wx.wxLogin(payload);
          if (wxLoginRes.data.token) {
            sessionStorage.setItem('wxHaslogin','1');
            this.token = wxLoginRes.data.token;
            storage.set('token', wxLoginRes.data.token);
          }
        }
        resolve();
      })

    },

    async login(payload: Recordable = {}) {
      const { provider = 'system', params } = payload;

      try {
        const loginProvider = loginProviderType[provider];

        const res = await API_USER[loginProvider.apiName](params);
        const { token } = res.data;

        this.token = token;
        storage.set('token', token);
        return res.data;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async logout(payload: Recordable = {}) {
      const { goLogin = false } = payload;

      if (this.getToken) {
        try {
          await API_USER.userLoginOut();
        } catch (error) {
          console.error('退出登录失败', error);
        }
      }

      this.token = '';
      storage.set('token', '');
      this.userInfo = {};
      storage.set('userInfo', {});
      goLogin && router.push('/login');
    },
    async getUserDetail() {
      try {
        const res = await API_USER.userDetail();
        const { base = {}, userLevel = {} } = res.data;

        this.userInfo = base;
        storage.set('userInfo', base);
        this.userLevel = userLevel;
      } catch (error) {
        console.error('获取用户详情失败', error);
      }
    },
  },
});

export function useUserStoreWithOut() {
  return useUserStore(store);
}
