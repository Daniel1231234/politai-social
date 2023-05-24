import React from "react";
import AuthForm from "./authCmps/AuthForm";
import { FaGlobe } from "react-icons/fa";

const Auth = () => {
  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-4 lg:px-8 bg-gray-100">
      <div className="pl-4 flex items-center mx-auto">
        <span className="text-4xl font-bold tracking-tight rounded-md p-2">
          Politai
        </span>
        <FaGlobe className="mr-2" />
        <span className="text-2xl">Social</span>
      </div>
      <AuthForm />
    </div>
  );
};

export default Auth;
