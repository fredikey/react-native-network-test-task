import {NativeModules} from 'react-native';

const {NetworkingModule} = NativeModules;

export enum NetworkRequestType {
  GET = 'GET',
  POST = 'POST',
}

interface INetworkRequestConfigCommon {
  headers: Record<string, string>;
}

interface INetworkRequestConfigGET extends INetworkRequestConfigCommon {
  type: NetworkRequestType.GET;
}

interface INetworkRequestConfigPOST extends INetworkRequestConfigCommon {
  type: NetworkRequestType.POST;
  body: Record<string, string | number | boolean>;
}

export type INetworkRequestConfig =
  | INetworkRequestConfigGET
  | INetworkRequestConfigPOST;

export enum NetworkResponseType {
  Success = 'success',
  Error = 'error',
}
interface INetworkResponseCommon {
  statusCode: number;
}

interface INetworkResponseSuccess extends INetworkResponseCommon {
  type: NetworkResponseType.Success;
  data: string;
}

interface INetworkResponseError extends INetworkResponseCommon {
  type: NetworkResponseType.Error;
  error: string;
}

export type INetworkResponse = INetworkResponseSuccess | INetworkResponseError;

export const makeRequest = (
  url: string,
  params: INetworkRequestConfig,
): Promise<INetworkResponse> => {
  return NetworkingModule.makeRequest(url, params);
};
