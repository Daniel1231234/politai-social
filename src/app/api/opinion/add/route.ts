import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prismadb";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        const body = await req.json();
        if (!user?.id || !user?.email) return new NextResponse('Unauthorized', { status: 401 });

        const newOpinion = await prisma.opinion.create({
            data: {
                title: 'Opinion title',
                body: body.opinion,
                topics: body.topics,
                author: {
                    connect: { id: user.id },
                },
            },
        });

        await prisma.user.update({
            where: { id: user.id },
            data: {
                opinions: {
                    connect: { id: newOpinion.id },
                },
            },
        });

        await pusherServer.trigger("new-opinion-channel", "new-opinion", newOpinion)



        return new NextResponse('OK')
    } catch (err) {
        console.error(err);
        return new NextResponse('Error', { status: 500 });
    }
}
