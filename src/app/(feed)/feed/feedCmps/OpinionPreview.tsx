"use client";

import Button from "@/components/ui/Button";
import Divider from "@/components/ui/Divider";
import { formatedDistance } from "@/helpers";
import { cn } from "@/lib/utils";
import { Opinion, User } from "@prisma/client";
import { StarIcon, UserPlus2Icon, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface OpinionPreviewProps {
  opinion: Opinion;
  isFriends: boolean;
  isUserOpinion: boolean;
  hideOpinion: (opinion: Opinion) => void;
  addFriend: (userToAdd: User) => Promise<void>;
  isUndo: boolean;
  handleUndo: any;
}

const IMAGE_PLACEHOLER_URL = "/images/placeholder.jpg";

const OpinionPreview: React.FC<OpinionPreviewProps> = ({
  opinion,
  isFriends,
  hideOpinion,
  isUserOpinion,
  addFriend,
  isUndo,
  handleUndo,
}) => {
  const router = useRouter();
  return (
    <div className="singal-opinion px-5 py-4 relative bg-white shadow rounded-lg w-full">
      {!isUndo ? (
        <>
          <button
            onClick={() => hideOpinion(opinion)}
            className="absolute right-2 p-1 top-2 text-gray-500 hover:bg-gray-50 hover:rounded-full"
            title="close"
            type="button"
          >
            <X className="h-6 w-6 cursor-pointer" />
          </button>
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
              onClick={() => router.push(`/feed/profile/${opinion?.authorId}`)}
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
          <Divider className="mt-6" />
          <div className="flex justify-between items-center">
            <div className="flex">
              <StarIcon className="p-0.5 h-6 w-6 rounded-full  bg-white " />
              <span className="ml-1 text-gray-500  font-light">0</span>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-between p-1">
          <div className="flex flex-col">
            <p>Opinion hidden</p>
            <p className="text-[10px] text-gray-500">
              {`You'll see fewer posts like this.`}
            </p>
          </div>
          <Button variant="ghost" onClick={() => handleUndo(opinion)}>
            Undo
          </Button>
        </div>
      )}
    </div>
  );
};

export default OpinionPreview;
