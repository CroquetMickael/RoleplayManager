import React from "react";
import { useForm } from "react-hook-form";
import { ErrorForm } from "../../../Shared/Component/ErrorForm/ErrorForm";
const CreateRoomForm = ({ createRoom }) => {
  const { handleSubmit, register, errors } = useForm();

  const onSubmit = ({ roomName, maxPlayer }) => {
    createRoom(roomName, maxPlayer);
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <input
        name="maxPlayer"
        className="p-2 mb-1 border border-black"
        placeholder="Number max of player for room"
        type="number"
        ref={register({
          required: { message: "Max player value is required", value: true },
          min: { message: "You need 2 players at least", value: 2 },
        })}
      ></input>
      {errors.maxPlayer && <ErrorForm>{errors.maxPlayer.message}</ErrorForm>}
      <input
        name="roomName"
        className="p-2 mb-1 border border-black"
        placeholder="Name of the room"
        ref={register({
          required: { message: "A Room name is required", value: true },
        })}
      ></input>
      {errors.roomName && <ErrorForm>{errors.roomName.message}</ErrorForm>}
      <button className="flex items-center justify-center w-full h-8 p-2 text-white bg-blue-300 rounded hover:bg-blue-500">
        Create room
      </button>
    </form>
  );
};

export { CreateRoomForm };
