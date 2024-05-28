import { IUser } from "types/interface";
import ResponseDTO from "../response.dto";

export default interface GetLoginUserResponseDTO extends ResponseDTO, IUser {
    
}
