import { IPostsListItem } from "types/interface";
import ResponseDTO from "../response.dto";

export default interface GetSearchPostsListResponseDTO extends ResponseDTO {
    searchList: IPostsListItem[];
}