"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IAssesmentControlFullInfo } from "@/typings";
import SearchIcon from "@/icons/SearchIcon";
import { ScrollArea } from "@/components/ui/scroll-area";
import AssesmentBadge from "@/components/AssesmentBadge";

type PageProps = {
  data: IAssesmentControlFullInfo;
};

const ShowControl = ({ data }: PageProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="w-4 mr-2 mt-1 transform rounded-md text-blue-700 hover:scale-110"
          title="show"
        >
          <SearchIcon />
        </button>
      </DialogTrigger>
      <DialogContent className="lg:max-w-screen-md max-w-screen-sm overflow-y-scroll max-h-screen lg:h-5/6">
        <DialogHeader>
          <DialogTitle>Details</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="lg:block lg:col-span-1 space-y-2 px-4 py-6  rounded-md bg-white dark:bg-darker">
          <section>
            <div className="flex flex-col space-y-2">
              <div className="flex gap-3">
                <label className="text-sm font-medium">Code {":"}</label>
                <span className="text-sm">{data?.control.code}</span>
              </div>
              <div className="flex gap-3">
                <label className="text-sm font-medium">Status {":"}</label>
                <AssesmentBadge status={data?.status ?? "N/A"} />
              </div>
              <div className="flex gap-3">
                <label className="text-sm font-medium">
                  Maturity Level {":"}
                </label>
                <span className="text-sm">{data?.maturity_level}</span>
              </div>
              <div className="flex gap-3">
                <label className="text-sm font-medium">Target Date {":"}</label>
                <span className="text-sm">
                  {data?.target_date?.toString() ?? "N/A"}
                </span>
              </div>
              <div className="flex gap-3">
                <label className="text-sm font-medium">Created At {":"}</label>
                <span className="text-sm">
                  {data?.created_at?.toString() ?? "N/A"}
                </span>
              </div>

              <label className="text-sm font-medium block">Control {":"}</label>
              <ScrollArea className="h-72 w-full p-2 rounded-md border">
                <span className="text-sm">{data?.control.name}</span>
              </ScrollArea>

              <label className="text-sm font-medium block">
                Feedback {":"}
              </label>
              <ScrollArea className="h-72 w-full p-2 rounded-md border">
                <span className="text-sm">
                  {data?.regulator_feedback ?? "N/A"}
                </span>
              </ScrollArea>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShowControl;
