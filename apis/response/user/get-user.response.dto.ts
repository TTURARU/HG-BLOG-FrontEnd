import { IUser } from "types/interface";
import ResponseDTO from "../response.dto";

export default interface GetUserResponseDTO extends ResponseDTO, IUser {

}