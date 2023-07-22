"use client";
import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { object, string, TypeOf, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SubmitButton from "@/components/SubmitButton";
import {
  ChevronDoubleLeftIcon,
  DocumentPlusIcon,
} from "@heroicons/react/24/solid";
import FormInput from "@/components/FormInput";
import { useRouter } from "next/navigation";
import { getSubDominFn, updateSubDomainFn } from "@/api/subDomainApi";
import { getAllDominFn } from "@/api/domainApi";
import { ICreateUpdateAssesment, ICreateUpdateSubDomain } from "@/typings";
import FormSelect from "@/components/FormSelect";
import Link from "next/link";
import { IUpsertAssesment } from "../add/page";
import { getOrganizationListFn } from "@/api/selectablesApi";
import { getAssesmentFn, updateAssesmentFn } from "@/api/assessmentsApi";

type PageProps = {
  params: {
    id: string;
  };
};

const createUpdateAssesmentSchema = object({
  framework: string().min(1, "Framework is required"),
  code: string().min(1, "Code is required"),
  org: z.object({
    label: z.string(),
    value: z.string(),
  }),
}).optional();

const Edit = ({ params: { id } }: PageProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    isLoading: isOrgLoading,
    isSuccess,
    data: orgs,
  } = useQuery(["organization-lists"], () => getOrganizationListFn(), {
    select: (data) => data,
    retry: 1,
    onError: (error) => {
      if ((error as any).response?.data?.msg) {
        toast.error((error as any).response?.data?.msg, {
          position: "top-right",
        });
      }
    },
  });

  const { isLoading: isAssesmentLoading } = useQuery(
    ["assesments", id],
    () => getAssesmentFn(id),
    {
      select: (data) => data,
      retry: 1,
      onSuccess: ({ error, data }) => {
        if (!error) {
          methods.reset({
            framework: data.framework,
            code: data.code.toString(),
            org: {
              value: data.organization_id,
              label: data.organization.name,
            },
          });
        }
      },
      onError: (error) => {
        console.log(error);
        if ((error as any).response?.data.message) {
          toast.error((error as any).response?.data.message, {
            position: "top-right",
          });
        }
      },
    }
  );

  const { isLoading, mutate: updateAssesment } = useMutation(
    ({ id, assesment }: { id: string; assesment: ICreateUpdateAssesment }) =>
      updateAssesmentFn({ id, assesment }),
    {
      onSuccess: ({ message }) => {
        toast.success(message);
        router.push("/assesments");
      },
      onError: (error: any) => {
        if ((error as any).response?.data?.message) {
          toast.error((error as any).response?.data?.message, {
            position: "top-right",
          });

          (error as any).response?.data.data.map((msg: string) =>
            toast.error(msg, {
              position: "top-right",
            })
          );
        }
      },
    }
  );

  const methods = useForm<IUpsertAssesment>({
    resolver: zodResolver(createUpdateAssesmentSchema),
  });

  if (isAssesmentLoading) {
    return <p>Loading...</p>;
  }

  const onSubmitHandler: SubmitHandler<IUpsertAssesment> = (values) => {
    updateAssesment({
      id: id,
      assesment: {
        framework: values.framework,
        code: values.code,
        organization_id: values.org.value,
      },
    });
  };

  return (
    <>
      {/* <!-- Content header --> */}
      <div className="flex items-center justify-end px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <Link
          href="/assesments"
          className="px-4 py-2 flex items-center text-sm text-white rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark"
        >
          <ChevronDoubleLeftIcon className="w-5 h-5" />
          Back
        </Link>
      </div>
      <div className="grid grid-cols-1 p-4">
        <div className="w-full relative px-4 py-6 space-y-6 bg-white rounded-md dark:bg-darker">
          <FormProvider {...methods}>
            <form
              className="space-y-6"
              noValidate
              autoComplete="off"
              onSubmit={methods.handleSubmit(onSubmitHandler)}
            >
              <div className="grid grid-cols-1">
                <FormSelect
                  label="Organization"
                  name="org"
                  isLoading={isOrgLoading}
                  data={
                    isSuccess
                      ? orgs.data.map(({ id, name }) => ({
                          value: id.toString(),
                          label: name,
                        }))
                      : []
                  }
                  isMulti={false}
                  isRtl={false}
                />
              </div>
              <div className="grid grid-cols-1">
                <FormInput label="Framework" type="text" name="framework" />
              </div>
              <div className="grid grid-cols-1">
                <FormInput label="Code" type="text" name="code" />
              </div>

              <div className="flex">
                <SubmitButton
                  title="Submit"
                  clicked={isLoading}
                  loadingTitle="loading..."
                  icon={<DocumentPlusIcon className="h-5 w-5" />}
                />
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
};

export default Edit;
