import axios, { Axios, AxiosRequestConfig, AxiosResponse } from "axios";
import { ResponseDTO } from "./response";
import { LoginRequestDTO, SignUpRequestDTO } from "./request/auth";
import { LoginResponseDTO, SignUpResponseDTO } from "./response/auth";
import GetLoginUserResponseDTO from "./response/user/get-login-user.response.dto";
import EditPostsResponseDTO from "./response/posts/edit-posts.response.dto";
import EditPostsRequestDTO from "./request/posts/edit-posts.request.dto";
import CreatePostsResponseDTO from "./response/posts/create-posts.response.dto";
import CreatePostsRequestDTO from "./request/posts/create-posts.request.dto";
import DeletePostsResponseDTO from "./response/posts/delete-posts.response.dto";
import detailPostsResponseDTO from "./response/posts/detail-posts.response.dto";
import GetFavoriteListResponseDTO from "./response/posts/get-favorite-list.response.dto";
import CreateCommentRequestDTO from "./request/posts/create-comment.request.dto";
import CreateCommentResponseDTO from "./response/posts/create-comment.response.dto";
import GetCommentListResponseDTO from "./response/posts/get-comment-list.response.dto";
import PutFavoriteResponseDTO from "./response/posts/put-favorite.response.dto";
import IncreaseViewCountResponseDTO from "./response/posts/increase-view-count.response.dto";
import GetLatestPostsListResponse from "./response/posts/get-latest-posts-list.response.dto";
import GetLatestPostsListResponseDTO from "./response/posts/get-latest-posts-list.response.dto";
import { DeleteCommentResponseDTO, GetSearchPostsListResponseDTO, GetTop3PostsListResponseDTO } from "./response/posts";
import { GetPopularListResponseDTO, GetRelationListResponseDTO } from "./response/search";
import GetUserResponseDTO from "./response/user/get-user.response.dto";
import EditNicknameRequestDTO from "./request/user/edit-nickname.request.dto";
import EditNicknameResponseDTO from "./response/user/edit-nickname.response.dto";
import EditProfileImageRequestDTO from "./request/user/edit-profile-image.request.dto";
import EditProfileImageResponseDTO from "./response/user/edit-profile-image.response.dto";
import GetUserPostsListResponseDTO from "./response/posts/get-user-posts-list.response.dto";

const DOMAIN = 'http://localhost:4000';
const API_DOMAIN = `${DOMAIN}/api`;

const FILE_DOMAIN = `${DOMAIN}/file`;
const FILE_UPLOAD_DOMAIN = () => `${FILE_DOMAIN}/upload`;
const multipartFormData = {headers: {'Content-Type': 'multipart/form-data'}};

const authorization = (accessToken: string) => {
    return {headers: {Authorization: `Bearer ${accessToken}`}}
}; //* authorization //

//# requestHandler
const requestHandler = async <T>(method: 'get' | 'post' | 'patch' | 'put' | 'delete', url: string, data?: any, config?: AxiosRequestConfig): Promise<T | ResponseDTO | null> => {
    try {
        const response: AxiosResponse<T> = await axios({ method, url, data, ...config });
        return response.data;
    } catch (error) {
        const err = error as any;
        if (!err.response) return null;
        const responseBody: ResponseDTO = err.response.data;
        return responseBody;
    }
}; //* requestHandler */


//# 회원가입 요청
export const signUpRequest = async (requestBody: SignUpRequestDTO) => {
    return requestHandler<SignUpResponseDTO>('post', `${API_DOMAIN}/auth/sign-up`, requestBody);
}; //* signUpRequest //


//# 로그인 요청
export const loginRequest = async (requestBody: LoginRequestDTO) => {
    return requestHandler<LoginResponseDTO>('post', `${API_DOMAIN}/auth/login`, requestBody);
}; //* loginRequest //

//# 로그인 유저 요청
export const getLoginUserRequest = async (accessToken: string) => {
    return requestHandler<GetLoginUserResponseDTO>('get', `${API_DOMAIN}/user`, null, authorization(accessToken));
}; //* getLoginUserRequest */

//# 유저 정보 요청
export const getUserRequest = async (email: string) => {
    return requestHandler<GetUserResponseDTO>('get',`${API_DOMAIN}/user/${email}`);
}

//# 게시물 상세 요청
export const detailPostsRequest = async (postsNumber: number | string) => {
    return requestHandler<detailPostsResponseDTO>('get', `${API_DOMAIN}/posts/${postsNumber}`);
}

//# 게시물 작성 요청
export const createPostsRequest = async (requestBody: CreatePostsRequestDTO, accessToken: string) => {
    return requestHandler<CreatePostsResponseDTO>('post', `${API_DOMAIN}/posts`, requestBody, authorization(accessToken));
}; //* postPostsRequest */

//# 게시물 수정 요청
export const editPostsRequest = async (postsNumber: number | string, requestBody: EditPostsRequestDTO, accessToken: string) => {
    return requestHandler<EditPostsResponseDTO>('patch', `${API_DOMAIN}/posts/${postsNumber}`, requestBody, authorization(accessToken));
}; //* editPostsRequest */

