import {
  IAssesment,
  IAssesmentControl,
  IAssesmentFullInfo,
  ICreateUpdateAssesment,
  ICreateUpdateAssesmentControl,
  IOrganization,
  IResponse,
} from "@/typings";
import { privateAuthApi } from "./axios";

export const createAssesmentFn = async (assesment: ICreateUpdateAssesment) => {
  const response = await privateAuthApi.post<IResponse<IAssesment>>(
    `/regulators/assesments`,
    assesment
  );
  return response.data;
};
export const createAssesmentControlFn = async (
  assesment: ICreateUpdateAssesmentControl
) => {
  const response = await privateAuthApi.post<IResponse<IAssesmentControl>>(
    `/regulators/assesments/add-control`,
    assesment
  );
  return response.data;
};

export const updateAssesmentFn = async ({
  id,
  assesment,
}: {
  id: string;
  assesment: ICreateUpdateAssesment;
}) => {
  const response = await privateAuthApi.put<IResponse<IAssesment>>(
    `/regulators/assesments/${id}`,
    assesment
  );
  return response.data;
};

export const getAssesmentFn = async (id: string) => {
  const response = await privateAuthApi.get<IResponse<IAssesmentFullInfo>>(
    `/regulators/assesments/${id}`
  );
  return response.data;
};

export const deleteAssesmentFn = async ({ id }: { id: string }) => {
  const response = await privateAuthApi.delete<IResponse<[]>>(
    `/regulators/assesments/${id}`
  );
  return response.data;
};
export const deleteAssesmentControlFn = async ({ id }: { id: string }) => {
  const response = await privateAuthApi.delete<IResponse<[]>>(
    `/regulators/assesments/remove-control/${id}`
  );
  return response.data;
};
