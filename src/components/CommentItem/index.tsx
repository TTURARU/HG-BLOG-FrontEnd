import dayjs from 'dayjs';
import React from 'react'
import './style.css';
import { ICommentListItem } from 'types/interface'
import defaultProfileImage from 'assets/images/default-profile-image.png';

//#             Props 인터페이스           //
interface Props{
    commentListItem: ICommentListItem;
    onDeleteComment: (commentNumber: number) => void;
    currentUserNickname: string | null;
}

//#             CommentItem 컴포넌트            //
export default function CommentItem({commentListItem, onDeleteComment, currentUserNickname}:Props) {
  //#           commentListItem 속성            //
  const{nickname, profileImage, writeDatetime, content, commentNumber} = commentListItem;
  //#           작성일 경과 시간을 구하는 함수          //
  const getElapsedTime = () => {
    const now = dayjs().add(9, 'hour');
    const writeTime = dayjs(writeDatetime);

    const gap = now.diff(writeTime, 's');
    if(gap<60) return `${gap}초 전`;
    if(gap<3600) return `${Math.floor(gap/60)}분 전`;
    if(gap<86400) return `${Math.floor(gap/3600)}시간 전`;
    return `${Math.floor(gap/86400)}일 전`;
  };
  //#           댓글 삭제 버튼 클릭 함수            //
  const onDeleteCommentButtonClickHandler = () => {
    console.log(commentListItem);

    if(!commentNumber) return;
    onDeleteComment(commentNumber);
  };
  //#           렌더링          //
  return (
    <div className='comment-list-item'>
        <div className='comment-list-item__top'>
            <div className='comment-list-item__profile-box'>
                <div className='comment-list-item__profile-image' style={{backgroundImage: `url(${profileImage?profileImage:defaultProfileImage})`}}></div>
            </div>
            <div className='comment-list-item__nickname'>{nickname}</div>
            <div className='comment-list-item__divider'>{'|'}</div>
            <div className='comment-list-item__time'>{getElapsedTime()}</div>
            {currentUserNickname === nickname &&
            <div className='app__icon-button comment-list-item__delete' onClick={onDeleteCommentButtonClickHandler}>
              <div className='app__icon app__close-icon'></div>
            </div>
            }
        </div>
        <div className='comment-list-item__bottom'>
            <div className='comment-list-item__content'>{content}</div>
        </div>
        <div className='app__divider'></div>
    </div>
  )
}
