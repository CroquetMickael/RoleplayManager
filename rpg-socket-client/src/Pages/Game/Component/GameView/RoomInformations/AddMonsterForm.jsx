import React from "react";
import { useForm } from "react-hook-form";
import { ErrorForm } from "../../../../../Shared/Component/ErrorForm/ErrorForm";

const AddMonsterForm = ({ addMonster }) => {
  const { handleSubmit, register, errors } = useForm();

  const addChangePasswordCall = ({ name, initiative }) => {
    addMonster(name, initiative);
  };
  return (
    <form
      className="flex flex-col"
      onSubmit={handleSubmit(addChangePasswordCall)}
    >
      <label htmlFor="name" className="font-bold">
        Monster name
      </label>
      <input
        name="name"
        className="p-2 mb-1 border border-black"
        placeholder="Monster name"
        ref={register({
          required: { message: "name is required", value: true },
        })}
      />
      {errors.name && <ErrorForm>{errors.name.message}</ErrorForm>}
      <label htmlFor="name" className="font-bold">
        Monster initiative
      </label>
      <input
        name="initiative"
        className="p-2 mb-1 border border-black"
        placeholder="Monster initiative"
        type="number"
        ref={register({
          required: { message: "Initiative is required", value: true },
          min: {value: 0, message: "Initiative should be at least 0"}
        })}
      />    
      {errors.initiative && <ErrorForm>{errors.initiative.message}</ErrorForm>}
      <button
        className="flex items-center justify-center w-full h-8 p-2 text-white bg-blue-300 rounded hover:bg-blue-500"
        type="submit"
      >
        Add monster
      </button>
    </form>
  );
};

export { AddMonsterForm };
