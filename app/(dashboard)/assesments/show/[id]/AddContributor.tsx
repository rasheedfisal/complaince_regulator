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
import {
  getAllStaffListFn,
  getAssesmentListFn,
  getContributionRolesListFn,
  getControlListFn,
} from "@/api/selectablesApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createAssesmentControlFn } from "@/api/assessmentsApi";
import {
  IAssignUpdateContributor,
  IContributor,
  ICreateUpdateAssesmentControl,
} from "@/typings";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import FormSelect from "@/components/FormSelect";
import FormInput from "@/components/FormInput";
import SubmitButton from "@/components/SubmitButton";
import { DocumentPlusIcon } from "@heroicons/react/24/solid";
import CreateIcon from "@/icons/CreateIcon";
import { assignContributorFn } from "@/api/contributorsApi";

const createContributorSchema = object({
  // maturity_level: string().min(1, "Maturity Level is required"),
  // target_date: string()
  //   .min(10, "Target Date is required")
  //   .optional()
  //   .or(z.literal("")),

  role: z.object({
    label: z.string(),
    value: z.string(),
  }),
  staff: z.object({
    label: z.string(),
    value: z.string(),
  }),
});
export type IUpsertContributor = TypeOf<typeof createContributorSchema>;

type pageProp = {
  id: string;
  contributors: IContributor[] | undefined;
};
const AddContributor = ({ id, contributors }: pageProp) => {
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const {
    isLoading: isRolesLoading,
    isSuccess: isRolesSuccess,
    data: roles,
  } = useQuery(["contribution-roles"], () => getContributionRolesListFn(), {
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
    isLoading: isStaffLoading,
    isSuccess: isStaffSuccess,
    data: staff,
  } = useQuery(["Staff-lists"], () => getAllStaffListFn(), {
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

  const { isLoading, mutate: assignContributor } = useMutation(
    (cont: IAssignUpdateContributor) => assignContributorFn(cont),
    {
      onSuccess: ({ message }) => {
        toast.success(message);
        setOpen((prev) => !prev);
        queryClient.invalidateQueries(["regulator-contributor"]);
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

  const methods = useForm<IUpsertContributor>({
    resolver: zodResolver(createContributorSchema),
  });
  const {
    formState: { isSubmitSuccessful, errors },
  } = methods;

  useUpdateEffect(() => {
    if (isSubmitSuccessful) {
      methods.reset({
        role: {
          label: "Select...",
          value: "",
        },
        staff: {
          label: "Select...",
          value: "",
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<IUpsertContributor> = (values) => {
    contributors?.forEach(({ user }) => {
      if (user.id.toString() === values.staff.value) {
        setIsDuplicate(true);
      }
    });

    if (isDuplicate) {
      toast.warning("User Already Exists!!", {
        position: "top-right",
      });
      setIsDuplicate(false);
    } else {
      const cont: IAssignUpdateContributor = {
        assesment_id: id,
        user_id: values.staff.value,
        role: values.role.value,
      };
      assignContributor(cont);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-primary space-x-1 hover:bg-primary-dark text-white focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark text-xs font-bold uppercase px-3 py-1 rounded outline-none mr-1 mb-1 ease-linear transition-all duration-150">
          <span className="w-4 inline-flex align-middle">
            <CreateIcon />
          </span>
          <span className="inline-flex align-middle">Assign</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-screen-sm overflow-y-scroll max-h-screen lg:h-3/5">
        <DialogHeader>
          <DialogTitle>Assign Contributor</DialogTitle>
          <DialogDescription></DialogDescription>
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
                  label="Staff"
                  name="staff"
                  isLoading={isStaffLoading}
                  data={
                    isStaffSuccess
                      ? staff.data.map(({ user_id, name }) => ({
                          value: user_id,
                          label: name,
                        }))
                      : []
                  }
                  isMulti={false}
                  isRtl={false}
                />
              </div>
              <div className="grid grid-cols-1">
                <FormSelect
                  label="Role"
                  name="role"
                  isLoading={isRolesLoading}
                  data={
                    isRolesSuccess
                      ? roles.data.map((item) => ({
                          value: item,
                          label: item,
                        }))
                      : []
                  }
                  isMulti={false}
                  isRtl={false}
                />
              </div>
              <DialogFooter>
                <SubmitButton
                  title="Submit"
                  clicked={isLoading}
                  loadingTitle="loading..."
                  icon={<DocumentPlusIcon className="h-5 w-5" />}
                />
              </DialogFooter>
            </form>
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddContributor;
