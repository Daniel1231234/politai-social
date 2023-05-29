"use client";

import { User } from "@prisma/client";
import Image from "next/image";
import React, { useState } from "react";
import OpinionModal from "./OpinionModal";

interface NewOpinionInputProps {
  user: User;
}

const NewOpinionInput: React.FC<NewOpinionInputProps> = ({ user }) => {
  let [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      <div className="flex w-full max-w-md mx-auto my-5">
        <div className="relative w-12 mr-2 h-12">
          <Image
            src={user?.image!}
            alt="profile"
            fill
            className="rounded-full"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div
          onClick={() => setIsOpen(true)}
          className="flex flex-1 items-center px-3 py-2 bg-white rounded-full border border-gray-300 hover:bg-gray-100 cursor-pointer"
        >
          <span className="text-gray-700">Share your opinion, {user.name}</span>
        </div>
      </div>

      <OpinionModal isOpen={isOpen} setIsOpen={setIsOpen} user={user} />
    </>
  );
};

export default NewOpinionInput;
