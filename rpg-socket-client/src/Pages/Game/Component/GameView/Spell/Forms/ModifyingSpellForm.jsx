import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorForm } from "../../../../../../Shared/Component/ErrorForm/ErrorForm";

const ModifyingSpellForm = ({ modifySpell, spell }) => {
  const { handleSubmit, register, errors } = useForm();
  const [localSpellName, setLocalSpellName] = useState(spell.name);
  const [localSpellCooldown, setLocalSpellCooldown] = useState(
    spell.defaultCooldown
  );
  const [localSpellCurrentCooldown, setLocalSpellCurrentCooldown] = useState(
    spell.currentCooldown
  );
  const [localDescription, setLocalDescription] = useState(spell.description);

  const ModifySpellCall = ({
    spellName,
    spellCooldown,
    spellCurrentCooldown,
    spellDescription,
  }) => {
    modifySpell(
      spellName,
      spellCooldown,
      spellCurrentCooldown,
      spellDescription
    );
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(ModifySpellCall)}>
      <label htmlFor="spellName" className="font-bold">
        Spell name
      </label>
      <input
        name="spellName"
        className="p-2 mb-1 border border-black"
        placeholder="Spell Name"
        value={localSpellName}
        onChange={(e) => setLocalSpellName(e.target.value)}
        ref={register({
          required: { message: "Spell Name is required", value: true },
        })}
      />
      {errors.spellName && <ErrorForm>{errors.spellName.message}</ErrorForm>}
      <label htmlFor="spellCooldown" className="font-bold">
        Spell default cooldown
      </label>
      <input
        name="spellCooldown"
        className="p-2 mb-1 border border-black"
        placeholder="Spell Cooldown"
        type="number"
        value={localSpellCooldown}
        onChange={(e) => setLocalSpellCooldown(e.target.value)}
        ref={register({
          required: { message: "Spell Cooldown is required", value: true },
          min: { message: "You need at least 1 round of cooldown", value: 1 },
        })}
      />
      {errors.spellCooldown && (
        <ErrorForm>{errors.spellCooldown.message}</ErrorForm>
      )}
      <label htmlFor="spellCurrentCooldown" className="font-bold">
        Spell current cooldown
      </label>
      <input
        name="spellCurrentCooldown"
        className="p-2 mb-1 border border-black"
        placeholder="Spell Cooldown"
        type="number"
        value={localSpellCurrentCooldown}
        onChange={(e) => setLocalSpellCurrentCooldown(e.target.value)}
        ref={register({
          required: { message: "Spell Cooldown is required", value: true },
        })}
      />
      {errors.spellCurrentCooldown && (
        <ErrorForm>{errors.spellCurrentCooldown.message}</ErrorForm>
      )}
      <label htmlFor="spellDescription" className="font-bold">
        Spell description
      </label>
      <textarea
        name="spellDescription"
        className="p-2 mb-1 border border-black"
        placeholder="Spell Description"
        value={localDescription}
        onChange={(e) => setLocalDescription(e.target.value)}
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
        Modify spell
      </button>
    </form>
  );
};

export { ModifyingSpellForm };
