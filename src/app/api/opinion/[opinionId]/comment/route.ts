import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prismadb";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

interface ParamsProps {
    params: { opinionId: string };
}

export async function POST(req: Request, { params }: ParamsProps) {
    try {
        const opinionId = params.opinionId
        const { commentText } = await req.json();
        const currUser = await getCurrentUser()

        if (!currUser) {
            return new Response("Unauthorized", { status: 400 });
        }


        if (!commentText || !opinionId) {
            return new Response("Missing required fields", { status: 400 });
        }

        const newComment = await prisma.comment.create({
            data: {
                opinionId,
                comment: commentText,
                authorId: currUser?.id,
                authorImage: currUser?.image!,
                authorName: currUser.name
            }
        });

        await Promise.all([
            prisma.opinion.update({
                where: { id: opinionId },
                data: {
                    comments: {
                        connect: { id: newComment.id }
                    }
                }
            }),
            pusherServer.trigger(toPusherKey(`opinion:${opinionId}:new_comment`), "new_comment_channel", newComment)

        ])



        return new Response("Comment created successfully", { status: 200 });
    } catch (err) {
        console.error("Error creating comment:", err);
        return new Response("Internal Server Error", { status: 500 });
    }
}



