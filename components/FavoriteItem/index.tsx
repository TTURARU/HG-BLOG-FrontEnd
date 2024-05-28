import React from 'react'
import { IFavoriteListItem } from 'types/interface'
import './style.css';
import defaultProfileImage from 'assets/images/default-profile-image.png';

//#             Props 인터페이스            //
interface Props{
    favoriteListItem: IFavoriteListItem;
}

//#             FavoriteItem 컴포넌트           //
export default function FavoriteItem({favoriteListItem}:Props) {
  //#           favoriteListItem 속성            //
  const {nickname, profileImage} = favoriteListItem;
  //#           렌더링          //
  return (
    <div className='favorite-list-item'>
        <div className='favorite-list-item__profile-box'>
            <div className='favorite-list-item__profile-image' style={{backgroundImage: `url(${profileImage?profileImage:defaultProfileImage})`}}></div>
        </div>
        <div className='favorite-list-item__nickname'>{nickname}</div>
    </div>
  )
}
