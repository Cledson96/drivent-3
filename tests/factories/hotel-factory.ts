import { prisma } from "@/config";
import { Hotel } from "@prisma/client";

export  function createHotel(): Promise< Hotel > {
  return prisma.hotel.create({
    data: {
      name: "Cledson Santos",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjnaEDgu2qoIAcPYZV-xcU8Q6UeNLUcD1x1JOnvRuPIw&s",
      Rooms: {
        createMany: {
          data: [
            {
              name: "cledson",
              capacity: 1,
            },
            {
              name: "santos",
              capacity: 2,
            },
          ],
        },
      },
    },
    include: {
      Rooms: true,
    },
  })
}