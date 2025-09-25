public interface IRoomService
{
    Task<IEnumerable<RoomDTO>> GetAllRoomsAsync(int companyId);
    Task<RoomDTO?> GetRoomByIdAsync(int id);
    Task<bool> CreateRoomAsync(Room room);
    Task<bool> UpdateRoomAsync(int id, Room room);
    Task<bool> DeleteRoomAsync(int id);
    Task<RoomDTO?> GetRoomByNameAsync(string name, int companyId);
    Task<IEnumerable<RoomDTO>> GetRoomsByCapacityAsync(int capacity, int companyId);
}