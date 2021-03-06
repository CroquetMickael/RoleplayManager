import React, { memo } from "react";
import { FaPen, FaTimes } from "react-icons/fa";
import { Card } from "../../../../Shared/Component/Card/Card";
import { Tooltip } from "../../../../Shared/Component/Tooltip/Tooltip";

const Initiative = memo(
  ({ isOwner, initiative, deleteMonster, modifyInitiative }) => {
    return (
      <>
        <h3 className="ml-4 text-2xl text-black md:text-3xl dark:text-white">
          Initiative
        </h3>
        <div className="mx-4 my-2 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:text-white">
          <div className="grid grid-cols-3 gap-4 mx-2 md:grid-cols-6">
            {initiative.map((initiative, index) => (
              <Card
                key={`${initiative.name}${index}`}
                isVertical={true}
                leftSidetext={
                  <p
                    className={`${
                      initiative.isMonster ? "text-red-600" : initiative.isNPC ? "text-gray-600" : "text-green-600"
                    }`}
                  >
                    {initiative.name}
                  </p>
                }
                rightSideText={
                  <span className="text-black dark:text-white">
                    {initiative.initiative}
                  </span>
                }
              >
                {isOwner ? (
                  <div className="flex flex-wrap">
                    <button
                      className="flex items-center justify-center p-2 m-2 text-white bg-blue-300 rounded-full hover:bg-blue-500 tooltip"
                      onClick={() =>
                        modifyInitiative(
                          initiative.isMonster,
                          initiative.id,
                          initiative.name
                        )
                      }
                    >
                      <FaPen />
                      <Tooltip text="Modify Initiative" />
                    </button>
                    {initiative.isMonster ? (
                      <button
                        className="flex items-center justify-center p-2 m-2 text-white bg-red-300 rounded-full hover:bg-red-500 tooltip"
                        onClick={() =>
                          deleteMonster(initiative.id, initiative.name)
                        }
                      >
                        <FaTimes />
                        <Tooltip text="Delete Monster" />
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </Card>
            ))}
          </div>
        </div>
      </>
    );
  }
);

export { Initiative };
