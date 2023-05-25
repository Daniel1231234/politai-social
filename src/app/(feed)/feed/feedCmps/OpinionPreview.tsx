"use client";

import Button from "@/components/ui/Button";
import Divider from "@/components/ui/Divider";
import { formatedDistance } from "@/helpers";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { cn } from "@/lib/utils";
import { Like, Opinion } from "@/types/prisma";
import { User } from "@prisma/client";
import axios from "axios";
import {
  MessageSquareIcon,
  SendIcon,
  ThumbsUpIcon,
  UserPlus2Icon,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import TextareaAutosize from "react-textarea-autosize";

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
  const [openComments, setOpenComments] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>("");
  const [opinionComments, setOpinionComments] = useState<Comment[]>([]);
  const [opinionLikes, setOpinionLikes] = useState<Like[]>([]);
  const session = useSession();

  const opinionRef = useRef<HTMLDivElement | null>(null);

  const handleCloseComments = () => setOpenComments(false);

  useOnClickOutside(opinionRef, handleCloseComments);

  const handleNewComment = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    console.log(commentText);
    try {
      const res = await axios.post("/api/comment", {
        commentText: commentText,
        opinionId: opinion.id,
      });
      console.log(res);
      setCommentText("");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleNewLike = () => {
    try {
      const currUser = session.data?.user;
      const newLike = { userId: currUser!.email!, userName: currUser!.name! };
      setOpinionLikes((prev) => [...prev, newLike]);
    } catch (err) {}
  };

  return (
    <div
      className="opinion-container px-5 py-4 relative bg-white shadow rounded-lg w-full"
      ref={opinionRef}
    >
      {!isUndo ? (
        <>
          <button
            onClick={() => hideOpinion(opinion)}
            className="absolute top-2 right-2 p-1 text-gray-500 hover:bg-gray-50 hover:rounded-full"
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
          <div className="user-profile-section relative flex mb-4">
            <Image
              placeholder="blur"
              blurDataURL={IMAGE_PLACEHOLER_URL}
              width={48}
              height={48}
              className="rounded-full"
              src={opinion?.author?.image ?? IMAGE_PLACEHOLER_URL}
              alt="User Profile"
            />
            <div
              className="ml-2 mt-0.5 cursor-pointer"
              onClick={() => router.push(`/feed/profile/${opinion?.authorId}`)}
            >
              <span className="block font-medium text-base leading-snug text-black">
                {opinion?.author?.name}
              </span>
              <span className="block text-sm text-gray-500 font-light leading-snug">
                {formatedDistance(opinion.createdAt)}
              </span>
            </div>
          </div>

          <p className="opinion-text text-gray-800 leading-snug md:leading-normal">
            {opinion?.body}
          </p>

          <Divider className="my-2" />
          <div className="flex justify-between items-center">
            <div className="flex">
              <ThumbsUpIcon className="p-1 rounded-full bg-blue-400 shadow-md text-white" />
              <span className="ml-1 text-gray-500 font-light">
                {opinion?.likes?.length ?? 0}
              </span>
            </div>
            <div className="flex">
              <p className="text-gray-600 text-sm font-light">
                {opinion?.comments?.length ?? 0} comments
              </p>
            </div>
          </div>

          <Divider className="my-2" />

          <div className="flex items-center justify-between w-full">
            <Button
              onClick={handleNewLike}
              title="like"
              size="sm"
              variant="ghost"
              className="flex items-center gap-1 font-normal flex-1"
            >
              <ThumbsUpIcon />
              <span>Like</span>
            </Button>
            <Button
              onClick={() => setOpenComments(true)}
              type="button"
              title="comment"
              size="sm"
              variant="ghost"
              className="flex items-center gap-1 font-normal flex-1"
            >
              <MessageSquareIcon />
              <span>Comment</span>
            </Button>
          </div>

          <Divider className="my-2" />
          {openComments && (
            <>
              <form
                className="flex gap-1 w-full items-center"
                onSubmit={handleNewComment}
              >
                <div className="relative w-6 h-6">
                  <Image
                    src={opinion.author?.image!}
                    alt="profile"
                    fill
                    className="rounded-full"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <TextareaAutosize
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Submit your comment"
                  className="flex-1 items-center px-3 py-2 bg-gray-200 block rounded-full border-0 resize-none  cursor-pointer focus:ring-0"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleNewComment(e);
                    }
                  }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  type="submit"
                  disabled={commentText.length === 0}
                >
                  <SendIcon
                    className={cn({
                      "text-blue-500": commentText.length > 0,
                    })}
                  />
                </Button>
              </form>
              <div className="commentsContainer mt-4">
                <Divider className="my-2" />
                {opinion.comments?.map((comment, index) => (
                  <div key={comment.id} className="mb-4">
                    <div className="flex items-center gap-2">
                      <div className="relative w-8 h-8">
                        <Image
                          src={comment?.authorImage ?? IMAGE_PLACEHOLER_URL}
                          blurDataURL={IMAGE_PLACEHOLER_URL}
                          alt="Profile"
                          fill
                          className="rounded-full"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <span className="text-base font-medium">
                        {comment.authorName}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {comment.comment}
                    </p>
                    {index !== opinion?.comments!.length - 1 && (
                      <div className="my-2 border-b border-gray-300" />
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
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
