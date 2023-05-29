import getCurrentUser from "@/actions/getCurrentUser";
import getUserById from "@/actions/getUserById";
import getUserOpinions from "@/actions/getUserOpinions";
import getUserFriends from "@/actions/getUsersFriends";
import AddFriendButton from "@/components/profileCmps/AddFriendButton";
import ProfileContent from "@/components/profileCmps/ProfileContent";
import ProfileHead from "@/components/profileCmps/ProfileHead";
import Divider from "@/components/ui/Divider";
import { notFound, redirect } from "next/navigation";
import React from "react";

interface PageProps {
  params: {
    userId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const user = await getUserById(params.userId);
  const loggedInUser = await getCurrentUser();
  if (!user || !loggedInUser) return notFound();

  if (user.id === loggedInUser.id) {
    return redirect("/feed/profile");
  }

  const friends = await getUserFriends(user);

  const userOpinions = await getUserOpinions(user.id);

  const isAllreadyFrinds = friends?.some(
    (friend) => friend.id === loggedInUser.id
  );

  return (
    <div className=" bg-white flex relative flex-col">
      {!isAllreadyFrinds && <AddFriendButton userToAdd={user} />}

      <ProfileHead user={user} />
      <Divider />
      <ProfileContent
        user={user}
        userOpinions={userOpinions}
        friends={friends}
      />
    </div>
  );
};

export default Page;
