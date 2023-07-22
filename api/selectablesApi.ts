import {
  IAssesment,
  IControls,
  IOrganization,
  IRegulators,
  IResponse,
  IUser,
} from "@/typings";
import { privateAuthApi } from "./axios";

type users = Omit<IUser, "role" | "permissions">;

export const getModelsFn = async () => {
  const response = await privateAuthApi.get<IResponse<string[]>>(
    `/selectables/log-models`
  );
  return response.data;
};

export const getUsersFn = async () => {
  const response = await privateAuthApi.get<IResponse<users[]>>(
    `/searchables/users`
  );
  return response.data;
};
export const getOrganizationListFn = async () => {
  const response = await privateAuthApi.get<IResponse<IOrganization[]>>(
    `/selectables/organizations`
  );
  return response.data;
};
export const getRegulatorListFn = async () => {
  const response = await privateAuthApi.get<IResponse<IRegulators[]>>(
    `/selectables/regulators`
  );
  return response.data;
};

export const getControlListFn = async () => {
  const response = await privateAuthApi.get<IResponse<IControls[]>>(
    `/selectables/controls`
  );
  return response.data;
};

export const getOrganizationTypeListFn = async () => {
  const response = await privateAuthApi.get<IResponse<string[]>>(
    `/selectables/organization-types`
  );
  return response.data;
};

export const getAssesmentListFn = async () => {
  const response = await privateAuthApi.get<IResponse<IAssesment[]>>(
    `/regulators/assesments`
  );
  return response.data;
};
