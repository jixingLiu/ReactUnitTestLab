import { staticFunctionsHolder } from '@/static-functions';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

import { ResponseModel } from './types/index';

class HttpRequest {
  private service: AxiosInstance;

  constructor() {
    this.service = axios.create({
      baseURL: '/',
      timeout: 2 * 1000,
      headers: {
        Accept: 'application/json',
      },
    });

    this.service.interceptors.request.use(
      (config) => {
        /**
         * 在此处设置 token
         */
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      },
    );

    this.service.interceptors.response.use(
      (response: AxiosResponse<ResponseModel>): AxiosResponse['data'] => {
        const { data, status, statusText } = response;
        console.log(data, status, statusText, 'data, status, statusText ');
        if (statusText === 'OK') {
          return Promise.resolve({
            success: true,
            message: statusText,
            code: 200,
            data,
          });
        }

        let message = `${status} ${statusText}`;
        if (status === 401) {
          // 登出
          throw new Error(message);
        }

        if (status >= 400 && status < 500) {
          message = '请求错误';
        } else if (response.status >= 500) {
          message = '服务器错误';
        }
        staticFunctionsHolder.message?.error(message);

        throw new Error(message);
      },
      (error: AxiosError) => {
        console.error('Response Error: ', error);
        staticFunctionsHolder.message?.error('服务器异常');
        return Promise.reject(error);
      },
    );
  }

  public request<T = any>(
    config: AxiosRequestConfig,
  ): Promise<ResponseModel<T>> {
    return this.service
      .request<ResponseModel<T>>(config)
      .then((res: AxiosResponse['data']) => {
        return res as ResponseModel<T>;
      });
  }

  public get<T = any>(url: string, params?: any): Promise<ResponseModel<T>> {
    return this.request<T>({ method: 'GET', url, params });
  }

  public post<T = any>(url: string, data?: any): Promise<ResponseModel<T>> {
    return this.request<T>({ method: 'POST', url, data });
  }

  public put<T = any>(url: string, data?: any): Promise<ResponseModel<T>> {
    return this.request<T>({ method: 'PUT', url, data });
  }

  public delete<T = any>(url: string): Promise<ResponseModel<T>> {
    return this.request<T>({ method: 'DELETE', url });
  }

  // public upload<T = string>(
  //   fileItem: UploadFileItemModel,
  //   config?: UploadRequestConfig
  // ): Promise<ResponseModel<T>> | null {
  //   // if (!import.meta.env.VITE_UPLOAD_URL) return null;

  //   const formData = new FormData();
  //   formData.append(fileItem.name, fileItem.value);

  //   const uploadConfig: UploadRequestConfig = config
  //     ? { ...config, headers: { ...config.headers, 'Content-Type': 'multipart/form-data' } }
  //     : { headers: { 'Content-Type': 'multipart/form-data' } };

  //   return this.request<T>({
  //     method: 'POST',
  //     // url: u,
  //     data: formData,
  //     ...uploadConfig,
  //   });
  // }
}

const httpRequest = new HttpRequest();
export default httpRequest;
