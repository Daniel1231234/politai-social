"use client";

import useFriendRequests from "@/context/useFriendRequests";
import AppLogo from "@/components/AppLogo";
import DropDown from "@/components/ui/DropDown";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { FriendRequest, User } from "@prisma/client";
import axios from "axios";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface feedHeaderProps {
  user: User;
}

const FeedHeader: React.FC<feedHeaderProps> = ({ user }) => {
  const router = useRouter();

  const { friendRequests, addFriendRequest, removeFriendRequest } =
    useFriendRequests();

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${user.id}:incoming_friend_requests`)
    );

    const friendRequestsHandler = (senderData: FriendRequest) => {
      addFriendRequest(senderData);
    };

    pusherClient.bind("incoming_friend_requests", friendRequestsHandler);

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${user.id}:incoming_friend_requests`)
      );
      pusherClient.unbind("incoming_friend_requests", friendRequestsHandler);
    };
  }, [user.id, addFriendRequest]);

  const handleFriendRequest = async (senderId: string, action: string) => {
    try {
      await axios.post(`/api/friends/${action}`, { senderId });
      removeFriendRequest(senderId);
      toast.success(`You have successfully ${action}ed the friend request`);
      router.refresh();
    } catch (err) {
      console.log("error in handle friendRequests in foot header => ", err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="py-2 border-b-2 px-7 flex items-center justify-between ">
      <div className="left-side">
        <div
          id="search-bar"
          className="rounded-3xl bg-bg-feed w-60 shadow-sm relative flex items-center"
        >
          <SearchIcon className="h-4 ml-2" />
          <input
            type="text"
            name="search"
            placeholder="Search Everything"
            className="border-none outline-none rounded-3xl ml-2"
          />
        </div>
      </div>

      <AppLogo className="pl-4" />

      <div id="right-size">
        <DropDown
          user={user}
          friendRequests={friendRequests}
          handleFriendRequest={handleFriendRequest}
        />
      </div>
    </div>
  );
};

export default FeedHeader;
