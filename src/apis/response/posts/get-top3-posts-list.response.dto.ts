import { IPostsListItem } from "types/interface";
import ResponseDTO from "../response.dto";

export default interface GetTop3PostsListResponseDTO extends ResponseDTO {
    top3List: IPostsListItem[];
}