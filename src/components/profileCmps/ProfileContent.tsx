"use client";

import { User } from "@prisma/client";
import React, { useState } from "react";
import Button from "../ui/Button";
import About from "./About";
import Friends from "./Friends";
import Opinions from "./Opinions";
import { Opinion } from "@/types/prisma";

interface ProfileContentProps {
  user: User;
  userOpinions: Opinion[];
  friends?: User[] | null;
}

type Variant = "OPINIONS" | "ABOUT" | "FRIENDS";

const ProfileContent: React.FC<ProfileContentProps> = ({
  user,
  userOpinions,
  friends,
}) => {
  const [variant, setVariant] = useState<Variant>("OPINIONS");

  const content = () => {
    if (variant === "ABOUT") return <About user={user} />;
    if (variant === "FRIENDS") return <Friends friends={friends} user={user} />;
    if (variant === "OPINIONS")
      return <Opinions user={user} userOpinions={userOpinions} />;
  };

  return (
    <div className="border-b ">
      <div className="flex shadow-sm" id="profile-btns-actions">
        <Button
          onClick={() => setVariant("OPINIONS")}
          variant="ghost"
          className="!bg-inherit hover:!bg-gray-200 hover:!text-blue-500"
        >
          Opinios
        </Button>
        <Button
          onClick={() => setVariant("ABOUT")}
          variant="ghost"
          className="!bg-inherit hover:!bg-gray-200 hover:!text-blue-500"
        >
          About
        </Button>
        <Button
          onClick={() => setVariant("FRIENDS")}
          variant="ghost"
          className="!bg-inherit hover:!bg-gray-200 hover:!text-blue-500"
        >
          Friends
        </Button>
      </div>
      {content()}
    </div>
  );
};

export default ProfileContent;
