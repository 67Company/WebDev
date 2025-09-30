using calender_backend.Models;

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

    public Task<IEnumerable<RoomDTO>> GetAllRoomsAsync(int companyId)
    {
        throw new NotImplementedException();
    }

    public Task<RoomDTO?> GetRoomByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<RoomDTO?> GetRoomByNameAsync(string name, int companyId)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<RoomDTO>> GetRoomsByCapacityAsync(int capacity, int companyId)
    {
        throw new NotImplementedException();
    }

    public Task<bool> UpdateRoomAsync(int id, Room room)
    {
        throw new NotImplementedException();
    }
}