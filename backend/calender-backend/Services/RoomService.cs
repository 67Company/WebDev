public class RoomService : IRoomService
{
    private readonly string _connectionString = "Data Source=room.db";

    public RoomService()
    {
    }

    public Task<bool> CreateRoomAsync(Room room)
    {
        throw new NotImplementedException();
    }

    public Task<bool> DeleteRoomAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Room>> GetAllRoomsAsync()
    {
        throw new NotImplementedException();
    }

    public Task<Room> GetRoomByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<Room> GetRoomByNameAsync(string name)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Room>> GetRoomsByCapacityAsync(int capacity)
    {
        throw new NotImplementedException();
    }

    public Task<bool> UpdateRoomAsync(int id, Room room)
    {
        throw new NotImplementedException();
    }
}