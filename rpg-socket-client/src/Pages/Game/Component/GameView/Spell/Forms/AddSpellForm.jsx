import React, { useState } from "react";

const SpellForm = ({ addSpell }) => {
  const [spellName, setSpellName] = useState("");
  const [spellCooldown, setSpellCooldown] = useState("");
  const [spellDescription, setSpellDescription] = useState("");

  const addSpellCall = (spellName, spellCooldown, spellDescription) => {
    addSpell(spellName, spellCooldown, spellDescription);
    setSpellCooldown("");
    setSpellDescription("");
    setSpellName("");
  };
  return (
    <div className="flex flex-col">
      <input
        className="p-2 mb-1 border border-black"
        placeholder="Spell Name"
        value={spellName}
        onChange={(event) => setSpellName(event.target.value)}
      />
      <input
        className="p-2 mb-1 border border-black"
        placeholder="Spell Cooldown"
        value={spellCooldown}
        onChange={(event) => setSpellCooldown(event.target.value)}
      />
      <textarea
        className="p-2 mb-1 border border-black"
        placeholder="Spell Description"
        value={spellDescription}
        onChange={(event) => setSpellDescription(event.target.value)}
      />
      <button
        className="flex items-center justify-center w-full h-8 p-2 text-white bg-blue-300 rounded hover:bg-blue-500"
        onClick={() => addSpellCall(spellName, spellCooldown, spellDescription)}
      >
        Add a spell
      </button>
    </div>
  );
};

export { SpellForm };
