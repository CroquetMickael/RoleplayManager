import React from "react";
import { useForm } from "react-hook-form";
import { ErrorForm } from "../../../../../Shared/Component/ErrorForm/ErrorForm";

const AddMonsterForm = ({ addMonster }) => {
  const { handleSubmit, register, errors } = useForm();
  const addChangePasswordCall = ({ name, initiative, isNPC }) => {
    addMonster(name, initiative, isNPC);
  };
  return (
    <form
      className="flex flex-col p-1"
      onSubmit={handleSubmit(addChangePasswordCall)}
    >
      <label htmlFor="name" className="font-bold text-black dark:text-white">
        Monster name
      </label>
      <input
        name="name"
        className="p-2 mb-1 text-black placeholder-black border border-black rounded-lg"
        placeholder="Monster name"
        ref={register({
          required: { message: "name is required", value: true },
        })}
      />
      {errors.name && <ErrorForm>{errors.name.message}</ErrorForm>}
      <label htmlFor="name" className="font-bold text-black dark:text-white">
        Monster initiative
      </label>
      <input
        name="initiative"
        className="p-2 mb-1 text-black placeholder-black border border-black rounded-lg"
        placeholder="Monster initiative"
        type="number"
        ref={register({
          required: { message: "Initiative is required", value: true },
          min: { value: 0, message: "Initiative should be at least 0" },
        })}
      />
      <label>
        <input
          name="isNPC"
          className="p-2 mb-1 text-black placeholder-black border border-black rounded-lg"
          placeholder="check if is not a monster but NPC"
          type="checkbox"
          ref={register()}
        />{" "}
        is this monster an NPC ?
      </label>
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
