"use client";

import { ChevronDoubleLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

import { TypeOf, object, string, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import FormInput from "@/components/FormInput";
import SubmitButton from "@/components/SubmitButton";
import { DocumentPlusIcon } from "@heroicons/react/24/solid";

import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { ICreateUpdateAssesment } from "@/typings";
import { useRouter } from "next/navigation";
import FormSelect from "@/components/FormSelect";
import { getOrganizationListFn } from "@/api/selectablesApi";
import { createAssesmentFn } from "@/api/assessmentsApi";

const createUpdateAssesmentSchema = object({
  framework: string().min(1, "Framework is required"),
  code: string().min(1, "Code is required"),
  org: z.object({
    label: z.string(),
    value: z.string(),
  }),
});

export type IUpsertAssesment = TypeOf<typeof createUpdateAssesmentSchema>;

const Add = () => {
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

  const { isLoading, mutate: createAssesment } = useMutation(
    (assesment: ICreateUpdateAssesment) => createAssesmentFn(assesment),
    {
      onSuccess: ({ message }) => {
        toast.success(message);
        router.push("/assesments");
      },
      onError: (error: any) => {
        if ((error as any).response?.data.message) {
          toast.error((error as any).response?.data.message, {
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
  const {
    formState: { isSubmitSuccessful },
  } = methods;

  useUpdateEffect(() => {
    if (isSubmitSuccessful) {
      methods.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<IUpsertAssesment> = (values) => {
    const assesment: ICreateUpdateAssesment = {
      framework: values.framework,
      code: values.code,
      organization_id: values.org.value,
    };
    createAssesment(assesment);
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

export default Add;
