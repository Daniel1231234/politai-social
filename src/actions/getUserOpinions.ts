import prisma from "@/lib/prismadb";

const getUserOpinions = async (userId: string) => {
    try {
        const opinions = await prisma.opinion.findMany({
            where: {
                authorId: userId,
            },
            orderBy: {
                createdAt: "asc",
            },
        });
        return opinions;
    } catch (err) {
        return [];
    }
};

export default getUserOpinions;
