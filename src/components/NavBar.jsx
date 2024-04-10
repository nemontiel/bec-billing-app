import { useAuthenticator } from "@aws-amplify/ui-react";
import { Button } from "@mui/material";
import "../styles/navBar.css";

const NavBar = () => {
  const { route, user, signOut } = useAuthenticator((context) => [
    context.route,
  ]);

  if (route === "authenticated") {
    return (
      <nav className="h-20 bg-blue-950 flex flex-row items-center">
        <div className="w-1/2 flex justify-start p-5">
          <p className="font-extrabold text-2xl">BEC - Facturación</p>
        </div>
        <div className="flex flex-row justify-end items-center gap-5 p-5 w-1/2">
          <p className="font-semibold">{user.username}</p>
          <Button onClick={signOut} className="font-semibold text-white">
            Logout
          </Button>
        </div>
      </nav>
    );
  } else {
    <div></div>;
  }
};

export default NavBar;
