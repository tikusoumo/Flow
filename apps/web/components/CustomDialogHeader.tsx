import { LucideIcon } from "lucide-react";
import { DialogHeader, DialogTitle } from "./ui/dialog";
import { cn } from "@/lib/utils";

interface CustomDialogHeaderProps {
  icon?: LucideIcon;
  title?: string;
  subtitle?: string;
  iconClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

export default function CustomDialogHeader(props: CustomDialogHeaderProps) {
  const Icon = props.icon;
  return (
    <DialogHeader className="flex flex-col gap-1">
      <DialogTitle asChild>
        <div className="flex flex-col items-center justify-center gap-2">
          {Icon && (
            <Icon
              size={30}
              className={cn("stroke-primary", props.iconClassName)}
            />
          )}
          {props.title && (
            <h1 className={cn("text-xl text-primary", props.titleClassName)}>
              {props.title}
            </h1>
          )}
          {props.subtitle && (
            <p
              className={cn(
                "text-sm text-muted-foreground",
                props.subtitleClassName
              )}
            >
              {props.subtitle}
            </p>
          )}
        </div>
      </DialogTitle>
    </DialogHeader>
  );
}
