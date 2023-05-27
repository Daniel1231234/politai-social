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
        const newLike = await req.json();

        const opinion = await prisma.opinion.findUnique({
            where: { id: opinionId }
        })

        if (!newLike || !opinion) {
            return new Response("Missing required fields", { status: 400 });
        }

        await Promise.all([
            prisma.opinion.update({
                where: { id: opinionId },
                data: {
                    likes: { set: [...opinion.likes, newLike] }
                }
            }),
            pusherServer.trigger(toPusherKey(`opinion:${opinionId}:new_like`), "new_like_channel", newLike)
        ])

        return new Response("Like created successfully", { status: 200 });
    } catch (err) {
        console.error("Error creating like:", err);
        return new Response("Internal Server Error", { status: 500 });
    }
}



