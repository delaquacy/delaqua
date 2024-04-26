"use client";

import React, { useEffect } from "react";
const NotFound = () => {
  useEffect(() => {
    window.location.href = "/";
  }, []);
  return <div></div>;
};

export default NotFound;
