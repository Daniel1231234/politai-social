import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prismadb";
import { pusherServer } from "@/lib/pusher";

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
                comment: commentText,
                opinion: { connect: { id: opinionId } },
                authorId: currUser?.id,
                authorImage: currUser?.image!,
                authorName: currUser.name
            }
        });

        await pusherServer.trigger(opinionId, 'comment:new', newComment)

        return new Response("Comment created successfully", { status: 200 });
    } catch (err) {
        console.error("Error creating comment:", err);
        return new Response("Internal Server Error", { status: 500 });
    }
}



