import type { FC } from "react";
import { useTransition } from "react";

import { Link } from "@tanstack/react-router";

import { Heading, Paragraph } from "@/components/ui/typography";
import type { User } from "@/lib/auth-client";
import { signOut, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Header = () => {
  const { user, isPending } = useSession();

  return (
    <header className="flex h-16 items-center justify-between px-4">
      <Heading as="h2">
        {/* @ts-ignore */}
        <Link to="/$id" params={{ id: user?.id }}>
          FootKing
        </Link>
      </Heading>
      <nav>
        {isPending ? (
          <Skeleton className="h-8 w-32" />
        ) : user ? (
          <UserLogged {...user} />
        ) : (
          <NoUserLogged />
        )}
      </nav>
    </header>
  );
};

const UserLogged: FC<User> = (user) => {
  const [pending, startTransition] = useTransition();

  const onSignOut = () => {
    startTransition(() => {
      signOut();
    });
  };

  return (
    <div className="flex items-center gap-x-4">
      <Paragraph>{user?.name}</Paragraph>
      <Button variant="destructive" size={pending ? "icon" : "sm"} onClick={onSignOut}>
        {pending ? <Skeleton className="h-4 w-4" /> : "Cerrar sesión"}
      </Button>
    </div>
  );
};

const NoUserLogged = () => {
  return (
    <div>
      <Button asChild>
        <Link to="/login">Login</Link>
      </Button>
    </div>
  );
};
