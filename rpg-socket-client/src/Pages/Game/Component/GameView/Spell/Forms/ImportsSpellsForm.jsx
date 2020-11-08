import React, { useState } from "react";

const ImportsSpellsForm = ({ importSpells }) => {
  const [file, setFile] = useState("");
  
  async function importsSpellsCall() {
    let text = await file?.text();
    importSpells(text);
  }

  return (
    <div className="flex flex-col">
      <div className="relative my-2 border border-gray-500 border-dashed">
        <input
          type="file"
          className="relative z-50 block w-full h-full p-20 opacity-0 cursor-pointer"
          onChange={(event) => setFile(event.target.files[0])}
          accept=".json"
        />
        <div className="absolute top-0 left-0 right-0 p-10 m-auto text-center">
          {file !== "" ? (
            <h4>{file?.name}</h4>
          ) : (
            <>
              <h4>
                Drop files anywhere to upload
                <br />
                or
              </h4>
              <p className="">Select Files</p>
            </>
          )}
        </div>
      </div>
      <button
        className="flex items-center justify-center w-full h-8 p-2 text-white bg-blue-300 rounded hover:bg-blue-500"
        onClick={() => importsSpellsCall()}
      >
        Imports spells
      </button>
    </div>
  );
};

export { ImportsSpellsForm };
