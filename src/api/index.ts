import { message } from 'antd'
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'
import axios from 'axios'
import { storage } from '~/utils'
// * 请求拦截器
// let refreshTokenPromise: Promise<ApiType.Auth.UserClaim> | null = null;

// const resetToken = (token:ApiType.Auth.UserClaim) => {
//   const store = getDefaultStore();
//   if (!refreshTokenPromise) {
//     refreshTokenPromise = fetch(`${import.meta.env.VITE_APP_BASE_API}/auth/refresh`, {
//       method: 'POST',
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({ refreshToken: token.refreshToken })
//     })
//       .then(async (response) => {
//         if (!response.ok) {
//           throw new Error(`status: ${response.status}`);
//         }
//         const res = await response.json();
//         const reslut = res.data;
//         if (!reslut?.accessToken) {
//           throw new Error("需要刷新token");
//         }

//         const newToken = {
//           ...token,
//           accessToken: reslut.accessToken,
//           refreshToken: reslut.refreshToken,
//           tokenTime: Date.now(),
//           expireIn: reslut.expireIn
//         };

//         store.set(authJotai.tokenAtom, newToken);
//         return newToken;
//       })
//       .catch((e) => {
//         message.warning("替换token 失败")
//         setTimeout(() => {
//           store.set(authJotai.tokenAtom, RESET);
//           window.location.href = '/login';
//         }, (1000));
//         throw e;
//       })
//       .finally(() => {
//         refreshTokenPromise = null;
//       });
//   }
// }

const includes = ["/v1/user/password", "/v1/sign/operate", "/get_bid", "/get_cert_info"]
export class Request {
  service: AxiosInstance

  constructor() {
    this.service = axios.create({
      baseURL: import.meta.env.VITE_APP_BASE_API
      // timeout: 5000
    })
    this.service.interceptors.request.use(
      async (request: InternalAxiosRequestConfig) => {
        // const store = getDefaultStore();
        // let token: any = store.get(authJotai.tokenAtom);
        const token = storage.get("token") as ApiType.Auth.UserClaim
        if (token) {
          // const isTokenExpired = token.expireIn && token.tokenTime &&
          //   (Date.now() - token.tokenTime) > (token.expireIn * 1000 * 0.9);

          // if (isTokenExpired) {
          //   try {
          //     resetToken(token);
          //     token = await refreshTokenPromise;
          //   } catch (e) {
          //     return Promise.reject(e);
          //   }
          // }
          request.headers.Authorization = `Bearer ${token?.accessToken}`;
        }

        return request;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    // * 响应拦截器
    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        // 文件对象直接返回
        if (
          response.request.responseType === 'blob' ||
          response.request.responseType === 'arraybuffer'
        ) {
          return response.data
        }

        const { code, message: msg, data } = response.data
        if (code === 401) {
          // const store = getDefaultStore();
          // let tokenObj = store.get(authJotai.tokenAtom);
          // tokenObj && resetToken(tokenObj);
          // TODO 提示重新登录
          // const setToken = useSetAtom(authJotai.tokenAtom)
          // setToken(RESET);
          localStorage.clear();
          message.warning("无效的会话，或者会话已过期，请重新登录。")
          setTimeout(() => {
            location.reload();
          }, 1000)
          return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
        }

        if (code === 403) {
          message.error('您没有权限访问该资源, 请联系管理员')
          return Promise.reject(msg)
        }
        if (code !== 200) {
          message.error(msg)
          return Promise.reject(msg)
        }
        const isInclues = includes.some(v=>response?.request?.responseURL?.includes(v))
        if (isInclues || response.config.method === "delete") {
          return Promise.resolve(response.data)
        }
        return Promise.resolve(data)
      },

      (error: AxiosError) => {
        let msg = error.message
        if (msg === 'Network Error') {
          msg = '后端接口连接异常'
        } else if (msg.includes('timeout')) {
          msg = '系统接口请求超时'
        } else if (msg.includes('Request failed with status code')) {
          msg = `系统接口${msg.substring(msg.length - 3)}异常`
        } else {
          msg = '系统繁忙,请稍后再试'
        }

        message.error(msg)
        return Promise.reject(error)
      }
    )
  }

  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.service.get(url, config)
  }

  post<T = unknown, R = unknown>(url: string, data?: R, config?: AxiosRequestConfig): Promise<T> {
    return this.service.post(url, data, config)
  }

  put<T = unknown, R = unknown>(url: string, data?: R, config?: AxiosRequestConfig): Promise<T> {
    return this.service.put(url, data, config)
  }

  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.service.delete(url, config)
  }

  uploadFile<T = unknown>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
    const defaultConfig = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    return this.service.post(url, formData, { ...defaultConfig, ...config })
  }
}
export default new Request()

// * 导出api模块
export * from './auth.api'
export * from './sign.api'
export * from './tenant.api'
export * from './user.api'
export * from './login_log.api'

