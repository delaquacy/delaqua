import React from "react";
import Login, { LogInProps } from "../Login/Login";

const WrapperLogin: React.FC<LogInProps> = (props) => {
  return <Login {...props} />;
};

export default WrapperLogin;
