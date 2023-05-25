import { Comment, User } from "@prisma/client"


type Like = {
    userId: string
    userName: string
}

export interface Opinion {
    id: string
    title: string
    body: string
    topics: string[]
    author: User
    authorId: string
    createdAt: Date
    comments?: Comment[]
    likes?: Like[]
}
