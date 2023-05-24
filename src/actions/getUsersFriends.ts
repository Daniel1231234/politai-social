import prisma from "@/lib/prismadb"
import { User } from "@prisma/client"
import getUserById from "./getUserById"


const getUserFriends = async (user: User) => {
    try {
        const dbCurrUser = await prisma.user.findUnique({
            where: { id: user.id }
        })
        if (!dbCurrUser) return null

        const friendsIds = dbCurrUser.friendsIds
        const friends = await prisma.user.findMany({
            where: {
                id: {
                    in: friendsIds
                }
            }
        })

        return friends

    } catch (err) {
        console.log(err)
    }

}

export default getUserFriends