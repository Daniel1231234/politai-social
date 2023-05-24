import getCurrentUser from "@/actions/getCurrentUser"
import prisma from "@/lib/prismadb"
import { pusherServer } from "@/lib/pusher"
import { toPusherKey } from "@/lib/utils"
import { FriendRequest } from "@prisma/client"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const currUser = await getCurrentUser()
        const isAlreadyFriends = currUser?.friendsIds.some((user) => user === body.id)

        const userToAdd = await prisma.user.findUnique({
            where: { id: body.id },
        })

        if (!userToAdd) return new Response('Unauthorized', { status: 400 })

        if (isAlreadyFriends) {
            return new Response('Already friends with this user', { status: 400 })
        }

        const senderData: FriendRequest = {
            senderId: currUser!.id,
            senderName: currUser!.name,
            senderImage: currUser!.image!
        }

        const handleUpdate = (prev: FriendRequest[]) => {
            return [...prev, senderData]
        }

        const updatedFriendRequestField = handleUpdate(userToAdd.friendsRequests)

        await prisma.user.update({
            where: {
                id: userToAdd.id
            },
            data: {
                friendsRequests: updatedFriendRequestField
            }
        })

        await pusherServer.trigger(
            toPusherKey(`user:${userToAdd.id}:incoming_friend_requests`),
            'incoming_friend_requests',
            senderData
        )


        return new NextResponse('OK')
    } catch (err) {
        console.error(err)
        return new Response('Internal Server Error', { status: 500 })
    }
}
