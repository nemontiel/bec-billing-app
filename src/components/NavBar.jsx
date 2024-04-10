import { useAuthenticator } from "@aws-amplify/ui-react";
import "../styles/navBar.css";

const NavBar = () => {
  const { route, user, signOut } = useAuthenticator((context) => [
    context.route,
  ]);

  return (
    <div className="navbar">
      {route === "authenticated" ? (
        <div>
          <p style={{ color: "white" }}>{user.username}</p>
          <button onClick={signOut}>Logout</button>
        </div>
      ) : (
        <div>
          <p>not authenticated</p>
        </div>
      )}
    </div>
  );
};

export default NavBar;
