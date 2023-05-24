import prisma from "@/lib/prismadb";
import getSession from "./getSession";
import { capitalizeName } from "@/helpers";

const getUserById = async (userId: string) => {
    try {
        const session = getSession()
        if (!session) return null

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                opinions: true,
            }
        })

        if (!user) return null

        const capUserName: string = capitalizeName(user.name!)
        const userToReturn = Object.assign({}, user, { name: capUserName })

        return userToReturn

    } catch (err) {
        console.log(err)
    }
}

export default getUserById