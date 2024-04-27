import React from "react";
import Logins, { LogInProps } from "../Logins/Logins";

const WrapperLogin: React.FC<LogInProps> = (props) => {
  return <Logins {...props} />;
};

export default WrapperLogin;
