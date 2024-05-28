import { POSTS_DETAIL_PATH, POSTS_PATH } from 'constant';
import React from 'react'
import './style.css';
import defaultProfileImage from 'assets/images/default-profile-image.png';
import { useNavigate } from 'react-router-dom';
import { IPostsListItem } from 'types/interface'

//#             Props 인터페이스            //
interface Props{
    top3ListItem: IPostsListItem
}

//#             Top3Item 컴포넌트           //
export default function Top3Item({top3ListItem}:Props) {
  //#           top3ListItem 속성           //
  const {postsNumber, title, content, postsTitleImage} = top3ListItem;
  const {commentCount, viewCount, favoriteCount} = top3ListItem;
  const {writeDatetime, writerNickname, writerProfileImage} = top3ListItem;
  //#           네비게이트 함수             //
  const navigate = useNavigate();
  //#           게시물 아이템 클릭 시 상세 게시물로 이동하는 이벤트 처리 함수           //
  const onClickHandler = () => {
    navigate(POSTS_PATH()+'/'+POSTS_DETAIL_PATH(postsNumber));
  }
  //#           렌더링          //
  return (
    <div className='top3-list-item' style={{backgroundImage: `url(${postsTitleImage})`}} onClick={onClickHandler}>
        <div className='top3-list-item__main-box'>
            <div className='top3-list-item__top'>
                <div className='top3-list-item__profile-box'>
                    <div className='top3-list-item__profile-image' style={{backgroundImage: `url(${writerProfileImage?writerProfileImage:defaultProfileImage})`}}></div>
                </div>
                <div className='top3-list-item__write-box'>
                    <div className='top3-list-item__nickname'>{writerNickname}</div>
                    <div className='top3-list-item__write-date'>{writeDatetime}</div>
                </div>
            </div>
            <div className='top3-list-item__middle'>
                <div className='top3-list-item__title'>{title}</div>
                <div className='top3-list-item__content'>{content}</div>
            </div>
            <div className='top3-list-item__bottom'>
                <div className='top3-list-item__counts'>
                    {`댓글 ${commentCount} · 조회수 ${viewCount} · 좋아요 ${favoriteCount}`}
                </div>
            </div>
        </div>
    </div>
  )
}
