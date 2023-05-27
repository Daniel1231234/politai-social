import getCurrentUser from "@/actions/getCurrentUser";
import { notFound } from "next/navigation";
import React from "react";
import NewOpinionInput from "./feedCmps/NewOpinionInput";
import Divider from "@/components/ui/Divider";
import getTotalOpinions from "@/actions/getTotalOpinions";
import OpinionList from "./feedCmps/OpinionList";

const Page = async () => {
  const user = await getCurrentUser();
  if (!user) return notFound();

  const initialOpinions = await getTotalOpinions();

  if (!initialOpinions) return;

  return (
    <>
      <NewOpinionInput user={user} />
      <Divider />
      <OpinionList initialOpinions={initialOpinions} loggedinUser={user} />
    </>
  );
};

export default Page;
