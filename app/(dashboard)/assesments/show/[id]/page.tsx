"use client";

import { useStateContext } from "@/context/AppConext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteAssesmentControlFn, getAssesmentFn } from "@/api/assessmentsApi";
import { toast } from "react-toastify";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import CreateIcon from "@/icons/CreateIcon";
import AddControl from "./AddControl";
import DeleteIcon from "@/icons/DeleteIcon";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDoubleLeftIcon } from "@heroicons/react/24/solid";
import ShowControl from "./ShowControl";

type PageProps = {
  params: {
    id: string;
  };
};
const Show = ({ params: { id } }: PageProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isLoading, data } = useQuery(
    ["assesments", id],
    () => getAssesmentFn(id),
    {
      select: (data) => data.data,
      retry: 1,
      onError: (error) => {
        if ((error as any).response?.data?.message) {
          toast.error((error as any).response?.data?.message, {
            position: "top-right",
          });
        }
      },
    }
  );

  const { isLoading: isDeleteControlLoading, mutate: deleteControl } =
    useMutation(({ id }: { id: string }) => deleteAssesmentControlFn({ id }), {
      onSuccess: ({ message }) => {
        toast.success(message);
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
    });

  const handleRemoveControl = (id: string) => {
    if (confirm("are you sure you want to delete this record?")) {
      deleteControl({ id });
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="flex items-center justify-end px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <Link
          href="/assesments"
          className="px-4 py-2 flex items-center text-sm text-white rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark"
        >
          <ChevronDoubleLeftIcon className="w-5 h-5" />
          Back
        </Link>
      </div>
      <div className="mt-5 space-y-2">
        <div className="min-w-full rounded gap-5 lg:grid lg:grid-cols-3">
          <div className="lg:block lg:col-span-1 space-y-2 px-4 py-6  rounded-md bg-white dark:bg-darker">
            <section>
              {/* Assesment Details */}

              <span className="text-gray-600 font-bold">{"Details:"}</span>
              <Separator className="my-2" />
              <div className="flex flex-col space-y-2 mt-2">
                <div className="flex gap-3">
                  <label className="text-sm font-medium">Framework {":"}</label>
                  <span className="text-sm">{data?.framework}</span>
                </div>
                <div className="flex gap-3">
                  <label className="text-sm font-medium">Code {":"}</label>
                  <span className="text-sm">{data?.code}</span>
                </div>
                <div className="flex gap-3">
                  <label className="text-sm font-medium">Status {":"}</label>
                  <span className="text-sm">{data?.status}</span>
                </div>
                <div className="flex gap-3">
                  <label className="text-sm font-medium">Due Date {":"}</label>
                  <span className="text-sm">
                    {data?.due_date?.toString() ?? "N/A"}
                  </span>
                </div>
                <div className="flex gap-3">
                  <label className="text-sm font-medium">
                    Created At {":"}
                  </label>
                  <span className="text-sm">{data?.created_at.toString()}</span>
                </div>
              </div>
            </section>
            <section>
              {/* Regulator Details */}

              <span className="text-gray-600 font-bold">{"Regulator:"}</span>
              <Separator className="my-2" />
              <div className="flex flex-col space-y-2">
                <div className="flex gap-3">
                  <label className="text-sm font-medium">Name {":"}</label>
                  <span className="text-sm">{data?.regulator.name}</span>
                </div>
                <div className="flex gap-3">
                  <label className="text-sm font-medium">
                    Email Domain {":"}
                  </label>
                  <span className="text-sm">
                    {data?.regulator.email_domain}
                  </span>
                </div>
              </div>
            </section>
            <section>
              {/* Organization Details */}

              <span className="text-gray-600 font-bold">{"Organization:"}</span>
              <Separator className="my-2" />
              <div className="flex flex-col space-y-2">
                <div className="flex gap-3">
                  <label className="text-sm font-medium">Name {":"}</label>
                  <span className="text-sm">{data?.organization.name}</span>
                </div>
                <div className="flex gap-3">
                  <label className="text-sm font-medium">
                    Email Domain {":"}
                  </label>
                  <span className="text-sm">
                    {data?.organization.email_domain}
                  </span>
                </div>
                <div className="flex gap-3">
                  <label className="text-sm font-medium">Code {":"}</label>
                  <span className="text-sm">{data?.organization.code}</span>
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-2 px-4 py-6 rounded-md bg-white dark:bg-darker">
            <div className="flex justify-end">
              {/* model goes here */}
              <AddControl />
            </div>
            <ScrollArea className="h-96 w-full rounded-md border">
              <Table className="w-full">
                <TableCaption>A list of your all controls.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[20%]">Feedback</TableHead>
                    <TableHead>Maturity Level</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead>Target Date</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.controls.map((ctl) => (
                    <TableRow key={ctl.id}>
                      <TableCell className="font-medium truncate">
                        {ctl.regulator_feedback}
                      </TableCell>
                      <TableCell>{ctl.maturity_level}</TableCell>
                      <TableCell className="text-center">
                        {ctl.status ?? "N/A"}
                      </TableCell>
                      <TableCell>
                        {ctl.target_date?.toString() ?? "N/A"}
                      </TableCell>
                      <TableCell>{ctl.created_at.toString()}</TableCell>
                      <TableCell>
                        <button
                          className="w-4 mr-2 mt-1 transform rounded-md text-red-700 hover:scale-110"
                          title="Delete Control"
                          onClick={() => handleRemoveControl(ctl.id.toString())}
                        >
                          <DeleteIcon />
                        </button>
                        <ShowControl key={ctl.id} data={ctl} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </div>
      </div>
    </>
  );
};

export default Show;
