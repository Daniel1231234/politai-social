import getCurrentUser from "@/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

interface ParamsProps {
    params: { friendId: string };
}

export async function DELETE(req: NextRequest, { params }: ParamsProps) {
    try {
        const idToRemove = params.friendId;
        const loggedInUser = await getCurrentUser();

        if (!loggedInUser) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const userWhoDelete = await prisma.user.findUnique({
            where: { id: loggedInUser.id },
        });

        if (!userWhoDelete) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const updatedUserWhoDeleteFriends = userWhoDelete.friendsIds.filter(
            (friendId) => friendId !== idToRemove
        );

        const deletedUser = await prisma.user.findUnique({
            where: { id: idToRemove },
        });

        if (!deletedUser) {
            return new NextResponse("Invalid user", { status: 400 });
        }

        const updatedDeletedUserFriends = deletedUser.friendsIds.filter(
            (friendId) => friendId !== loggedInUser.id
        );

        await Promise.all([
            prisma.user.update({
                where: { id: loggedInUser.id },
                data: {
                    friendsIds: { set: updatedUserWhoDeleteFriends },
                },
            }),
            prisma.user.update({
                where: { id: idToRemove },
                data: {
                    friendsIds: { set: updatedDeletedUserFriends },
                },
            }),
        ]);

        return new Response("User deleted successfully", { status: 200 });
    } catch (err) {
        return new Response("Something went wrong", { status: 400 });
    }
}
