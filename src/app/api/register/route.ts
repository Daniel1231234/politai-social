import client from '@/lib/prismadb'
import bcrypt from 'bcrypt'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const { email, name, password } = await req.json()

    const hashPassword = await bcrypt.hash(password, 12)

    const newUser = await client.user.create({
        data: {
            email,
            name,
            image: "/images/placeholder.jpg",
            hashPassword,
            friendsRequests: [],
            friendsIds: [],
            opinionsIds: [],
            birthday: new Date(1, 1, 1980),
        }
    })

    return NextResponse.json(newUser)
}

