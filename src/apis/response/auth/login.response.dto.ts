import ResponseDTO from "../response.dto";

export default interface LoginResponseDTO extends ResponseDTO {
    token: string;
    expirationTime: number;
}