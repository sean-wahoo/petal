import { AxiosResponse } from "axios";

/**
 *
 * Function to be used for SWR data fetching
 *
 * @param ...args API request function
 *
 * @returns Usable API call for SWR to handle
 *
 */
export const fetcher = (...args: any) =>
  fetch.apply(null, args).then((res) => res.json());

/**
 *
 * Function to wrap API calls to make them easier to work with
 *
 * @param promise API call to wrap
 *
 * @returns Successful call response or error
 *
 */
export const resolver = async (promise: Promise<AxiosResponse<any, any>>) => {
  try {
    let res = await Promise.resolve(promise);
    return [res.data, null];
  } catch (e: any) {
    console.error({ e });
    return [null, e.response.data];
  }
};
