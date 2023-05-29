import { Like, Opinion, User, Comment } from "@prisma/client";

export interface OpinionSchema extends Opinion {
    author: User
    comments: Comment[]
    likes: Like[]
}