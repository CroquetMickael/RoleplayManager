import React from "react";

import socketIOClient from "socket.io-client";
import { MemoryRouter } from "react-router";
import { SocketContext } from "../../Shared/Context/SocketContext";
import { UserProvider } from "../../Shared/Context/UserContext";
import { Lobby } from "./Lobby";

import { act, fireEvent, render, screen } from "@testing-library/react";
import MockedSocket from "socket.io-mock";

jest.mock("socket.io-client");

const mockedNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockedNavigate,
}));
const lobbyMockData = [
  {
    id: 1,
    created_at: "2020-12-05T18:31:12.240+01:00",
    updated_at: "2020-12-05T19:28:30.702+01:00",
    name: "test",
    maxPlayer: 2,
    owner_id: 1,
    isOwnerConnected: true,
    password: "toto2",
    lastUsedDate: "2020-12-05",
    players: [
      {
        id: 2,
        created_at: "2020-12-05T18:32:55.048+01:00",
        updated_at: "2020-12-05T18:32:55.048+01:00",
        name: "Haze22",
        initiative: 150,
        isConnected: true,
      },
      {
        id: 3,
        created_at: "2020-12-05T18:46:12.130+01:00",
        updated_at: "2020-12-05T18:46:12.130+01:00",
        name: "Haze23",
        initiative: 250,
        isConnected: true,
      },
    ],
  },
];
describe("Testing lobby", () => {
  let socket;

  beforeEach(() => {
    socket = new MockedSocket();
    socketIOClient.mockReturnValue(socket);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should received a list of rooms that is full", () => {
    render(
      <MemoryRouter>
        <SocketContext.Provider value={{ socket: socket }}>
          <UserProvider>
            <Lobby />
          </UserProvider>
        </SocketContext.Provider>
      </MemoryRouter>
    );
    act(() =>
      socket.socketClient.emit("updateLobbyInformation", lobbyMockData)
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("test");
    expect(screen.getByRole("button", { name: /room is full/i })).toBeDefined();
  });

  it("should show a modal to change userName", () => {
    render(
      <MemoryRouter>
        <SocketContext.Provider value={{ socket: socket }}>
          <UserProvider>
            <Lobby />
          </UserProvider>
        </SocketContext.Provider>
      </MemoryRouter>
    );
    screen.getByText("Modify player name").click();
    expect(screen.getByText("Modify your player Name")).toBeDefined();
  });

  it("should show a modal to create a room", () => {
    render(
      <MemoryRouter>
        <SocketContext.Provider value={{ socket: socket }}>
          <UserProvider>
            <Lobby />
          </UserProvider>
        </SocketContext.Provider>
      </MemoryRouter>
    );
    screen.getByText("Create a room").click();
    expect(
      screen.getByPlaceholderText(/number max of player for room/i)
    ).toBeDefined();
  });

  it("Should redirect user when he create a room", async () => {
    render(
      <MemoryRouter>
        <SocketContext.Provider value={{ socket: socket }}>
          <UserProvider>
            <Lobby />
          </UserProvider>
        </SocketContext.Provider>
      </MemoryRouter>
    );
    screen.getByText("Create a room").click();
    const numberPlayerInput = screen.getByPlaceholderText(
      /number max of player for room/i
    );
    const nameOfTheRoomInput = screen.getByPlaceholderText(/name of the room/i);

    fireEvent.change(nameOfTheRoomInput, { target: { value: "test" } });
    fireEvent.change(numberPlayerInput, { target: { value: 2 } });
    screen.getByRole("button", { name: /create room/i }).click();
    await act(async () => {
      socket.socketClient.emit("roomCreated");
    });
    socket.on("roomCreated", () => {
      expect(mockedNavigate).toHaveBeenCalledTimes(1);
    });
  });

  it("Should redirect user when he join a room", async () => {
    render(
      <MemoryRouter>
        <SocketContext.Provider value={{ socket: socket }}>
          <UserProvider>
            <Lobby />
          </UserProvider>
        </SocketContext.Provider>
      </MemoryRouter>
    );
    lobbyMockData[0].isOwnerConnected = false;
    act(() =>
      socket.socketClient.emit("updateLobbyInformation", lobbyMockData)
    );
    screen.getByText("Join game").click();
    expect(screen.getByText(/joining : test/i)).toBeDefined();

    const passwordRoomInput = screen.getByPlaceholderText(
      /password of the room/i
    );

    fireEvent.change(passwordRoomInput, { target: { value: "toto" } });
    screen.getByRole("button", { name: /join the room/i }).click();
    await act(async () => {
      socket.socketClient.emit("roomJoined");
    });
    socket.on("roomJoined", () => {
      expect(mockedNavigate).toHaveBeenCalledTimes(1);
    });
  });
});
