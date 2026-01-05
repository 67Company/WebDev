using calender_backend.Models;

public interface IReviewService
{
    Task<IEnumerable<ReviewWithEmployeeDTO>> GetEventReviewsAsync(int eventId);
    Task<ReviewWithEmployeeDTO?> GetReviewByIdAsync(int id);
    Task<bool> CreateReviewAsync(Review review);
    Task<bool> UpdateReviewAsync(int id, Review review);
    Task<bool> DeleteReviewAsync(int id);
}
