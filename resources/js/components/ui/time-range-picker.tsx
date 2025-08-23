import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface TimeRangePickerProps {
  startTime: string;
  endTime: string;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  disabled?: boolean;
  className?: string;
  startError?: string;
  endError?: string;
}

export function TimeRangePicker({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  disabled = false,
  className,
  startError,
  endError
}: TimeRangePickerProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start-time" className="text-sm font-medium">
            Opening Time
          </Label>
          <Input
            id="start-time"
            type="time"
            value={startTime}
            onChange={(e) => onStartTimeChange(e.target.value)}
            disabled={disabled}
            className={startError ? 'border-red-500' : ''}
          />
          {startError && (
            <p className="text-sm text-red-500">{startError}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="end-time" className="text-sm font-medium">
            Closing Time
          </Label>
          <Input
            id="end-time"
            type="time"
            value={endTime}
            onChange={(e) => onEndTimeChange(e.target.value)}
            disabled={disabled}
            className={endError ? 'border-red-500' : ''}
          />
          {endError && (
            <p className="text-sm text-red-500">{endError}</p>
          )}
        </div>
      </div>
      
      {(startTime && endTime) && (
        <div className="text-sm text-gray-600 mt-2">
          Business hours: {formatTime(startTime)} - {formatTime(endTime)}
        </div>
      )}
    </div>
  );
}

// Helper function to format 24-hour time to 12-hour format
function formatTime(time: string): string {
  if (!time) return '';
  
  const [hours, minutes] = time.split(':');
  const hour12 = parseInt(hours, 10);
  const ampm = hour12 >= 12 ? 'PM' : 'AM';
  const displayHour = hour12 === 0 ? 12 : hour12 > 12 ? hour12 - 12 : hour12;
  
  return `${displayHour}:${minutes} ${ampm}`;
}