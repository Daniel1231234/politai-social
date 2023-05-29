"use client";

import { User } from "@prisma/client";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import OpinionPreview from "./OpinionPreview";
import { OpinionSchema } from "@/types/opinionType";
import EmptyState from "@/components/ui/EmptyState";

interface OpinionListProps {
  initialOpinions: OpinionSchema[];
  loggedinUser: User;
}

const OpinionList: React.FC<OpinionListProps> = ({
  initialOpinions,
  loggedinUser,
}) => {
  const [totalOpinions, setTotalOpinions] =
    useState<OpinionSchema[]>(initialOpinions);
  const [undoOps, setUndoOps] = useState<OpinionSchema[]>([]);

  const addFriend = async (userToAdd: User) => {
    try {
      await axios.post("/api/friends/add", userToAdd);
      toast.success(`Request sent to ${userToAdd.name}`);
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const hideOpinion = (opinion: OpinionSchema) => {
    setUndoOps((prev) => [...prev, opinion]);
  };

  const handleUndo = (opinion: OpinionSchema) => {
    const updatedOps = undoOps.filter((op) => op.id !== opinion.id);
    setUndoOps(updatedOps);
  };

  return (
    <section className="mt-12 px-4 md:px-8">
      <div className="flex flex-col gap-8 mt-8 w-full">
        {totalOpinions.length === 0 && <EmptyState />}
        {totalOpinions?.map((opinion) => {
          const isFriends = opinion.author?.friendsIds.some(
            (friendId: string) => friendId === loggedinUser.id
          );
          const isUserOpinion = opinion.author?.id === loggedinUser.id;
          const isUndo = undoOps.some((opn) => opn.id === opinion.id);

          return (
            <OpinionPreview
              key={opinion.id}
              opinion={opinion}
              isFriends={isFriends}
              hideOpinion={hideOpinion}
              isUserOpinion={isUserOpinion}
              addFriend={addFriend}
              isUndo={isUndo}
              handleUndo={handleUndo}
              loggedinUser={loggedinUser}
            />
          );
        })}
      </div>
    </section>
  );
};

export default OpinionList;
