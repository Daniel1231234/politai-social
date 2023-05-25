import { User } from "@prisma/client";
import React, { useEffect, useState } from "react";
import OpinionItem from "./OpinionItem";
import { Opinion } from "@/types/prisma";

interface OpinionsProps {
  user: User;
  userOpinions: Opinion[];
}

const Opinions: React.FC<OpinionsProps> = ({ user, userOpinions }) => {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 overflow-y-auto p-6">
      {userOpinions.map((opinion: Opinion) => (
        <div
          key={opinion.id}
          className=" rounded-lg shadow-lg overflow-hidden transition-transform duration-300 transform hover:-translate-y-2 hover:shadow-xl"
        >
          <OpinionItem item={opinion} img={user.image!} author={user.name!} />
        </div>
      ))}
    </div>
  );
};

export default Opinions;
