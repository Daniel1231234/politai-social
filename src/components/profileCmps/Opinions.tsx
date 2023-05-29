import { User } from "@prisma/client";
import React, { useEffect, useState } from "react";
import OpinionItem from "./OpinionItem";
import { OpinionSchema } from "@/types/opinionType";
import EmptyState from "../ui/EmptyState";

interface OpinionsProps {
  user: User;
  userOpinions: OpinionSchema[];
}

const Opinions: React.FC<OpinionsProps> = ({ user, userOpinions }) => {
  if (userOpinions.length === 0) return <EmptyState />;
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 overflow-y-auto p-6">
      {userOpinions.map((opinion: OpinionSchema) => (
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
