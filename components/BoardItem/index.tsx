import React from 'react'
import './style.css';
import { IPostsListItem } from 'types/interface'
import { useNavigate } from 'react-router-dom';
import { POSTS_DETAIL_PATH, POSTS_PATH } from 'constant';
import defaultProfileImage from 'assets/images/default-profile-image.png';

//#         Props 인터페이스            //
interface Props {
    postsListItem: IPostsListItem
} //* Props */
//#         PostsItem 컴포넌트            //
export default function PostsItem({postsListItem}:Props) {
  //#           postsListItem 속성            //
  const {postsNumber, title, content, postsTitleImage} = postsListItem;
  const {commentCount, viewCount, favoriteCount} = postsListItem;
  const {writeDatetime, writerNickname, writerProfileImage} = postsListItem;
  //#           네비게이트 함수             //
  const navigate = useNavigate();
  //#           게시물 아이템이 클릭되었을 때 상세 게시물로 이동하는 함수             //
  const onClickHandler = () => {
    navigate(POSTS_PATH()+'/'+POSTS_DETAIL_PATH(postsNumber));
  }
  //#           PostsItem 렌더링            //
  return (
    <div className='posts-list-item' onClick={onClickHandler}>
        <div className='posts-list-item__main-box'>
            {/* 탑 */}
            <div className='posts-list-item__top'>
                <div className='posts-list-item__profile-box'>
                    <div className='posts-list-item__profile-image' style={{backgroundImage: `url(${writerProfileImage ? writerProfileImage : defaultProfileImage})`}}></div>
                </div>
                <div className='posts-list-item__write-box'>
                    <div className='posts-list-item__nickname'>{writerNickname}</div>
                    <div className='posts-list-item__write-date'>{writeDatetime}</div>
                </div>
            </div>

            {/* 미들 */}
            <div className='posts-list-item__middle'>
                <div className='posts-list-item__title'>{title}</div>
                <div className='posts-list-item__content'>{content}</div>
            </div>

            {/* 바텀 */}
            <div className='posts-list-item__bottom'>
                <div className='posts-list-item__counts'>
                    {`댓글 ${commentCount} · 조회수 ${viewCount} · 좋아요 ${favoriteCount}`}
                </div>
            </div>
        </div>

        {/* 게시물에 이미지가 존재할 경우 이미지 표시 */}
        {postsTitleImage !== null && (
        <div className='posts-list-item__image-box'>
            <div className='posts-list-item__image' style={{backgroundImage: `url(${postsTitleImage})`}}></div>
        </div>
        )}
    </div>
  )
} //* postsItem */
