import prisma from "@/lib/prismadb";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { NextResponse } from "next/server";

interface ParamsProps {
    params: { commentId: string, opinionId: string }
}

export async function DELETE(req: Request, { params }: ParamsProps) {
    try {
        const { commentId, opinionId } = params

        const commentToDelete = await prisma.comment.findUnique({
            where: { id: commentId }
        })

        if (!commentToDelete) return new NextResponse('This comment not exist', { status: 400 })

        await Promise.all([
            prisma.comment.delete({
                where: { id: commentId }
            }),
            pusherServer.trigger(opinionId, 'comment:delete', commentToDelete.id)

        ])

        return new Response('OK');
    } catch (error) {
        // Handle any errors
        console.error(error);
        return new Response('Error', { status: 500 });
    }
}