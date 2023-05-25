import { User } from "@prisma/client"


export interface Opinion {
    id: string
    title: string
    body: string
    topics: string[]
    author: User
    authorId: string
    createdAt: Date
}
