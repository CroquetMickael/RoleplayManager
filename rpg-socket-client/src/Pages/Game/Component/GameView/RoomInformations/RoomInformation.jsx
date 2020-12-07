import React, { useEffect, useRef } from "react";
import { FaPen } from "react-icons/fa";
import { Card } from "../../../../../Shared/Component/Card/Card";
import { AddMonsterForm } from "./AddMonsterForm";

const RoomInformation = ({
  roomName,
  isOwner,
  password,
  changePassword,
  addMonster,
  logs,
}) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef?.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [logs]);

  return (
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
      <div className="relative mx-2 md:block dark:text-white">
        <p className="py-2 text-2xl text-black dark:text-gray-200">Logs</p>
        <div className="hidden w-full p-2 overflow-y-auto text-black border md:block max-h-96 h-96 dark:bg-gray-800 dark:text-white">
          {logs?.map((log) => (
            <p className="inline-block w-full text-black dark:text-white">
              {Intl.DateTimeFormat("en-GB", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: false,
              }).format(new Date(log.created_at))}
              : {log.log}
            </p>
          ))}
          <div ref={messagesEndRef} />
        </div>
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
};

export { RoomInformation };
