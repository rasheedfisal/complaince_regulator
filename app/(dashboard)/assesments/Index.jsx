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
import EditIcon from "@/icons/EditIcon";
import SearchIcon from "@/icons/SearchIcon";
import { BASE_URL } from "@/api/axios";
import DeleteIcon from "@/icons/DeleteIcon";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteAssesmentFn } from "@/api/assessmentsApi";
import AssesmentBadge from "@/components/AssesmentBadge";
const Index = () => {
  const token = Cookies.get("AT");
  const router = useRouter();

  const {
    isLoading: isDeleting,
    isSuccess: isDeletedSuccess,
    mutate: deleteAssesment,
  } = useMutation(({ id }) => deleteAssesmentFn({ id }), {
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
  });

  const handleDeleteAssesment = (id) => {
    if (confirm("are you sure you want to delete this record?")) {
      deleteAssesment({ id });
    }
  };

  useUpdateEffect(() => {
    //initialize datatable
    $("#assesments_index").DataTable({
      ajax: {
        url: `${BASE_URL}/regulators/assesments`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      search: { smart: true },
      processing: true,
      serverSide: true,
      columns: [
        // colum names..
        { data: "organization", searchable: true, orderable: true },
        { data: "framework", searchable: true, orderable: true },
        { data: "code", searchable: true, orderable: true },
        { data: "status", searchable: true, orderable: true },
        { data: "controls", searchable: true, orderable: true },
        // { data: "due_date", searchable: true, orderable: true },
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
                <AssesmentBadge status={cellData ?? "N/A"} />
              </div>
            ),
        },
        {
          targets: [6],
          createdCell: (td, cellData, rowData) =>
            createRoot(td).render(
              <div className="flex">
                <button
                  className="w-4 mr-2 mt-1 transform rounded-md text-blue-700 hover:scale-110"
                  title="show"
                  onClick={() => router.push(`/assesments/show/${rowData.id}`)}
                >
                  <SearchIcon />
                </button>
                <button
                  className="w-4 mr-2 mt-1 transform rounded-md text-yellow-700 hover:scale-110"
                  title="edit"
                  onClick={() => router.push(`/assesments/${rowData.id}`)}
                >
                  <EditIcon />
                </button>
                <button
                  className="w-4 mr-2 mt-1 transform rounded-md text-red-700 hover:scale-110"
                  title="delete"
                  onClick={() => handleDeleteAssesment(rowData.id)}
                >
                  <DeleteIcon />
                </button>
              </div>
            ),
        },
      ],
    });
  }, []);

  useUpdateEffect(() => {
    //initialize datatable
    $("#assesments_index").DataTable().ajax.reload();
  }, [isDeletedSuccess]);
  return (
    <table id="assesments_index" className="display compact pt-3">
      <thead className="bg-primary text-white">
        <tr>
          <th>Organization</th>
          <th className="self-center">Framework</th>
          <th className="self-center">Code</th>
          <th className="self-center">Status</th>
          <th className="text-center">Controls</th>
          {/* <th className="text-center">Due Date</th> */}
          <th>Created At</th>
          <th></th>
        </tr>
      </thead>
    </table>
  );
};

export default Index;
