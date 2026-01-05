using Microsoft.AspNetCore.Mvc;
using calender_backend.Models;
using calender_backend.Data;

namespace calender_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewController : ControllerBase
{
    private readonly ReviewService _reviewService;

    public ReviewController(CalenderContext context)
    {
        _reviewService = new ReviewService(context);
    }

    [HttpGet("event/{eventId}")]
    public async Task<ActionResult<IEnumerable<ReviewWithEmployeeDTO>>> GetEventReviews(int eventId)
    {
        var reviews = await _reviewService.GetEventReviewsAsync(eventId);
        return Ok(reviews);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ReviewWithEmployeeDTO>> GetById(int id)
    {
        var review = await _reviewService.GetReviewByIdAsync(id);
        if (review == null)
            return NotFound();
        return Ok(review);
    }

    [HttpPost]
    public async Task<ActionResult<ReviewWithEmployeeDTO>> Create([FromBody] ReviewDTO reviewDto)
    {
        if (reviewDto.Rating < 1 || reviewDto.Rating > 5)
            return BadRequest("Rating must be between 1 and 5");

        var review = new Review
        {
            EventId = reviewDto.EventId,
            EmployeeId = reviewDto.EmployeeId,
            Content = reviewDto.Content,
            Rating = reviewDto.Rating
        };

        var result = await _reviewService.CreateReviewAsync(review);
        if (!result)
            return BadRequest();

        var createdReview = await _reviewService.GetReviewByIdAsync(review.Id);
        return CreatedAtAction(nameof(GetById), new { id = review.Id }, createdReview);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(int id, [FromBody] ReviewDTO reviewDto)
    {
        if (reviewDto.Rating < 1 || reviewDto.Rating > 5)
            return BadRequest("Rating must be between 1 and 5");

        var review = new Review
        {
            EventId = reviewDto.EventId,
            EmployeeId = reviewDto.EmployeeId,
            Content = reviewDto.Content,
            Rating = reviewDto.Rating
        };

        var result = await _reviewService.UpdateReviewAsync(id, review);
        if (!result)
            return NotFound();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var result = await _reviewService.DeleteReviewAsync(id);
        if (!result)
            return NotFound();
        return NoContent();
    }
}
