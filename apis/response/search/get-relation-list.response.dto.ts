import ResponseDTO from "../response.dto";

export default interface GetRelationListResponseDTO extends ResponseDTO {
    relationWordList: string[];
}