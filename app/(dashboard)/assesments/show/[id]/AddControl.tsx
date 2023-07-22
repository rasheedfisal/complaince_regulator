"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TypeOf, object, string, z } from "zod";
import { getAssesmentListFn, getControlListFn } from "@/api/selectablesApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createAssesmentControlFn } from "@/api/assessmentsApi";
import { ICreateUpdateAssesmentControl } from "@/typings";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import FormSelect from "@/components/FormSelect";
import FormInput from "@/components/FormInput";
import SubmitButton from "@/components/SubmitButton";
import { DocumentPlusIcon } from "@heroicons/react/24/solid";
import CreateIcon from "@/icons/CreateIcon";

const createControlSchema = object({
  maturity_level: string().min(1, "Maturity Level is required"),
  target_date: string()
    .min(10, "Target Date is required")
    .optional()
    .or(z.literal("")),
  assesment: z.object({
    label: z.string(),
    value: z.string(),
  }),
  control: z.object({
    label: z.string(),
    value: z.string(),
  }),
});
export type IUpsertControl = TypeOf<typeof createControlSchema>;

const AddControl = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const {
    isLoading: isAssesmentLoading,
    isSuccess: isAssesmentSuccess,
    data: assesments,
  } = useQuery(["assesment-lists"], () => getAssesmentListFn(), {
    select: (data) => data,
    retry: 1,
    onError: (error) => {
      if ((error as any).response?.data?.message) {
        toast.error((error as any).response?.data?.message, {
          position: "top-right",
        });
      }
    },
  });

  const {
    isLoading: isControlLoading,
    isSuccess: isControltSuccess,
    data: controls,
  } = useQuery(["controls-lists"], () => getControlListFn(), {
    select: (data) => data,
    retry: 1,
    onError: (error) => {
      if ((error as any).response?.data?.message) {
        toast.error((error as any).response?.data?.message, {
          position: "top-right",
        });
      }
    },
  });

  const { isLoading, mutate: createControl } = useMutation(
    (assesment: ICreateUpdateAssesmentControl) =>
      createAssesmentControlFn(assesment),
    {
      onSuccess: ({ message }) => {
        toast.success(message);
        setOpen((prev) => !prev);
        queryClient.invalidateQueries(["assesments"]);
        // router.push("/assesments");
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

  const methods = useForm<IUpsertControl>({
    resolver: zodResolver(createControlSchema),
  });
  const {
    formState: { isSubmitSuccessful, errors },
  } = methods;

  useUpdateEffect(() => {
    if (isSubmitSuccessful) {
      methods.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<IUpsertControl> = (values) => {
    const assesment: ICreateUpdateAssesmentControl = {
      assesment_id: values.assesment.value,
      control_id: values.control.value,
      maturity_level: values.maturity_level,
      target_date: values.target_date,
    };
    createControl(assesment);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="bg-primary space-x-1 hover:bg-primary-dark text-white focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark text-xs font-bold uppercase px-3 py-1 rounded outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          //   onClick={() => setOpen((prev) => !prev)}
        >
          <span className="w-4 inline-flex align-middle">
            <CreateIcon />
          </span>
          <span className="inline-flex align-middle">Add Control</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-screen-sm overflow-y-scroll max-h-screen lg:h-5/6">
        <DialogHeader>
          <DialogTitle>Add Control</DialogTitle>
          <DialogDescription>
            <span className="text-red-600">{errors.assesment?.message}</span>
            <span className="text-red-600">{errors.control?.message}</span>
            <span className="text-red-600">
              {errors.maturity_level?.message}
            </span>
            <span className="text-red-600">{errors.root?.message}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <FormProvider {...methods}>
            <form
              className="space-y-6"
              noValidate
              autoComplete="off"
              onSubmit={methods.handleSubmit(onSubmitHandler)}
            >
              <div className="grid grid-cols-1">
                <FormSelect
                  label="Assesment"
                  name="assesment"
                  isLoading={isAssesmentLoading}
                  data={
                    isAssesmentSuccess
                      ? assesments.data.map(({ id, framework }) => ({
                          value: id.toString(),
                          label: framework,
                        }))
                      : []
                  }
                  isMulti={false}
                  isRtl={false}
                />
              </div>
              <div className="grid grid-cols-1">
                <FormSelect
                  label="Control"
                  name="control"
                  isLoading={isControlLoading}
                  data={
                    isControltSuccess
                      ? controls.data.map(({ id, name }) => ({
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
                <FormInput
                  label="Maturity Level"
                  type="text"
                  name="maturity_level"
                />
              </div>
              <div className="grid grid-cols-1">
                <FormInput label="Target Date" type="date" name="target_date" />
              </div>
              <DialogFooter>
                {/* <div className="flex"> */}
                <SubmitButton
                  title="Submit"
                  clicked={isLoading}
                  loadingTitle="loading..."
                  icon={<DocumentPlusIcon className="h-5 w-5" />}
                />
                {/* </div> */}
              </DialogFooter>
            </form>
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddControl;
