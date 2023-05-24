"use client";

import React, { useState } from "react";
import Button from "../ui/Button";
import { User } from "@prisma/client";
import { toast } from "react-hot-toast";
import axios from "axios";
import { UserPlus } from "lucide-react";

interface AddFriendButtonProps {
  userToAdd: User;
}

const AddFriendButton: React.FC<AddFriendButtonProps> = ({
  userToAdd,
}: AddFriendButtonProps) => {
  const [isAdding, setIsAdding] = useState(false);

  const addFriend = async () => {
    setIsAdding(true);
    try {
      await axios.post("/api/friends/add", userToAdd);
      toast.success(`Request sent to ${userToAdd.name}`);
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button
      size="lg"
      isLoading={isAdding}
      onClick={addFriend}
      className="!bg-transparent self-start hover:!bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent"
    >
      <UserPlus className="w-12 h-12" />
    </Button>
  );
};

export default AddFriendButton;
