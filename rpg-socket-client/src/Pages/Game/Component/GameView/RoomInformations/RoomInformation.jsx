import React from "react";
import { FaPen } from "react-icons/fa";
import { Card } from "../../../../../Shared/Component/Card";
import { AddMonsterForm } from "./AddMonsterForm";

const RoomInformation = ({
  roomName,
  isOwner,
  password,
  changePassword,
  addMonster,
}) => (
  <div className="w-full border-r border-gray-400 xl:w-1/4 md:w-1/3 md:col-auto">
    <div className="w-full p-2 border-b border-gray-400">
      <div className="flex flex-col w-full text-center">
        <h1 className="text-2xl font-medium text-black dark:text-white">
          Welcome to {roomName}
        </h1>
        <h2 className="text-xl font-medium text-black dark:text-white">
          Password: {password}{" "}
          {isOwner ? (
            <button
              className="px-2 text-xl text-black dark:text-white"
              onClick={changePassword}
            >
              <FaPen className="text-black dark:text-white" />
            </button>
          ) : null}
        </h2>
      </div>
    </div>
    <div></div>
    <div className="relative hidden mx-2 md:block dark:text-white">
      <p className="py-2 text-2xl text-black dark:text-gray-200">Logs</p>
      <textarea className="w-full p-2 text-black border resize-none max-h-96 h-96 dark:bg-gray-800 dark:text-white">
        Still Work in progress
      </textarea>
      <div className="grid grid-cols-1 2xl:grid-cols-2">
        {isOwner ? (
          <Card isVertical={true} leftSidetext={"New Monster"}>
            <AddMonsterForm addMonster={addMonster} />
          </Card>
        ) : null}
      </div>
    </div>
  </div>
);

export { RoomInformation };
