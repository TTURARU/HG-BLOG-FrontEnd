import { IPostsListItem } from "types/interface";
import ResponseDTO from "../response.dto";

export default interface GetUserPostsListResponseDTO extends ResponseDTO {
    userPostsList: IPostsListItem[];
}