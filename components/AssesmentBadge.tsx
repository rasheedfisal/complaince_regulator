import React from "react";
type CompProps = {
  status: string | null;
};
const AssesmentBadge = ({ status }: CompProps) => {
  if (status === "Pending") {
    return (
      <span className="bg-blue-200 text-blue-600 py-1 px-3 rounded-full text-xs">
        {status}
      </span>
    );
  } else if (status === "Under Review") {
    return (
      <span className="bg-yellow-200 text-yellow-600 py-1 px-3 rounded-full text-xs">
        {status}
      </span>
    );
  } else if (status === "Finished") {
    return (
      <span className="bg-green-200 text-green-600 py-1 px-3 rounded-full text-xs">
        {status}
      </span>
    );
  } else if (status === "Rejected") {
    return (
      <span className="bg-red-200 text-red-600 py-1 px-3 rounded-full text-xs">
        {status}
      </span>
    );
  } else {
    return (
      <span className="bg-gray-200 text-gray-600 py-1 px-3 rounded-full text-xs">
        N/A
      </span>
    );
  }
};

export default AssesmentBadge;
