import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import hotelService from "@/services/hotel-service";




export async function getHotels(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    try {
        const hotels = await hotelService.getHotels(userId);

        return res.status(200).send(hotels);
    } catch (error) {
        if (error.name === "PaymentRequiredError") {
            return res.sendStatus(402);
        }
        if (error.name === "NotFoundError") {
            return res.sendStatus(404);
        }
        return res.sendStatus(400);
    }
}


export async function getHotelId(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const {hotelId} = req.params
    try {
        const hotels = await hotelService.getHotel(Number(hotelId), userId);

        return res.status(200).send(hotels);
    } catch (error) {
        if (error.name === "PaymentRequiredError") {
            return res.sendStatus(402);
        }
        if (error.name === "NotFoundError") {
            return res.sendStatus(404);
        }
        return res.sendStatus(400);
    }
}