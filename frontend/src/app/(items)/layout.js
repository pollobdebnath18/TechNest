"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function ItemsLayout({ children }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex gap-1">
          <span className="h-3 w-3 animate-bounce rounded-full bg-accent/40" style={{ animationDelay: "0ms" }} />
          <span className="h-3 w-3 animate-bounce rounded-full bg-accent/40" style={{ animationDelay: "150ms" }} />
          <span className="h-3 w-3 animate-bounce rounded-full bg-accent/40" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    );
  }

  if (!session) return null;

  return children;
}
