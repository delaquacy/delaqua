"use client";
import { useEffect } from "react";

import { requestGeneral } from "@/app/utils/webhoooks";

import OrderStepper from "../OrderStepper";

const MyForm = () => {
  // requestGeneral - hook for tracking revolute payment
  useEffect(() => {
    requestGeneral();
  }, []);

  return (
    <>
      <OrderStepper />
    </>
  );
};

export default MyForm;
