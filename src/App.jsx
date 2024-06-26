import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { I18n } from "aws-amplify/utils";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";

import "./App.css";
import awsExports from "./aws-exports";

Amplify.configure(awsExports);

I18n.setLanguage("es");

I18n.putVocabularies({
  es: {
    "Sign in": "Iniciar Sesión",
    Username: "Nombre de Usuario",
    Password: "Contraseña",
    "Forgot your password?": "¿Olvidaste tu contraseña?",
    "Enter your Username": "Introduce tu nombre de usuario",
    "Enter your Password": "Introduce tu contraseña",
    "Incorrect username or password.": "Usuario o contraseña incorrectos.",
    "Account recovery requires verified contact information":
      "Recuperación de cuenta requiere información de contacto verificada",
    Verify: "Verificar",
    Skip: "Saltar",
    Code: "Código",
    Submit: "Enviar",
  },
});

function App() {
  const { route } = useAuthenticator((context) => [context.route]);

  return route === "authenticated" ? (
    <div>
      <Navigate to="/pagos" replace={true} />
    </div>
  ) : (
    <div className="content-center w-full h-screen">
      <Authenticator hideSignUp={true}></Authenticator>
    </div>
  );
}

export default App;
