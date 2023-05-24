import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prismadb";


export async function POST(req: Request) {
    try {
        const currUser = await getCurrentUser()
        if (!currUser) {
            return new Response('Unauthorized', { status: 400 })
        }

        const body = await req.json()
        console.log('body => ', body)
        const updatedUSER = await prisma.user.update({
            where: { id: currUser.id },
            data: {
                image: { set: body.newImageUrl }
            }
        })

        console.log('updatedUser => ', updatedUSER)

        return new Response('OK')
    } catch (err) {
        return new Response('Something went wrong', { status: 401 })
    }


}