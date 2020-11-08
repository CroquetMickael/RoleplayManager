import React from "react";
import { useForm } from "react-hook-form";
import { ErrorForm } from "../../../Shared/Component/ErrorForm/ErrorForm";

const JoinRoom = ({ joinRoom, roomName }) => {
  const { handleSubmit, register, errors } = useForm();

  const onSubmit = ({ roomPassword }) => {
    joinRoom(roomName, roomPassword);
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <input
        name="roomPassword"
        className="p-2 mb-1 border border-black"
        placeholder="Password of the room"
        ref={register({
          required: { message: "A password is required", value: true },
        })}
      ></input>
      {errors.roomPassword && (
        <ErrorForm>{errors.roomPassword.message}</ErrorForm>
      )}
      <button className="flex items-center justify-center w-full h-8 p-2 text-white bg-blue-300 rounded hover:bg-blue-500">
        Join the room
      </button>
    </form>
  );
};

export { JoinRoom };
