import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prismadb";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { NextResponse } from "next/server";

interface ParamsProps {
    params: { opinionId: string };
}

export async function POST(req: Request, { params }: ParamsProps) {
    try {
        const opinionId = params.opinionId
        console.log('OpinionId => ', opinionId)
        const newLikeData = await req.json();

        const newLike = await prisma.like.create({
            data: {
                opinion: { connect: { id: opinionId } },
                authorId: newLikeData.authorId,
                authorName: newLikeData.authorName,
                authorImage: newLikeData.authorImage
            }
        })

        await pusherServer.trigger(opinionId, "like:new", newLike)

        return new NextResponse("Like created successfully", { status: 200 });
    } catch (err) {
        console.error("Error creating like:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}






