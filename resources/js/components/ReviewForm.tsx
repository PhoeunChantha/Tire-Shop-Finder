import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';

interface ReviewFormProps {
    isOpen: boolean;
    onClose: () => void;
    businessId: number;
    businessName: string;
}

export default function ReviewForm({ isOpen, onClose, businessId, businessName }: ReviewFormProps) {
    const [rating, setRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number>(0);

    const { data, setData, post, processing, errors, reset } = useForm({
        comment: '',
        rate: '',
        business_id: businessId,
        device_id: navigator.userAgent || 'unknown',
        user_id: '', // Will be set by backend if user is authenticated
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (rating === 0) {
            Notiflix.Notify.warning('Please select a rating before submitting your review.');
            return;
        }

        // Update the form data with the current rating
        const submitData = {
            ...data,
            rate: rating.toString(),
            business_id: businessId
        };
        
        post('/reviews', {
            data: submitData,
            onSuccess: () => {
                reset();
                setRating(0);
                setHoverRating(0);
                onClose();
            },
            onError: (errors) => {
                console.error('Review submission error:', errors);
                if (Object.keys(errors).length > 0) {
                    const errorMessages = Object.values(errors).join('\n');
                    Notiflix.Notify.failure(`Error submitting review:\n${errorMessages}`);
                } else {
                    Notiflix.Notify.failure('Error submitting review. Please try again.');
                }
            }
        });
    };

    const handleClose = () => {
        reset();
        setRating(0);
        setHoverRating(0);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto sm:mx-0">
                <DialogHeader className="pb-4">
                    <DialogTitle className="text-lg sm:text-xl leading-tight">
                        Write a Review for {businessName}
                    </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 px-1">
                    {/* Rating Stars */}
                    <div className="space-y-3">
                        <Label htmlFor="rating" className="text-sm font-medium">
                            Rating <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex flex-col items-center space-y-3">
                            <div className="flex flex-row justify-center items-center gap-2 sm:gap-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1 transition-transform hover:scale-110"
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(star)}
                                        onTouchStart={() => setHoverRating(star)}
                                        onTouchEnd={() => setHoverRating(0)}
                                    >
                                        <Star
                                            className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 transition-colors ${
                                                star <= (hoverRating || rating)
                                                    ? 'text-yellow-500 fill-yellow-500'
                                                    : 'text-gray-300'
                                            }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            {rating > 0 && (
                                <div className="text-center">
                                    <span className="text-sm sm:text-base text-gray-600 font-medium">
                                        {rating} of 5 star{rating !== 1 ? 's' : ''}
                                        <span className="block sm:inline sm:ml-1 text-xs sm:text-sm text-gray-500">
                                            {rating === 1 && 'Poor'}
                                            {rating === 2 && 'Fair'}
                                            {rating === 3 && 'Good'}
                                            {rating === 4 && 'Very Good'}
                                            {rating === 5 && 'Excellent'}
                                        </span>
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Comment */}
                    <div className="space-y-3">
                        <Label htmlFor="comment" className="text-sm font-medium">
                            Your Review (Optional)
                        </Label>
                        <Textarea
                            id="comment"
                            placeholder="Tell others about your experience with this tire shop..."
                            value={data.comment}
                            onChange={(e) => setData('comment', e.target.value)}
                            className="min-h-[80px] sm:min-h-[100px] text-sm sm:text-base resize-none"
                        />
                        {errors.comment && (
                            <p className="text-sm text-red-600 mt-1">{errors.comment}</p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="flex-1 h-10 sm:h-11 text-sm sm:text-base order-2 sm:order-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || rating === 0}
                            className="flex-1 h-10 sm:h-11 text-sm sm:text-base order-1 sm:order-2"
                        >
                            {processing ? 'Submitting...' : 'Submit Review'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}