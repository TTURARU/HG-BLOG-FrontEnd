export default interface IPosts{
    postsNumber: number;
    title: string;
    content: string;
    postsImageList: string[];
    writeDatetime: string;
    writerEmail: string;
    writerNickname: string;
    writerProfileImage: string | null;
    
    viewCount: number;
}