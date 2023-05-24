"use client";

import React from "react";
import Image from "next/image";
import { User } from "@prisma/client";
import { formatDate } from "@/helpers";
import { CldUploadButton } from "next-cloudinary";
import { toast } from "react-hot-toast";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";

interface ProfileHeadProps {
  user: User;
}

const ProfileHead: React.FC<ProfileHeadProps> = ({ user }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isCurrUser = pathname?.endsWith("/feed/profile") ? true : false;

  const handleUpload = async (results: any) => {
    if (!isCurrUser) return;
    try {
      const newImageUrl = results.info.secure_url;
      await axios.post("/api/user/picture", { newImageUrl });
      toast.success("You have changed your Profile picture successfully");
      router.refresh();
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong with your upload");
    }
  };

  return (
    <div id="profile-top" className="flex flex-col items-center ">
      <div className="relative cursor-pointer flex items-center">
        {isCurrUser ? (
          <>
            <CldUploadButton
              options={{ maxFiles: 1 }}
              onUpload={handleUpload}
              uploadPreset="wz721uu6"
            >
              <Image
                src={user.image ?? "/images/placeholder.jpg"}
                alt="profile"
                width={150}
                height={150}
                className="rounded-full opacity-90 hover:opacity-100"
              />
            </CldUploadButton>
          </>
        ) : (
          <Image
            src={user.image ?? "/images/placeholder.jpg"}
            alt="profile"
            width={150}
            height={150}
            className="rounded-full opacity-90 hover:opacity-100"
          />
        )}
      </div>
      <div className="flex flex-col justify-between items-center">
        <h2 className="font-bold text-3xl">{user.name}</h2>
        <p className="text-[#65676B]">{user.friendsIds.length} friends</p>
        <p className="text-[#65676B] text-sm">
          Join Politai at
          <span className="font-semibold"> {formatDate(user.createdAt)}</span>
        </p>
      </div>
      <div className="w-full border border-gray-200" />
    </div>
  );
};

export default ProfileHead;
