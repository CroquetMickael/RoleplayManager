import React from "react";
import { useForm } from "react-hook-form";
import { ErrorForm } from "../../../../../../Shared/Component/ErrorForm/ErrorForm";

const SpellForm = ({ addSpell }) => {
  const { handleSubmit, register, errors } = useForm();

  const addSpellCall = ({ spellName, spellCooldown, spellDescription }) => {
    addSpell(spellName, spellCooldown, spellDescription);
  };
  return (
    <form className="flex flex-col" onSubmit={handleSubmit(addSpellCall)}>
      <input
        name="spellName"
        className="p-2 mb-1 border border-black"
        placeholder="Spell Name"
        ref={register({
          required: { message: "Spell Name is required", value: true },
        })}
      />
      {errors.spellName && <ErrorForm>{errors.spellName.message}</ErrorForm>}
      <input
        name="spellCooldown"
        className="p-2 mb-1 border border-black"
        placeholder="Spell Cooldown"
        type="number"
        ref={register({
          required: { message: "Spell Cooldown is required", value: true },
          min: { message: "You need at least 1 round of cooldown", value: 1 },
        })}
      />
      {errors.spellCooldown && (
        <ErrorForm>{errors.spellCooldown.message}</ErrorForm>
      )}
      <textarea
        name="spellDescription"
        className="p-2 mb-1 border border-black"
        placeholder="Spell Description"
        ref={register({
          required: { message: "Spell Description is required", value: true },
        })}
      />
      {errors.spellDescription && (
        <ErrorForm>{errors.spellDescription.message}</ErrorForm>
      )}
      <button
        className="flex items-center justify-center w-full h-8 p-2 text-white bg-blue-300 rounded hover:bg-blue-500"
        type="submit"
      >
        Add a spell
      </button>
    </form>
  );
};

export { SpellForm };
