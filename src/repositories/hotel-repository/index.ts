import { prisma } from "@/config";

async function findUserTicket(userId: number) {
    return prisma.ticket.findFirst({
        where: {
            Enrollment: {
                userId,
            },
        },
        include: {
            Enrollment: true,
            TicketType: true,
        }
    });
}

async function findHotels() {
    return prisma.hotel.findMany();
}

async function OneHotel(hotelId: number) {

    return prisma.hotel.findUnique({
        where: {
            id: hotelId,
        },
        include: {
            Rooms: true,
        }
    });
}



const hotelRepository = {
    findHotels,
    OneHotel,
    findUserTicket,
};

export default hotelRepository;