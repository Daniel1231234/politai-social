import prisma from "@/lib/prismadb";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

interface ParamsProps {
    params: { commentId: string, opinionId: string }
}

export async function DELETE(req: Request, { params }: ParamsProps) {
    try {
        const { commentId, opinionId } = params

        const commentToDelete = await prisma.comment.findUnique({
            where: { id: commentId }
        })

        await Promise.all([
            prisma.comment.delete({
                where: { id: commentId }
            }),
            pusherServer.trigger(toPusherKey(`opinion:${opinionId}:remove_comment`), "remove_comment_channel", commentToDelete)


        ])

        return new Response('OK');
    } catch (error) {
        // Handle any errors
        console.error(error);
        return new Response('Error', { status: 500 });
    }
}