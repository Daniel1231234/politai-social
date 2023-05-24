import prisma from "@/lib/prismadb";
import getSession from "./getSession";
import { capitalizeName } from "@/helpers";

const getCurrentUser = async () => {
  try {
    const session = await getSession();
    if (!session?.user?.email) {
      return null
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string
      },
      include: {
        opinions: true
      }
    });

    if (!currentUser) return null


    const capUserName: string = capitalizeName(currentUser.name!)
    const userToReturn = Object.assign({}, currentUser, { name: capUserName })

    return userToReturn


  } catch (error: any) {
    return null;
  }
};

export default getCurrentUser;
