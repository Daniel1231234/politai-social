import getCurrentUser from "@/actions/getCurrentUser";
import getUserFriends from "@/actions/getUsersFriends";
import ProfileContent from "@/components/profileCmps/ProfileContent";
import ProfileHead from "@/components/profileCmps/ProfileHead";
import Divider from "@/components/ui/Divider";
import { Opinion } from "@/types/prisma";
import { notFound } from "next/navigation";
import React from "react";

const Page = async () => {
  const user = await getCurrentUser();
  if (!user) return notFound();

  const friends = await getUserFriends(user);

  return (
    <div className=" bg-white flex flex-col">
      <ProfileHead user={user} />
      <Divider />
      <ProfileContent
        user={user}
        userOpinions={user.opinions as Opinion[]}
        friends={friends}
      />
    </div>
  );
};

export default Page;
