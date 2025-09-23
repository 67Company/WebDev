public interface IRoomService
{
    Task<IEnumerable<Room>> GetAllRoomsAsync();
    Task<Room> GetRoomByIdAsync(int id);
    Task<bool> CreateRoomAsync(Room room);
    Task<bool> UpdateRoomAsync(int id, Room room);
    Task<bool> DeleteRoomAsync(int id);
    Task<Room> GetRoomByNameAsync(string name);
    Task<IEnumerable<Room>> GetRoomsByCapacityAsync(int capacity);
}