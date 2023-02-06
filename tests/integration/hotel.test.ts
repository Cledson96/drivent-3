import app, { init } from "@/app"
import { prisma } from "@/config";
import supertest from "supertest";
import { createEnrollmentWithAddress, createUser } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";
import { TicketStatus } from "@prisma/client";
import faker from "@faker-js/faker";
import { Hotel, Room } from "@prisma/client";

beforeAll(async () => {
    await init();
})

beforeEach(async () => {
    await cleanDb();
})
function ticket(ticketTypeId: number, status: TicketStatus, enrollmentId: number) {
    return prisma.ticket.create({
        data: {
            enrollmentId,
            ticketTypeId,
            status,
        },
    });
}

function tickettype(isRemote: boolean, includesHotel: boolean) {
    return prisma.ticketType.create({
        data: {
            name: faker.name.findName(),
            price: faker.datatype.number(),
            isRemote,
            includesHotel,
        },
    });
}

function create_hotels(): Promise<Hotel & { Rooms: Room[] }> {

    return (prisma.hotel.create({
        data: {
            name: faker.name.findName(),
            image: faker.image.avatar(),
            Rooms: {
                createMany: {
                    data: [
                        {
                            name: faker.name.firstName(),
                            capacity: faker.datatype.number({ min: 1, max: 2 }),
                        },
                        {
                            name: faker.name.firstName(),
                            capacity: faker.datatype.number({ min: 1, max: 2 }),
                        },
                    ],
                },
            },
        },
        include: {
            Rooms: true,
        },
    })
    )

}

const server = supertest(app);

describe("GET /hotels", () => {

    it("token null", async () => {

        const res = await server.get("/hotels");

        expect(res.status).toBe(401);
    });


    it("token invalid", async () => {
        const tokenFake = faker.lorem.word();

        const res = await server.get("/hotels").set("Authorization", `Bearer ${tokenFake}`);

        expect(res.status).toBe(401);
    })

    it("user not enrolment", async () => {

        const token = await generateValidToken();
        const res = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

        expect(res.status).toEqual(404);

    })
    it("user not have ticket", async () => {
        const user = await createUser();

        const token = await generateValidToken(user);

        await createEnrollmentWithAddress(user);

        const res = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

        expect(res.status).toEqual(404);


    })



    it("not hotel include", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await tickettype(false, false);
        await ticket(ticketType.id, 'RESERVED', enrollment.id);

        const res = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(400);
    });

    it("ok", async () => {

        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await tickettype(false, true);

        await ticket(ticketType.id, "PAID", enrollment.id);

        const res = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
    });

    it("hotel OK", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await tickettype(false, true);
        await ticket(ticketType.id, "PAID", enrollment.id);

        await create_hotels();

        const res = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200)

        expect(res.body).toEqual(
            expect.arrayContaining([
                {
                    id: expect.any(Number),
                    name: expect.any(String),
                    image: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                },
            ]),
        );
    });
});


