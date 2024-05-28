export default interface ICommentListItem {
    nickname: string;
    profileImage: string | null;
    writeDatetime: string;
    content: string;
    commentNumber: number;
}