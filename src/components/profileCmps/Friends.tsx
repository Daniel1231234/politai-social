import { User } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface FriendsProps {
  user: User;
  friends?: User[] | null;
  isAllreadyFrinds?: boolean;
}

const Friends: React.FC<FriendsProps> = ({ user, friends }) => {
  const [userFriends, setUserFriends] = useState(friends);
  const pathname = usePathname();
  const router = useRouter();
  const isCurrUser = pathname?.endsWith("/feed/profile") ? true : false;

  const handleDeleteFriend = async (friendId: string) => {
    try {
      await axios.delete(`/api/friends/remove/${friendId}`);
      toast.success("Friend delete successfully");
      router.refresh();
    } catch (err) {
      toast.error("Cant remove this friend! please try again later");
    }
  };

  const handleStartChat = (friendId: string) => {
    console.log("start chating");
    // Logic to start a private chat with the friend
  };

  return (
    <div id="friends" className="w-full">
      {userFriends?.map((friend) => (
        <div
          key={friend.id}
          className="flex items-center justify-between p-4 border-b border-gray-200"
        >
          <div className="flex relative items-center space-x-4">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Image width={40} height={40} src={friend.image!} alt="" />
            </div>
            <span className="text-lg font-medium">{friend.name}</span>
          </div>
          {isCurrUser && (
            <div className="flex space-x-2">
              <button
                className="px-4 py-2 text-sm font-medium text-red-500 bg-white rounded-full border border-red-500 hover:bg-red-500 hover:text-white"
                onClick={() => handleDeleteFriend(friend.id)}
              >
                Delete
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-full hover:bg-blue-600"
                onClick={() => handleStartChat(friend.id)}
              >
                Private Chat
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Friends;
