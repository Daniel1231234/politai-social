import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prismadb";

export async function POST(req: Request) {
    try {
        const { commentText, opinionId } = await req.json();
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
                authorImage: currUser?.image!,
                authorName: currUser.name
            }
        });

        // Update the corresponding Opinion with the new comment
        await prisma.opinion.update({
            where: { id: opinionId },
            data: {
                comments: {
                    connect: { id: newComment.id }
                }
            }
        });

        return new Response("Comment created successfully", { status: 200 });
    } catch (err) {
        console.error("Error creating comment:", err);
        return new Response("Internal Server Error", { status: 500 });
    }
}
