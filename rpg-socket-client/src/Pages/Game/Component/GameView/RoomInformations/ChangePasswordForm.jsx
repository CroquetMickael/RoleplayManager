import React from "react";
import { useForm } from "react-hook-form";
import { ErrorForm } from "../../../../../Shared/Component/ErrorForm/ErrorForm";

const ChangePasswordForm = ({ changePassword }) => {
  const { handleSubmit, register, errors } = useForm();

  const addChangePasswordCall = ({ password }) => {
    changePassword(password);
  };
  return (
    <form
      className="flex flex-col"
      onSubmit={handleSubmit(addChangePasswordCall)}
    >
      <label htmlFor="password" className="font-bold">
        Password
      </label>
      <input
        name="password"
        className="p-2 mb-1 border border-black"
        placeholder="Password"
        ref={register({
          required: { message: "password is required", value: true },
        })}
      />
      {errors.password && <ErrorForm>{errors.password.message}</ErrorForm>}
      <button
        className="flex items-center justify-center w-full h-8 p-2 text-white bg-blue-300 rounded hover:bg-blue-500"
        type="submit"
      >
        Change Password
      </button>
    </form>
  );
};

export { ChangePasswordForm };
