import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prismadb";

export async function POST(req: Request) {
    try {
        const { senderId } = await req.json();
        const loggedInUser = await getCurrentUser();

        const sender = await prisma.user.findUnique({
            where: { id: senderId }
        })

        if (!sender) return new Response("Invalid user", { status: 400 })
        if (!loggedInUser) return new Response("Unauthorized", { status: 400 })


        const receiver = await prisma.user.findUnique({
            where: { id: loggedInUser.id },
        });

        if (!receiver) return new Response("Unauthorized", { status: 400 })

        const updatedFriendRequestsField = receiver.friendsRequests.filter((request) => request.senderId !== sender.id)


        await prisma.user.update({
            where: { id: receiver.id },
            data: {
                friendsRequests: { set: updatedFriendRequestsField }
            }
        })

        return new Response("OK");
    } catch (err) {
        console.error(err);
        return new Response("Invalid request", { status: 400 });
    }
}
