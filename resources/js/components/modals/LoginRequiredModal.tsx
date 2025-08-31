import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Link } from '@inertiajs/react';
import { LogIn, X } from 'lucide-react';

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  action?: string; // What action they were trying to perform
  redirectUrl?: string; // Where to redirect after login
}

export default function LoginRequiredModal({
  isOpen,
  onClose,
  action = 'continue',
  redirectUrl
}: LoginRequiredModalProps) {
  const loginUrl = redirectUrl 
    ? `/login?redirect=${encodeURIComponent(redirectUrl)}`
    : '/login';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogIn className="w-5 h-5" />
            Login Required
          </DialogTitle>
          <DialogDescription>
            You need to be logged in to {action}. Please login to continue.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center py-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <LogIn className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href={loginUrl}>
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}