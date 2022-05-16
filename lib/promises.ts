import { AxiosResponse } from "axios";

export const fetcher = (...args: any) =>
  fetch.apply(null, args).then((res) => res.json());

export const resolver = async (promise: Promise<AxiosResponse<any, any>>) => {
  try {
    let res = await Promise.resolve(promise);
    return [res.data, null];
  } catch (e: any) {
    return [null, e.response.data];
  }
};
