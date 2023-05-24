"use client";

import { Opinion, User } from "@prisma/client";
import React, { useCallback, useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { useRouter } from "next/navigation";
import { StarIcon, UserPlus2Icon } from "lucide-react";
import { formatedDistance, getInitialTopics } from "@/helpers";
import FilterOpinions from "./FilterOpinions";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";

interface OpinionListProps {
  initialOpinions: Opinion[];
  currUserId: string;
}

const initialTopics = getInitialTopics();
const IMAGE_PLACEHOLER_URL = "/images/placeholder.jpg";

const OpinionList: React.FC<OpinionListProps> = ({
  initialOpinions,
  currUserId,
}) => {
  const [totalOpinions, setTotalOpinions] =
    useState<Opinion[]>(initialOpinions);
  const router = useRouter();

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

  const handleFilter = useCallback((chosenTopic: string) => {
    const filteredOpinions =
      chosenTopic !== "General"
        ? totalOpinions.filter(
            (opinion) => opinion.topics.indexOf(chosenTopic) !== -1
          )
        : totalOpinions;
    setTotalOpinions(filteredOpinions);
  }, []);

  const addFriend = async (userToAdd: User) => {
    try {
      await axios.post("/api/friends/add", userToAdd);
      toast.success(`Request sent to ${userToAdd.name}`);
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <section className="mt-12 px-4 md:px-8">
      {/* <FilterOpinions topics={initialTopics} handleFilter={handleFilter} /> */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-[30px] mt-8">
        {totalOpinions?.map((opinion) => {
          const isFriends = opinion.author?.friendsIds.some(
            (friendId) => friendId === currUserId
          );
          const isUserOpinion = opinion.author?.id === currUserId;
          return (
            <div
              id="singal-opinion"
              key={opinion.id}
              className="px-5 py-4 relative bg-white shadow rounded-lg max-w-lg "
            >
              {!isFriends && !isUserOpinion && (
                <button
                  className="absolute right-2 top-2"
                  onClick={() => addFriend(opinion.author)}
                >
                  <UserPlus2Icon className="w-7 h-7 p-1 text-gray-700 hover:text-blue-600 hover:bg-secondery" />
                </button>
              )}
              <div className="relative flex mb-4">
                <Image
                  width={48}
                  height={48}
                  className=" rounded-full"
                  src={opinion?.author?.image ?? IMAGE_PLACEHOLER_URL}
                  alt="User Profile"
                />
                <div
                  className="ml-2 mt-0.5 cursor-pointer"
                  onClick={() =>
                    router.push(`/feed/profile/${opinion?.authorId}`)
                  }
                >
                  <span className="block font-medium text-base leading-snug text-black ">
                    {opinion?.author?.name}
                  </span>
                  <span className="block text-sm text-gray-500 font-light leading-snug">
                    {formatedDistance(opinion.createdAt)}
                  </span>
                </div>
              </div>
              <p className="text-gray-800  leading-snug md:leading-normal">
                {opinion?.body}
              </p>
              <div className="flex justify-between items-center mt-5">
                <div className="flex">
                  <StarIcon className="p-0.5 h-6 w-6 rounded-full  bg-white " />
                  <span className="ml-1 text-gray-500  font-light">0</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default OpinionList;
