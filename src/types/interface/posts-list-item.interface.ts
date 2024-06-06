export default interface IPostsListItem {
    postsNumber: number;
    title: string;
    content: string;
    postsTitleImage: string | null;
    favoriteCount: number;
    commentCount: number;
    viewCount: number;
    writeDatetime: string;
    writerNickname: string;
    writerProfileImage: string | null;
}