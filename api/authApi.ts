import { ForgetInput } from "@/app/(auth)/forget/page";
import { LoginInput } from "../app/(auth)/login/page";
import { ILogin, IUser, IResponse, IResetPassword } from "../typings";
import { authApi, privateAuthApi } from "./axios";
import { IUpdateVerfiy } from "@/app/(dashboard)/verified/page";
// import { IUpdateVerfiy } from "@/app/(dashboard)/profile/page";

export const loginUserFn = async (user: LoginInput) => {
  const response = await authApi.post<IResponse<ILogin>>(
    "/regulators/login",
    user
  );
  return response.data;
};

export const logoutUserFn = async () => {
  const response = await privateAuthApi.post<IResponse<[]>>(
    "/regulators/logout"
  );
  return response.data;
};

export const getProfileFn = async () => {
  const response = await privateAuthApi.get<IResponse<IUser>>(
    "/regulators/profile"
  );
  return response.data;
};

export const forgetPasswordFn = async (email: ForgetInput) => {
  const response = await authApi.post<IResponse<[]>>(
    "/regulators/forgot-password",
    email
  );
  return response.data;
};

export const sendEmailOTPFn = async () => {
  const response = await authApi.post<IResponse<[]>>(
    "/regulators/email/send-otp"
  );
  return response.data;
};
export const verifyEmailFn = async (domain: IUpdateVerfiy) => {
  const response = await privateAuthApi.post<IResponse<[]>>(
    `/regulators/email/verify`,
    domain
  );
  return response.data;
};

export const resetPasswordFn = async (reset: IResetPassword) => {
  const response = await authApi.post<IResponse<[]>>(
    `/regulators/reset-password`,
    reset
  );
  return response.data;
};
