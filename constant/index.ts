export const MAIN_PATH = () => '/';
export const AUTH_PATH = () => '/auth';
export const SEARCH_PATH = (searchWord: string) => `/search/${searchWord}`;
export const USER_PATH = (userEmail: string) => `/user/${userEmail}`;
export const POSTS_PATH = () => '/posts';
export const POSTS_DETAIL_PATH = (postsNumber: string | number) => `detail/${postsNumber}`;
export const POSTS_CREATE_PATH = () => 'creates';
export const POSTS_EDIT_PATH = (postsNumber: string | number) => `edit/${postsNumber}`;