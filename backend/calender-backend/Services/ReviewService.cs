using calender_backend.Data;
using calender_backend.Models;
using Microsoft.EntityFrameworkCore;

public class ReviewService : IReviewService
{
    private readonly CalenderContext _context;

    public ReviewService(CalenderContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ReviewWithEmployeeDTO>> GetEventReviewsAsync(int eventId)
    {
        return await _context.Reviews
            .Where(r => r.EventId == eventId)
            .Include(r => r.Employee)
            .Select(r => new ReviewWithEmployeeDTO
            {
                Id = r.Id,
                EventId = r.EventId,
                EmployeeId = r.EmployeeId,
                EmployeeEmail = r.Employee!.Email,
                Content = r.Content,
                Rating = r.Rating,
                CreatedAt = r.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<ReviewWithEmployeeDTO?> GetReviewByIdAsync(int id)
    {
        var review = await _context.Reviews
            .Include(r => r.Employee)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (review == null)
            return null;

        return new ReviewWithEmployeeDTO
        {
            Id = review.Id,
            EventId = review.EventId,
            EmployeeId = review.EmployeeId,
            EmployeeEmail = review.Employee!.Email,
            Content = review.Content,
            Rating = review.Rating,
            CreatedAt = review.CreatedAt
        };
    }

    public async Task<bool> CreateReviewAsync(Review review)
    {
        review.CreatedAt = DateTime.UtcNow;
        bool isCreated = await _context.Reviews.AddAsync(review) != null;
        await _context.SaveChangesAsync();
        return isCreated;
    }

    public async Task<bool> UpdateReviewAsync(int id, Review updatedReview)
    {
        var existingReview = await _context.Reviews.FindAsync(id);
        if (existingReview == null)
            return false;

        existingReview.Content = updatedReview.Content;
        existingReview.Rating = updatedReview.Rating;

        _context.Reviews.Update(existingReview);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteReviewAsync(int id)
    {
        var review = await _context.Reviews.FindAsync(id);
        if (review == null)
            return false;

        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();
        return true;
    }
}
