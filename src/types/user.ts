/**
 * 后端接口通用/登录相关类型定义
 */

/** 通用接口响应基础结构 */
export interface BaseResponse {
  /** 业务状态码，0 表示成功 */
  code: number;
  /** 提示信息 */
  msg: string;
}

/** /user/login 请求参数 */
export interface LoginParams {
  userName: string;
  /** RSA-OAEP 加密后的 Base64 密码 */
  password: string;
}

/** /user/login 接口响应 */
export interface LoginResponse extends BaseResponse {
  /** 访问令牌 */
  accessToken: string;
  /** 刷新令牌 */
  refreshToken: string;
}

/** /user/public_key 接口响应（msg 中为 PEM 格式公钥） */
export type PublicKeyResponse = BaseResponse;
