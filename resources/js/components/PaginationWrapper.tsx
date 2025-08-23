import { Link } from "@inertiajs/react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginatedData } from "@/types";

interface PaginationWrapperProps {
    paginatedData?: PaginatedData<any>;
}

export default function PaginationWrapper({ paginatedData }: PaginationWrapperProps) {
    if (!paginatedData || paginatedData.total <= paginatedData.per_page) {
        return null;
    }

    return (
        <div className="flex items-center justify-between px-2 py-4">
            <div className="text-sm text-muted-foreground">
                Showing {paginatedData.from || 0} to {paginatedData.to || 0} of {paginatedData.total || 0} results
            </div>
            
            <div className="flex items-center space-x-2">
                {paginatedData.prev_page_url && (
                    <Link href={paginatedData.prev_page_url}>
                        <Button variant="outline" size="sm">
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>
                    </Link>
                )}
                
                {paginatedData.links?.slice(1, -1).map((link, index) => (
                    <Link 
                        key={index} 
                        href={link.url || "#"}
                        className={link.active ? "pointer-events-none" : ""}
                    >
                        <Button 
                            variant={link.active ? "default" : "outline"} 
                            size="sm"
                            disabled={!link.url}
                        >
                            {link.label}
                        </Button>
                    </Link>
                ))}
                
                {paginatedData.next_page_url && (
                    <Link href={paginatedData.next_page_url}>
                        <Button variant="outline" size="sm">
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
}