"use client";
import React from "react";
import { createRoot } from "react-dom/client";

//Bootstrap and jQuery libraries
// import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery.min.js";

//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables";

import $ from "jquery";
import Cookies from "js-cookie";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/api/axios";
import SearchIcon from "@/icons/SearchIcon";
import ActiveBadge from "@/components/ActiveBadge";
import { ArchiveRestoreIcon, BanIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { banStaffFn, restoreStaffFn } from "@/api/staffApi";

const Index = () => {
  const token = Cookies.get("AT");
  const router = useRouter();

  const { isSuccess: isDeletedSuccess, mutate: banStaff } = useMutation(
    ({ id }) => banStaffFn({ id }),
    {
      onSuccess: ({ message }) => {
        toast.success(message);
      },
      onError: (error) => {
        if (error.response?.data.message) {
          toast.error(error.response?.data.message, {
            position: "top-right",
          });
          error.response?.data.data.map((msg) =>
            toast.error(msg, {
              position: "top-right",
            })
          );
        }
      },
    }
  );
  const { isSuccess: isRestoredSuccess, mutate: restoreStaff } = useMutation(
    ({ id }) => restoreStaffFn({ id }),
    {
      onSuccess: ({ message }) => {
        toast.success(message);
      },
      onError: (error) => {
        if (error.response?.data.message) {
          toast.error(error.response?.data.message, {
            position: "top-right",
          });
          error.response?.data.data.map((msg) =>
            toast.error(msg, {
              position: "top-right",
            })
          );
        }
      },
    }
  );

  const handleBan = (id) => {
    if (confirm("are you sure you want to ban this user?")) {
      banStaff({ id });
    }
  };
  const handleRestore = (id) => {
    if (confirm("are you sure you want to restore this user?")) {
      restoreStaff({ id });
    }
  };
  useUpdateEffect(() => {
    //initialize datatable
    $("#staff_index").DataTable({
      ajax: {
        url: `${BASE_URL}/regulators/staff`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      search: { smart: true },
      processing: true,
      serverSide: true,
      columns: [
        // colum names..
        { data: "name", searchable: true, orderable: true },
        { data: "email", searchable: true, orderable: true },
        { data: "role", searchable: true, orderable: true },
        { data: "is_active", searchable: true, orderable: true },
        { data: "created_at", searchable: true, orderable: true },

        {
          data: "actions",
          searchable: false,
          orderable: false,
          defaultContent: "",
        },
      ],
      columnDefs: [
        {
          targets: [3],
          createdCell: (td, cellData, rowData) =>
            createRoot(td).render(
              <div className="flex">
                <ActiveBadge isActive={cellData} />
              </div>
            ),
        },
        {
          targets: [5],
          createdCell: (td, cellData, rowData) =>
            createRoot(td).render(
              <div className="flex">
                {rowData.is_active === "1" ? (
                  <button
                    className="w-4 mr-2 mt-1 transform rounded-md text-red-700 hover:scale-110"
                    title="Ban"
                    onClick={() => handleBan(rowData.id)}
                  >
                    <BanIcon className="h-5 w-f" />
                  </button>
                ) : (
                  <button
                    className="w-4 mr-2 mt-1 transform rounded-md text-blue-700 hover:scale-110"
                    title="Restore"
                    onClick={() => handleRestore(rowData.id)}
                  >
                    <ArchiveRestoreIcon className="h-5 w-f" />
                  </button>
                )}
              </div>
            ),
        },
      ],
    });
  }, []);
  useUpdateEffect(() => {
    //initialize datatable
    $("#staff_index").DataTable().ajax.reload();
  }, [isDeletedSuccess, isRestoredSuccess]);
  return (
    <table id="staff_index" className="display compact pt-3">
      <thead className="bg-primary text-white">
        <tr>
          <th>Name</th>
          <th className="self-center">Email</th>
          <th className="self-center">Role</th>
          <th className="self-center">Status</th>
          <th>Created At</th>
          <th></th>
        </tr>
      </thead>
    </table>
  );
};

export default Index;
