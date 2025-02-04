import { Link } from "@tanstack/react-router";

import { Heading, Paragraph } from "@/components/ui/typography";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const { user } = useSession();

  return (
    <header className="flex h-16 items-center justify-between px-4">
      <Heading as="h2">
        <Link to="/$id" params={{ id: "2" }}>
          FootKing
        </Link>
      </Heading>
      <nav>{user ? <UserLogged /> : <NoUserLogged />}</nav>
    </header>
  );
};

const UserLogged = () => {
  const { user } = useSession();

  return (
    <div className="flex items-center gap-2">
      <Paragraph>{user?.email}</Paragraph>
      <Link to="/">Logout</Link>
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
