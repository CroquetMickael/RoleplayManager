import React from "react";

import socketIOClient from "socket.io-client";
import { MemoryRouter } from "react-router";
import { SocketContext } from "../../../../Shared/Context/SocketContext";
import { UserContext } from "../../../../Shared/Context/UserContext";
import { Game } from "../../Game";

import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import MockedSocket from "socket.io-mock";

jest.mock("socket.io-client");

const mockedNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockedNavigate,
}));

Element.prototype.scrollIntoView = jest.fn();

const gameMockData = {
  id: 1,
  created_at: "2020-12-05T18:31:12.240+01:00",
  updated_at: "2020-12-07T18:10:44.730+01:00",
  name: "gameName",
  maxPlayer: 2,
  owner_id: 1,
  isOwnerConnected: true,
  password: "toto2",
  lastUsedDate: "2020-12-07",
  logs: [],
  monsters: [
    {
      id: 1,
      created_at: "2020-12-05T19:27:57.087+01:00",
      updated_at: "2020-12-05T19:28:00.428+01:00",
      name: "testMonster",
      initiative: 300,
      roomId: 1,
      spells: [
        {
          id: 3,
          created_at: "2020-12-05T19:28:12.933+01:00",
          updated_at: "2020-12-05T19:28:30.702+01:00",
          name: "test",
          defaultCooldown: 2,
          currentCooldown: 0,
          description: "test",
          player_id: null,
          monster_id: 1,
          room_id: 1,
        },
      ],
    },
  ],
  players: [
    {
      id: 2,
      created_at: "2020-12-05T18:32:55.048+01:00",
      updated_at: "2020-12-05T18:32:55.048+01:00",
      name: "Haze22",
      spells: [
        {
          id: 1,
          created_at: "2020-12-05T18:49:22.855+01:00",
          updated_at: "2020-12-05T18:49:22.855+01:00",
          name: "test",
          defaultCooldown: 2,
          currentCooldown: 0,
          description: "test",
          player_id: 2,
          monster_id: null,
          room_id: 1,
        },
      ],
      initiative: 150,
      isConnected: true,
    },
    {
      id: 3,
      created_at: "2020-12-05T18:46:12.130+01:00",
      updated_at: "2020-12-05T18:46:12.130+01:00",
      name: "Haze23",
      spells: [
        {
          id: 2,
          created_at: "2020-12-05T18:49:26.322+01:00",
          updated_at: "2020-12-05T19:05:15.693+01:00",
          name: "test",
          defaultCooldown: 2,
          currentCooldown: 0,
          description: "test",
          player_id: 3,
          monster_id: null,
          room_id: 1,
        },
      ],
      initiative: 250,
      isConnected: true,
    },
  ],
};

describe("Testing Initiative", () => {
  let socket;

  beforeEach(() => {
    socket = new MockedSocket();
    socketIOClient.mockReturnValue(socket);
    jest.spyOn(socket, "emit");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("Should permit to modify initiative", async () => {
    render(
      <MemoryRouter>
        <SocketContext.Provider value={{ socket: socket }}>
          <UserContext.Provider value={{ playerName: "Haze", playerId: 1 }}>
            <Game />
          </UserContext.Provider>
        </SocketContext.Provider>
      </MemoryRouter>
    );
    act(() => socket.socketClient.emit("updateGameInformation", gameMockData));
    let modifyButtons = screen.getAllByRole("button", {
      name: /modify initiative/i,
    });
    modifyButtons[1].click();

    await waitFor(() =>
      expect(screen.getByText(/modifying initiative of Haze23/i)).toBeDefined()
    );
    const inputInitiativeToModify = screen.getByPlaceholderText(
      /Initiative to modify/i
    );
    act(() => {
      fireEvent.change(inputInitiativeToModify, { target: { value: "125" } });
      screen
        .getByRole("button", { name: /modify initiative of haze23/i })
        .click();
    });

    gameMockData.players = [
      {
        id: 2,
        created_at: "2020-12-05T18:32:55.048+01:00",
        updated_at: "2020-12-05T18:32:55.048+01:00",
        name: "Haze22",
        spells: [
          {
            id: 1,
            created_at: "2020-12-05T18:49:22.855+01:00",
            updated_at: "2020-12-05T18:49:22.855+01:00",
            name: "test",
            defaultCooldown: 2,
            currentCooldown: 0,
            description: "test",
            player_id: 2,
            monster_id: null,
            room_id: 1,
          },
        ],
        initiative: 150,
        isConnected: true,
      },
      {
        id: 3,
        created_at: "2020-12-05T18:46:12.130+01:00",
        updated_at: "2020-12-05T18:46:12.130+01:00",
        name: "Haze23",
        spells: [
          {
            id: 2,
            created_at: "2020-12-05T18:49:26.322+01:00",
            updated_at: "2020-12-05T19:05:15.693+01:00",
            name: "test",
            defaultCooldown: 2,
            currentCooldown: 0,
            description: "test",
            player_id: 3,
            monster_id: null,
            room_id: 1,
          },
        ],
        initiative: 125,
        isConnected: true,
      },
    ];
    act(() => socket.socketClient.emit("updateGameInformation", gameMockData));
    expect(screen.getByText(/125/i)).toBeDefined();
    act(() => {
      modifyButtons = screen.getAllByRole("button", {
        name: /modify initiative/i,
      });
      modifyButtons[2].click();
    });
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /modify initiative of haze23/i })
      ).toBeDefined()
    );
  });
});
