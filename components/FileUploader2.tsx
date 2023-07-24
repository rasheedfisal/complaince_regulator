import React, { useCallback, useState } from "react";
import { Controller, useController, useFormContext } from "react-hook-form";

type FileUpLoaderProps = {
  name: string;
  label: string;
};

const FileUploader2: React.FC<FileUpLoaderProps> = ({ name, label }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { field } = useController({ name, control });

  const onFileDrop = useCallback(
    (e: React.SyntheticEvent<EventTarget>) => {
      const target = e.target as HTMLInputElement;
      if (!target.files) return;
      const newFile = Object.values(target.files).map((file: File) => file);
      field.onChange(newFile[0]);
    },

    [field]
  );

  return (
    <Controller
      name={name}
      defaultValue=""
      control={control}
      render={({ field: { name, onBlur, ref } }) => (
        <div className="flex flex-col w-full">
          <label>{label}</label>
          <label className="block">
            <span className="sr-only">Choose File</span>
            <input
              type="file"
              name={name}
              onBlur={onBlur}
              ref={ref}
              onChange={onFileDrop}
              className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary file:text-white
                        hover:file:bg-primary-dark"
            />
          </label>
          {errors[name] && (
            <div className="mb-3 text-normal text-red-500">
              {errors[name]?.message?.toString()}
            </div>
          )}
        </div>
      )}
    />
  );
};

export default FileUploader2;
