import Room from 'App/Models/Room'

const ExcedMaxPlayer = (room: Room) => {
  if (room?.players?.length + 1 > room.maxPlayer) {
    return true
  }
  return false
}
const generateRoomPassword = () => Math.random().toString(36).slice(-8)

export { generateRoomPassword, ExcedMaxPlayer }

