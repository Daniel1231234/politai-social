"use client";

import AuthContext from "@/app/context/AuthContext";
import { Toaster } from "react-hot-toast";
import React from "react";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <AuthContext>
      <Toaster position="top-center" reverseOrder={false} />
      {children}
    </AuthContext>
  );
};

export default Providers;
