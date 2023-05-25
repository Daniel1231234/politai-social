import prisma from "@/lib/prismadb";

const getTotalOpinions = async () => {
    try {
        const opinions = await prisma.opinion.findMany({
            orderBy: {
                createdAt: "asc",
            },
            include: {
                author: true,
                comments: true
            }
        });

        return opinions;
    } catch (err) {
        return [];
    }
};

export default getTotalOpinions;
