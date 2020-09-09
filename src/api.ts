import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const config: AxiosRequestConfig = {
  timeout: 30000,
};

export class Api {
  public api: AxiosInstance;

  constructor() {
    this.api = Axios.create(config);
  }

  public get<T, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return this.api.get(url, config);
  }
}
