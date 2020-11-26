import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorForm } from "../../../../../Shared/Component/ErrorForm/ErrorForm";

const ModifyInitiativeForm = ({ modifyInitiative, initialInitiative }) => {
  const { handleSubmit, register, errors } = useForm();
  const [localInitiative, setLocalInitiative] = useState(
    initialInitiative
  );

  const addChangePasswordCall = ({ initiative }) => {
    modifyInitiative(initiative);
  };
  return (
    <form
      className="flex flex-col"
      onSubmit={handleSubmit(addChangePasswordCall)}
    >
      <label htmlFor="name" className="font-bold">
        Initiative
      </label>
      <input
        name="initiative"
        className="p-2 mb-1 border border-black"
        placeholder="Initiative to Modify"
        type="number"
        onChange={(e) => setLocalInitiative(e.target.value)}
        value={localInitiative}
        ref={register({
          required: { message: "Initiative is required", value: true },
          min: { value: 0, message: "Initiative should be at least 0" },
        })}
      />
      {errors.initiative && <ErrorForm>{errors.initiative.message}</ErrorForm>}
      <button
        className="flex items-center justify-center w-full h-8 p-2 text-white bg-blue-300 rounded hover:bg-blue-500"
        type="submit"
      >
        Modify Initiative
      </button>
    </form>
  );
};

export { ModifyInitiativeForm };
