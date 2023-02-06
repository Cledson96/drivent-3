import { notFoundError} from "@/errors";
import { ApplicationError } from "@/protocols";
import hotelRepository from "@/repositories/hotel-repository";



async function verificationHotel(userId: number): Promise<void | ApplicationError> {
    const Ticket = await hotelRepository.findUserTicket(userId);

    if (!Ticket) throw notFoundError();

    const reproved = Ticket.status !== "PAID";

    const Remote = Ticket.TicketType.isRemote;

    const notHotel = !Ticket.TicketType.includesHotel;


    if (reproved || Remote || notHotel) throw () => {
        return {
            name: "PaymentError",
            message: "Payment is required!!!",
        }
    }
}

    async function getHotels(userId: number) {

        await verificationHotel(userId);

        const hotel = await hotelRepository.findHotels();

        if (!hotel) throw notFoundError();

        return hotel;
    }

    async function getHotel(hotelId: number, userId: number) {

        await verificationHotel(userId);

        const hotel = await hotelRepository.OneHotel(hotelId);
        if (!hotel) throw notFoundError();

        return hotel;
    }



    const hotelService = {
        getHotels,
        getHotel,
    };

    export default hotelService;