import { create } from "zustand";

interface PostsStore {
    title: string;
    content: string;
    postsImageFileList: File[];
    setTitle: (title: string) => void;
    setContent: (content: string) => void;
    setPostsImageFileList: (postsImageFileList: File[]) => void;
    resetPosts: () => void;
}


const usePostsStore = create<PostsStore>(set => ({
    title: '',
    content: '',
    postsImageFileList: [],
    setTitle: (title) => set(state => ({...state, title})),
    setContent: (content) => set(state => ({...state, content})),
    setPostsImageFileList: (postsImageFileList) => set(state => ({...state, postsImageFileList})),
    resetPosts: () => set(state => ({...state, title: '', content: '', postsImageFileList: []}))
}));

export default usePostsStore;