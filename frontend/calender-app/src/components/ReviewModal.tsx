import React, { useState } from "react";
import "../styles/Calendar.css";

interface ReviewModalProps {
  eventId: string;
  eventTitle: string;
  employeeId: number;
  onClose: () => void;
  onSubmit: (rating: number, content: string) => Promise<void>;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  eventId,
  eventTitle,
  employeeId,
  onClose,
  onSubmit
}) => {
  const [rating, setRating] = useState<number>(5);
  const [content, setContent] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (content.trim() === "") {
      setError("Please write a review");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(rating, content);
      onClose();
    } catch (err) {
      setError("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Review: {eventTitle}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="rating">Rating:</label>
            <div className="rating-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`star-button ${rating >= star ? "active" : ""}`}
                  onClick={() => setRating(star)}
                  type="button"
                >
                  ★
                </button>
              ))}
              <span className="rating-text">{rating}/5</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="content">Your Review:</label>
            <textarea
              id="content"
              className="review-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts about this event..."
              rows={6}
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
          <button
            className="cancel-button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
