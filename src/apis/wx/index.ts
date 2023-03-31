import { request } from '@/utils/request';

/**
 * Banner列表
 */
export function wxLogin(data?: any) {
  return request({
    url: `/wx/wxLogin`,
    method: 'get',
    params: data,
  });
}




export default {
  wxLogin
};
