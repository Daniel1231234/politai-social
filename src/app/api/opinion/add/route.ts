import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        const body = await req.json();
        if (!user?.id || !user?.email) return new NextResponse('Unauthorized', { status: 401 });

        await prisma.opinion.create({
            data: {
                title: 'Opinion title',
                body: body.opinion,
                topics: body.topics,
                author: {
                    connect: { id: user.id },
                },
                likes: {},
                comments: {}
            },
        });


        return new NextResponse('OK')
    } catch (err) {
        console.error(err);
        return new NextResponse('Error', { status: 500 });
    }
}
