import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useGetIdentity } from "@refinedev/core";
import type { User } from "@/types";
import { CircleUser } from "lucide-react";

export function UserAvatar() {
  const { data: user, isLoading: userIsLoading } = useGetIdentity<User>();

  if (userIsLoading) {
    return <Skeleton className={cn("h-10", "w-10", "rounded-full")} />;
  }

  if (!user) {
    return (
        <div className={cn("h-10", "w-10", "rounded-full", "bg-muted", "flex", "items-center", "justify-center")}>
          <CircleUser className="h-6 w-6 text-muted-foreground" />
        </div>
    );
  }

  const name = user.name ?? "";
  const image = user.image;

  return (
      <Avatar className={cn("h-10", "w-10")}>
        {image && <AvatarImage src={image} alt={name} />}
        <AvatarFallback className="bg-primary/10 text-primary font-medium">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
  );
}

const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
};

UserAvatar.displayName = "UserAvatar";