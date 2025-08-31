import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { Review } from '@/types';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  // Handle case where user might be null (deleted user)
  const userName = review.user?.name || 'Anonymous User';
  const userEmail = review.user?.email || '';

  const renderStars = (rating: number) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <Star 
        key={star} 
        className={`w-4 h-4 ${
          star <= rating 
            ? 'text-yellow-500 fill-current' 
            : 'text-gray-300'
        }`} 
      />
    ));
  };

  const getInitials = (name: string) => {
    if (!name || name === 'Anonymous User') {
      return 'AN';
    }
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(diffInDays / 365);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        {/* User Avatar */}
        <Avatar className="w-12 h-12 flex-shrink-0">
          <AvatarImage src="" alt={userName} />
          <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
            {getInitials(userName)}
          </AvatarFallback>
        </Avatar>

        {/* Review Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-semibold text-gray-900">
                {userName}
              </h4>
              <p className="text-sm text-gray-500">
                {formatDate(review.created_at)}
              </p>
            </div>
            
            {/* Rating */}
            <div className="flex items-center space-x-1">
              {renderStars(review.rate)}
            </div>
          </div>

          {/* Comment */}
          <div className="mt-3">
            <p className="text-gray-700 leading-relaxed">
              {review.comment}
            </p>
          </div>

          {/* Rating Badge */}
          <div className="mt-3 flex items-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <Star className="w-3 h-3 mr-1 fill-current" />
              {review.rate}/5 stars
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}