//# 게시물 삭제 요청
export const deletePostsRequest = async (postsNumber: number | string, accessToken: string) => {
    return requestHandler<DeletePostsResponseDTO>('delete', `${API_DOMAIN}/posts/${postsNumber}`, {}, authorization(accessToken));
}; //* deletePostsRequest */

//# 좋아요 누르기 요청
export const putFavoriteRequest = async (postsNumber: number | string, accessToken: string) => {
    return requestHandler<PutFavoriteResponseDTO>('put', `${API_DOMAIN}/posts/${postsNumber}/favorite`, {}, authorization(accessToken));
}; //* putFavoriteRequest */

//# 좋아요 리스트 요청
export const getFavoriteListRequest = async (postsNumber: number | string) => {
    return requestHandler<GetFavoriteListResponseDTO>('get', `${API_DOMAIN}/posts/${postsNumber}/favorite-list`);
}; //* getFavoriteListRequest */

//# 댓글 작성 요청
export const createCommentRequest = async (postsNumber: number | string, requestBody: CreateCommentRequestDTO, accessToken: string) => {
    return requestHandler<CreateCommentResponseDTO>('post', `${API_DOMAIN}/posts/${postsNumber}/comment`, requestBody, authorization(accessToken));
}; //* createCommentRequest */

//# 댓글 리스트 요청
export const getCommentListRequest = async (postsNumber: number | string) => {
    return requestHandler<GetCommentListResponseDTO>('get', `${API_DOMAIN}/posts/${postsNumber}/comment-list`);
}; //* getCommentListRequest */

//# 댓글 삭제 요청
export const deleteCommentRequest = async (commentNumber: number | string, accessToken: string) => {
    return requestHandler<DeleteCommentResponseDTO>('delete', `${API_DOMAIN}/posts/${commentNumber}/comment`, {}, authorization(accessToken));
}; //* deleteCommentListRequest */

//# 조회수 증가 요청
export const increaseViewCountRequest = async (postsNumber: number | string) => {
    return requestHandler<IncreaseViewCountResponseDTO>('get', `${API_DOMAIN}/posts/${postsNumber}/increase-view-count`);
}; //* increaseViewCountRequest */

//# 최신 게시물 리스트 요청
export const getLatestPostsListRequest = async () => {
    return requestHandler<GetLatestPostsListResponseDTO>('get', `${API_DOMAIN}/posts/latest-list`);
} //* getLatestPostsListRequest */
//# TOP3 게시물 리스트 요청
export const getTop3PostsListRequest = async () => {
    return requestHandler<GetTop3PostsListResponseDTO>('get', `${API_DOMAIN}/posts/top-3`);
} //* getTop3PostsListRequest */

//# 검색 게시물 리스트 요청
export const getSearchPostsListRequest = async (searchWord: string, preSearchWord: string | null) => {
    const url = `${API_DOMAIN}/posts/search-list/${searchWord}${preSearchWord ? '/'+preSearchWord : ''}`;
    return requestHandler<GetSearchPostsListResponseDTO>('get', url);
} //* getSearchPostsListRequest */

//# 유저 게시물 리스트 요청
export const getUserPostsListRequest = async (email: string) => {
    return requestHandler<GetUserPostsListResponseDTO>('get', `${API_DOMAIN}/posts/user-posts-list/${email}`);
}

//# 인기 검색어 리스트 요청
export const getPopularListRequest = async () => {
    return requestHandler<GetPopularListResponseDTO>('get', `${API_DOMAIN}/search/popular-list`);
} //* getPopularListRequest */

//# 연관 검색어 리스트 요청
export const getRelationListRequest = async (searchWord: string) => {
    return requestHandler<GetRelationListResponseDTO>('get', `${API_DOMAIN}/search/${searchWord}/relation-list`);
} //* getRelationListRequest */

//# 닉네임 변경 요청
export const editNicknameRequest = async (requestBody: EditNicknameRequestDTO, accessToken: string) => {
    return requestHandler<EditNicknameResponseDTO>('patch', `${API_DOMAIN}/user/nickname`, requestBody, authorization(accessToken));
} //* editNicknameRequest */

//# 프로필 이미지 변경 요청
export const editProfileImageRequest = async (requestBody: EditProfileImageRequestDTO, accessToken: string) => {
    return requestHandler<EditProfileImageResponseDTO>('patch',`${API_DOMAIN}/user/profile-image`, requestBody, authorization(accessToken));
} //* editProfileImageRequest */

//# 파일 업로드 요청
export const fileUploadRequest = async (data: FormData) => {
    const result = await axios.post(FILE_UPLOAD_DOMAIN(), data, multipartFormData)
        .then(response => {
            const responseBody: string = response.data;
            return responseBody;
        })
        .catch(error => {
            return null;
        })
    return result;
}; //* fileUploadRequest */