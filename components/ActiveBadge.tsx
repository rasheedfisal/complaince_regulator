import React from "react";
type CmpProps = {
  isActive: string | undefined;
};
const ActiveBadge = ({ isActive }: CmpProps) => {
  const Badge =
    isActive === "1" ? (
      <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
        Active
      </span>
    ) : (
      <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
        Banned
      </span>
    );
  return Badge;
};

export default ActiveBadge;
