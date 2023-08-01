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
import {
  assignContributorFn,
  updateContributorFn,
} from "@/api/contributorsApi";
import EditIcon from "@/icons/EditIcon";

const createContributorSchema = object({
  role: z.object({
    label: z.string(),
    value: z.string(),
  }),
  // staff: z.object({
  //   label: z.string(),
  //   value: z.string(),
  // }),
});
export type IUpsertContributor = TypeOf<typeof createContributorSchema>;

type pageProp = {
  contributer: IContributor;
};
const UpdateContributor = ({ contributer }: pageProp) => {
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

  // const {
  //   isLoading: isStaffLoading,
  //   isSuccess: isStaffSuccess,
  //   data: staff,
  // } = useQuery(["Staff-lists"], () => getAllStaffListFn(), {
  //   select: (data) => data,
  //   retry: 1,
  //   onError: (error) => {
  //     if ((error as any).response?.data?.message) {
  //       toast.error((error as any).response?.data?.message, {
  //         position: "top-right",
  //       });
  //     }
  //   },
  // });

  const { isLoading, mutate: updateContributor } = useMutation(
    (cont: IAssignUpdateContributor) => updateContributorFn(cont),
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

  const onSubmitHandler: SubmitHandler<IUpsertContributor> = (values) => {
    const cont: IAssignUpdateContributor = {
      assesment_id: contributer.assesment_id,
      user_id: contributer.user.id,
      role: values?.role?.value || contributer.role,
    };
    updateContributor(cont);
  };

  useUpdateEffect(() => {
    if (isRolesSuccess && open) {
      methods.reset({
        role: {
          label: contributer.role,
          value: contributer.role,
        },
        // staff: {
        //   label: contributer.user.name,
        //   value: contributer.user.id,
        // },
      });
    }
  }, [isRolesSuccess, open]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="w-4 mr-2 mt-1 transform rounded-md text-yellow-700 hover:scale-110"
          title="Revoke"
        >
          <EditIcon />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-screen-sm overflow-y-scroll max-h-screen lg:h-2/4">
        <DialogHeader>
          <DialogTitle>Assign Contributor</DialogTitle>
          <DialogDescription>
            {/* {errors.role?.message} {errors.staff?.message}{" "}
            {errors.root?.message} */}
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
              {/* <div className="grid grid-cols-1">
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
                  defaultValue={contributer.user_id}
                />
              </div> */}
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
                  defaultValue={contributer.role}
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

export default UpdateContributor;
