import ResponseDTO from "../response.dto";

export default interface GetPopularListResponseDTO extends ResponseDTO {
    popularWordList: string[];
}