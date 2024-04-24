import { message } from 'antd';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { ResponseModel } from './types/index';

const isProd = process.env.NODE_ENV === 'production';
const prefix = isProd ? 'https://react-unit-test-lab.vercel.app/' : '/';

class HttpRequest {
  public service: AxiosInstance;

  constructor() {
    this.service = axios.create({
      baseURL: prefix,
      timeout: 2000,
      headers: {
        Accept: 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.service.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        config.headers = config.headers || {};
        // Example: Add Authorization header
        // config.headers['Authorization'] = `Bearer token`;
        return config;
      },
      (error: AxiosError) => Promise.reject(error),
    );

    this.service.interceptors.response.use(
      (response: AxiosResponse<ResponseModel>): AxiosResponse['data'] => {
        const { data, status, statusText } = response;
        const { success, message: msg } = data;
        // console.log(response, 'status === 200 && success');
        if (status === 200 && success) {
          return Promise.resolve({
            success: true,
            message: statusText,
            code: 200,
            data,
          });
        }

        let errorMessage = msg || `${status} ${statusText}`;
        if (status === 401) {
          // 登出
          message.error(errorMessage);
          throw new Error(errorMessage);
        }

        if (status >= 400 && status < 500) {
          errorMessage = '请求错误';
        } else if (response.status >= 500) {
          errorMessage = '服务器错误';
        }
        console.log(errorMessage, '---errorMessage');
        message.error(errorMessage);
        // throw new Error(errorMessage);
      },
      (error: AxiosError) => {
        console.error('Response Error: ', error);
        message.error('服务器异常');
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
}

const httpRequest = new HttpRequest();
export default httpRequest;
