using calender_backend.Data;
using calender_backend.Models;

public class RoomService : IRoomService
{
    private readonly CalenderContext _context;

    public RoomService(CalenderContext context)
    {
        _context = context;
    }

    public async Task<bool> CreateRoomAsync(Room room)
    {
        bool isCreated = await _context.Rooms.AddAsync(room) != null;
        _context.SaveChanges();
        return isCreated;
    }

    public async Task<bool> DeleteRoomAsync(int id)
    {
        bool isDeleted = false;
        Room? room = await _context.Rooms.FindAsync(id);
        if (room != null)
        {
            _context.Rooms.Remove(room);
            isDeleted = true;
            _context.SaveChanges();
        }
        return isDeleted;
    }

    public async Task<IEnumerable<RoomDTO>> GetAllRoomsAsync(int companyId)
    {
        return _context.Rooms
            .Where(r => r.CompanyId == companyId)
            .Select(r => new RoomDTO
            {
                Id = r.Id,
                Name = r.Name,
                Capacity = r.Capacity,
            })
            .ToList();
    }

    public async Task<RoomDTO?> GetRoomByIdAsync(int id)
    {
       return _context.Rooms
            .Where(r => r.Id == id)
            .Select(r => new RoomDTO
            {
                Id = r.Id,
                Name = r.Name,
                Capacity = r.Capacity,
            })
            .FirstOrDefault();
    }

    public async Task<RoomDTO?> GetRoomByNameAsync(string name, int companyId)
    {
        return _context.Rooms
            .Where(r => r.Name == name && r.CompanyId == companyId)
            .Select(r => new RoomDTO
            {
                Id = r.Id,
                Name = r.Name,
                Capacity = r.Capacity,
            })
            .FirstOrDefault();
    }

    public async Task<IEnumerable<RoomDTO>> GetRoomsByCapacityAsync(int capacity, int companyId)
    {
        return _context.Rooms
            .Where(r => r.Capacity >= capacity && r.CompanyId == companyId)
            .Select(r => new RoomDTO
            {
                Id = r.Id,
                Name = r.Name,
                Capacity = r.Capacity,
            })
            .ToList();
    }

    public async Task<bool> UpdateRoomAsync(int id, Room room)
    {
        bool isUpdated = _context.Rooms.Update(room) != null;
        _context.SaveChanges();
        return isUpdated;
    }
}