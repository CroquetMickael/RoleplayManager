import React from "react";

import socketIOClient from "socket.io-client";
import { MemoryRouter } from "react-router";
import { SocketContext } from "../../Shared/Context/SocketContext";
import { UserContext, UserProvider } from "../../Shared/Context/UserContext";
import { Game } from "./Game";

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

describe("Testing GameInformations", () => {
  let socket;

  beforeEach(() => {
    socket = new MockedSocket();
    socketIOClient.mockReturnValue(socket);
    jest.spyOn(socket, "emit");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("Should show the password of the room", () => {
    render(
      <MemoryRouter>
        <SocketContext.Provider value={{ socket: socket }}>
          <UserProvider>
            <Game />
          </UserProvider>
        </SocketContext.Provider>
      </MemoryRouter>
    );
    act(() => socket.socketClient.emit("updateGameInformation", gameMockData));
    expect(screen.getByText(/password: toto2/i)).toBeDefined();
  });

  it("Should add a log when the GM end the room", () => {
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
    const endOfRoundButton = screen.getByRole("button", {
      name: /end of round/i,
    });
    endOfRoundButton.click();
    act(() => {
      gameMockData.logs.push({
        id: 49,
        created_at: "2020-12-07T19:04:21.116+01:00",
        updated_at: "2020-12-07T19:04:21.116+01:00",
        log: "GM has ended the round",
        roomId: 1,
      });
      socket.socketClient.emit("updateGameInformation", gameMockData);
    });
    expect(screen.getByText(/gm has ended the round/i)).toBeDefined();
  });

  it("Should delete a monster to the room", () => {
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
    const showDeleteMonsterModalButton = screen.getByRole("button", {
      name: /delete monster/i,
    });
    showDeleteMonsterModalButton.click();
    const deleteMonsterButton = screen.getByRole("button", {
      name: /confirm !/i,
    });
    deleteMonsterButton.click();
    act(() => {
      gameMockData.monsters.splice(0, 1);
      socket.socketClient.emit("updateGameInformation", gameMockData);
    });
    // This is from the modal, if it's exced 1, this code not work anymore
    expect(screen.getAllByText(/testMonster/i).length).toBe(1);
  });

  it("Should add a monster to the room", async () => {
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
    const monsterNameInput = screen.getByPlaceholderText(/monster name/i);
    const monsterIntiativeInput = screen.getByPlaceholderText(
      /monster initiative/i
    );
    fireEvent.change(monsterNameInput, { target: { value: "monsterName" } });
    fireEvent.change(monsterIntiativeInput, { target: { value: "50" } });
    screen.getByRole("button", { name: /add monster/i }).click();
    act(() => {
      gameMockData.monsters.push({
        id: 1,
        initiative: 50,
        name: "monsterName",
        spells: [],
        roomId: 1,
      });
      socket.socketClient.emit("updateGameInformation", gameMockData);
    });
    await waitFor(() => {
      expect(screen.getAllByText(/monsterName/i).length).toBe(2);
    });
  });
});
