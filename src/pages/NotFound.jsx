import Button from "@mui/material/Button";
import { Navigate, NavLink } from "react-router-dom";

const NotFound = () => {
  const handleClick = () => {
    <Navigate to="/" />;
  };
  return (
    <div className="flex flex-col h-screen w-full justify-center">
      <div className="">
        <h2 className="text-black p-2  text-7xl font-semibold">
          404 Not Found
        </h2>
        <p className="text-black p-2">
          Lo sentimos, la página que estás buscando no existe.
        </p>
        <Button onClick={handleClick} variant="outlined" sx={{}}>
          <NavLink to="/">Regresar</NavLink>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
