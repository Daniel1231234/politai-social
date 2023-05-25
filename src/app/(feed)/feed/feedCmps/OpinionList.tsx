"use client";

import { User } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import axios from "axios";
import toast from "react-hot-toast";
import OpinionPreview from "./OpinionPreview";
import { Opinion } from "@/types/prisma";

interface OpinionListProps {
  initialOpinions: Opinion[];
  currUserId: string;
}

const OpinionList: React.FC<OpinionListProps> = ({
  initialOpinions,
  currUserId,
}) => {
  const [totalOpinions, setTotalOpinions] =
    useState<Opinion[]>(initialOpinions);
  const [undoOps, setUndoOps] = useState<Opinion[]>([]);

  useEffect(() => {
    pusherClient.subscribe("new-opinion-channel");

    const newOpinionHandler = (newOpinion: Opinion) => {
      setTotalOpinions((prev) => [...prev, newOpinion]);
    };

    pusherClient.bind("new-opinion", newOpinionHandler);

    return () => {
      pusherClient.unsubscribe("new-opinion-channel");
      pusherClient.unbind("new-opinion");
    };
  }, [initialOpinions]);

  const addFriend = async (userToAdd: User) => {
    try {
      await axios.post("/api/friends/add", userToAdd);
      toast.success(`Request sent to ${userToAdd.name}`);
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const hideOpinion = (opinion: Opinion) => {
    setUndoOps((prev) => [...prev, opinion]);
  };

  const handleUndo = (opinion: Opinion) => {
    const updatedOps = undoOps.filter((op) => op.id !== opinion.id);
    setUndoOps(updatedOps);
  };

  return (
    <section className="mt-12 px-4 md:px-8">
      <div className="flex flex-col gap-8 mt-8 w-full">
        {totalOpinions?.map((opinion) => {
          const isFriends = opinion.author?.friendsIds.some(
            (friendId: string) => friendId === currUserId
          );
          const isUserOpinion = opinion.author?.id === currUserId;
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
            />
          );
        })}
      </div>
    </section>
  );
};

export default OpinionList;
