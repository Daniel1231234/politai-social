import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prismadb";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

interface ParamsProps {
    params: { opinionId: string, likeId: string };
}

export async function DELETE(req: Request, { params }: ParamsProps) {
    try {
        const likeId = params.likeId
        await Promise.all([
            prisma.like.delete({
                where: { id: likeId }
            }),
            pusherServer.trigger(params.opinionId, 'like:delete', likeId)

        ])

        return new NextResponse('OK')
    } catch (err) {
        console.log(err)
        return new NextResponse('We are having problem deleting your like')
    }
}