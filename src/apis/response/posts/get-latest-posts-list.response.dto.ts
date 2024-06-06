import { IPostsListItem } from "types/interface";
import ResponseDTO from "../response.dto";

export default interface GetLatestPostsListResponseDTO extends ResponseDTO {
    latestList: IPostsListItem[];
}