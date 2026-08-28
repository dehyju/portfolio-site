import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
  size?: number;
}

export function Spinner({ className, size = 24 }: SpinnerProps) {
  return (
    <div className="flex justify-center items-center py-20">
      <Loader2 className={cn("animate-spin text-primary", className)} size={size} />
    </div>
  );
}
