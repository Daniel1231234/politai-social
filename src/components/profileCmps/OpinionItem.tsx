"use client";

import { formatDate, formatDateHHMM } from "@/helpers";
import { Opinion } from "@prisma/client";
import { Heart } from "lucide-react";
import Image from "next/image";
import React from "react";
import Divider from "../ui/Divider";

interface OpinionProps {
  item: Opinion;
  img: string;
  author?: string;
}

const OpinionItem: React.FC<OpinionProps> = ({ item, img, author }) => {
  return (
    <div className="w-full md:max-w-md bg-white rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 bg-gray-100">
        <div className="flex items-center">
          <Image
            src={img}
            width={40}
            height={40}
            alt=""
            className="rounded-full cursor-pointer"
          />
          <div className="ml-3 flex flex-col justify-start gap-1">
            <p className="text-sm font-medium text-gray-800">
              {formatDate(item.createdAt)}
            </p>
            <p className="text-xs text-gray-600 ">
              {formatDateHHMM(item.createdAt)}
            </p>
            <p className="text-gray-600 text-xs">
              {author ?? item.author.name}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <Heart className="h-5 w-5 text-gray-600 cursor-pointer hover:text-blue-500" />
        </div>
      </div>
      <div className="px-6 pt-4 py-8">
        <p className="text-gray-800 text-base">{item.body}</p>
      </div>
      <Divider />
      <div className="px-6 pt-4 pb-2">
        {item.topics.map((topic: string, idx: number) => (
          <span
            key={idx}
            className="inline-block bg-blue-500 text-white rounded-full px-3 py-1 text-xs font-semibold mr-2 mb-2"
          >
            #{topic}
          </span>
        ))}
      </div>
    </div>
  );
};

export default OpinionItem;
