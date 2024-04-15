import { Button } from "antd";
import { NavLink, Navigate } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";

const NotFound = () => {
  const { route } = useAuthenticator((context) => [context.route]);

  return (
    <div className="flex flex-col h-screen w-full justify-center">
      <div className="">
        <h2 className="text-black p-2  text-7xl font-semibold">
          404 Not Found
        </h2>
        <p className="text-black p-2">
          Lo sentimos, la página que estás buscando no existe.
        </p>
        <Button>
          <NavLink to="/">Regresar</NavLink>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
