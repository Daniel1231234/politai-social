"use client";

import Button from "@/components/ui/Button";
import Divider from "@/components/ui/Divider";
import { formatedDistance } from "@/helpers";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { cn } from "@/lib/utils";
import { OpinionSchema } from "@/types/opinionType";
import { Comment, Like, User } from "@prisma/client";
import axios from "axios";
import {
  MessageSquareIcon,
  SendIcon,
  ThumbsUpIcon,
  UserPlus2Icon,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useRef, useState, useCallback, useEffect } from "react";
import { toast } from "react-hot-toast";
import TextareaAutosize from "react-textarea-autosize";
import UndoOpinion from "./UndoOpinion";
import LoadingModal from "@/components/modals/LoadingModal";
import { pusherClient } from "@/lib/pusher";

interface OpinionPreviewProps {
  opinion: OpinionSchema;
  isFriends: boolean;
  isUserOpinion: boolean;
  hideOpinion: (opinion: OpinionSchema) => void;
  addFriend: (userToAdd: User) => Promise<void>;
  isUndo: boolean;
  handleUndo: any;
  loggedinUser: User;
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
  loggedinUser,
}) => {
  const router = useRouter();
  const [commentText, setCommentText] = useState<string>("");
  const [openComments, setOpenComments] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currOpinion, setCurrOpinion] = useState<OpinionSchema>(opinion);

  const opinionRef = useRef<HTMLDivElement | null>(null);

  const isUserAllreadyLike = currOpinion.likes.some(
    (like) => like.authorId === loggedinUser.id
  );

  const handleCloseComments = useCallback(() => setOpenComments(false), []);

  useOnClickOutside(opinionRef, handleCloseComments);

  useEffect(() => {
    if (!currOpinion) return;
    pusherClient.subscribe(currOpinion.id);

    const handleNewComment = (newComment: Comment) => {
      setCurrOpinion((prevOpinion) => {
        // Only update comments if the new comment belongs to the current opinion
        if (prevOpinion.id === newComment.opinionId) {
          const updatedComments = [...prevOpinion.comments, newComment];
          return { ...prevOpinion, comments: updatedComments };
        }
        return prevOpinion;
      });
    };

    const handleDeleteComment = (commentId: string) => {
      setCurrOpinion((prevOpinion) => {
        // Only update comments if the deleted comment belongs to the current opinion
        const updatedComments = prevOpinion.comments.filter(
          (comment) => comment.id !== commentId
        );
        return { ...prevOpinion, comments: updatedComments };
      });
    };

    const handleNewLike = (newLike: Like) => {
      setCurrOpinion((prevOpinion) => {
        // Only update likes if the new like belongs to the current opinion
        if (prevOpinion.id === newLike.opinionId) {
          const updatedLikes = [...prevOpinion.likes, newLike];
          return { ...prevOpinion, likes: updatedLikes };
        }
        return prevOpinion;
      });
    };

    const handleDeleteLike = (likeId: string) => {
      setCurrOpinion((prevOpinion) => {
        // Only update likes if the deleted like belongs to the current opinion
        const updatedLikes = prevOpinion.likes.filter(
          (like) => like.id !== likeId
        );
        return { ...prevOpinion, likes: updatedLikes };
      });
    };

    pusherClient.bind("comment:new", handleNewComment);
    pusherClient.bind("comment:delete", handleDeleteComment);
    pusherClient.bind("like:new", handleNewLike);
    pusherClient.bind("like:delete", handleDeleteLike);

    return () => {
      pusherClient.unsubscribe(currOpinion.id);
      pusherClient.unbind("comment:new", handleNewComment);
      pusherClient.unbind("comment:delete", handleDeleteComment);
      pusherClient.unbind("like:new", handleNewLike);
      pusherClient.unbind("like:delete", handleDeleteLike);
    };
  }, [currOpinion]);

  const handleNewComment = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(`/api/opinion/${currOpinion.id}/comment`, {
        commentText,
      });
      setCommentText("");
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (
    e: React.MouseEvent<HTMLButtonElement>,
    commentid: string
  ) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      await axios.delete(`/api/opinion/${currOpinion.id}/comment/${commentid}`);
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewLike = async () => {
    try {
      if (isUserAllreadyLike) return;

      const newLike = {
        authorName: loggedinUser.name,
        authorId: loggedinUser.id,
        authorImage: loggedinUser.image,
      };

      await axios.post(`/api/opinion/${currOpinion.id}/like`, newLike);
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleDeleteLike = async (likes: Like[]) => {
    try {
      console.log(likes);
      const likeToDelete = likes.find(
        (like) => like.authorId === loggedinUser.id
      );
      console.log(likeToDelete);
      if (!likeToDelete) return;
      const res = await axios.delete(
        `/api/opinion/${currOpinion.id}/like/${likeToDelete.id}`
      );
      console.log(res);
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  if (isLoading) return <LoadingModal />;
  return (
    <div
      className="opinion-container px-5 py-4 relative bg-white shadow rounded-lg w-full"
      ref={opinionRef}
    >
      {!isUndo ? (
        <>
          <div className="flex items-center gap-1 absolute top-2 right-2">
            {!isFriends && !isUserOpinion && (
              <button
                className="p-1 text-gray-500 hover:bg-gray-50 hover:rounded-full"
                onClick={() => addFriend(currOpinion.author)}
              >
                <UserPlus2Icon className="h-6 w-6 cursor-pointer" />
              </button>
            )}
            <button
              onClick={() => hideOpinion(currOpinion)}
              className={`p-1 text-gray-500 hover:bg-gray-50 hover:rounded-full`}
              title="close"
              type="button"
            >
              <X className="h-6 w-6 cursor-pointer" />
            </button>
          </div>

          <div className="user-profile-section relative flex mb-4">
            <Image
              placeholder="blur"
              blurDataURL={IMAGE_PLACEHOLER_URL}
              width={48}
              height={48}
              className="rounded-full"
              src={currOpinion?.author?.image ?? IMAGE_PLACEHOLER_URL}
              alt="User Profile"
            />
            <div
              className="ml-2 mt-0.5 cursor-pointer"
              onClick={() =>
                router.push(`/feed/profile/${currOpinion?.authorId}`)
              }
            >
              <span className="block font-medium text-base leading-snug text-black">
                {currOpinion?.author?.name}
              </span>
              <span className="block text-sm text-gray-500 font-light leading-snug">
                {formatedDistance(currOpinion.createdAt)}
              </span>
            </div>
          </div>

          <p className="opinion-text text-gray-800 leading-snug md:leading-normal">
            {currOpinion?.body}
          </p>

          <Divider className="my-2" />

          <div className="flex justify-between items-center">
            <div
              className="flex"
              onClick={() => handleDeleteLike(currOpinion.likes)}
            >
              <ThumbsUpIcon
                className={cn(
                  `p-1 rounded-full bg-blue-400 shadow-md text-white`,
                  {
                    "bg-blue-400": !isUserAllreadyLike,
                    "bg-blue-600": isUserAllreadyLike,
                  }
                )}
              />
              <span className="ml-1 text-gray-500 font-light">
                {currOpinion?.likes?.length ?? 0}
              </span>
            </div>
            <div className="flex">
              <p className="text-gray-600 text-sm font-light">
                {currOpinion?.comments?.length ?? 0} comments
              </p>
            </div>
          </div>

          <Divider className="my-2" />

          <div className="flex items-center justify-between w-full">
            <Button
              onClick={() => {
                if (isUserAllreadyLike) {
                  handleDeleteLike(currOpinion.likes);
                } else {
                  handleNewLike();
                }
              }}
              title="like"
              size="sm"
              variant="ghost"
              className="flex items-center gap-1 font-normal flex-1"
            >
              <ThumbsUpIcon />
              <span>{isUserAllreadyLike ? "Unlike" : "Like"}</span>
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
                    placeholder="blur"
                    blurDataURL={IMAGE_PLACEHOLER_URL}
                    src={loggedinUser.image!}
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
                  isLoading={isLoading}
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
                {currOpinion.comments.map((comment) => (
                  <div key={comment.id} className="mb-4 relative">
                    {loggedinUser.id === comment.authorId && (
                      <button
                        onClick={(e) => handleDeleteComment(e, comment.id)}
                        className="absolute top-2 right-2 p-1 text-gray-500 hover:bg-gray-50 hover:rounded-full"
                        title="delete comment"
                        type="button"
                      >
                        <X className="h-4 w-4 font-thin" />
                      </button>
                    )}
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
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <UndoOpinion handleUndo={handleUndo} opinion={currOpinion} />
      )}
    </div>
  );
};

export default OpinionPreview;
