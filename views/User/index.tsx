import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import './style.css';
import defaultProfileImage from 'assets/images/default-profile-image.png';
import { useNavigate, useParams } from 'react-router-dom';
import useLoginUserStore from 'stores/login-user.store';
import { useCookies } from 'react-cookie';
import GetUserResponseDTO from 'apis/response/user/get-user.response.dto';
import { ResponseDTO } from 'apis/response';
import { AUTH_PATH, MAIN_PATH, POSTS_CREATE_PATH, POSTS_PATH, USER_PATH } from 'constant';
import EditProfileImageRequestDTO from 'apis/request/user/edit-profile-image.request.dto';
import { editNicknameRequest, editProfileImageRequest, fileUploadRequest, getUserPostsListRequest, getUserRequest } from 'apis';
import EditProfileImageResponseDTO from 'apis/response/user/edit-profile-image.response.dto';
import EditNicknameResponseDTO from 'apis/response/user/edit-nickname.response.dto';
import EditNicknameRequestDTO from 'apis/request/user/edit-nickname.request.dto';
import { usePagination } from 'hooks';
import { IPostsListItem } from 'types/interface';
import Pagination from 'components/Pagination';
import PostsItem from 'components/BoardItem';
import GetUserPostsListResponseDTO from 'apis/response/posts/get-user-posts-list.response.dto';
//#             User 컴포넌트           //
export default function User() {
  //#           상태            //
  const {userEmail} = useParams(); // userEmail 경로 변수 상태

  const {loginUser} = useLoginUserStore(); // 로그인한 유저 상태

  const [cookie, setCookie] = useCookies(); // 쿠키 상태

  const [isMyPage, setMyPage] = useState<boolean>(false); // 마이페이지 여부 상태
  //#           네비게이트 함수           //
  const navigate = useNavigate();
  //#           UserTop 컴포넌트            //
  const UserTop = () => {
    //#         상태          //
    const imageInputRef = useRef<HTMLInputElement|null>(null); // 이미지 파일 input 요소 참조 상태

    const [isNicknameChange, setNicknameChange] = useState<boolean>(false); // 닉네임 변경 여부 상태
    const [nickname, setNickname] = useState<string>(''); // 닉네임 상태
    const [changeNickname, setChangeNickname] = useState<string>(''); // 변경된 닉네임 상태
    const [profileImage, setProfileImage] = useState<string|null>(null); // 프로필 이미지 상태
    //#         response 처리 함수          //
    // getUserResponse
    const getUserResponse = (responseBody: GetUserResponseDTO | ResponseDTO | null) => {
      if(!responseBody) return;
      const{code} = responseBody;
      if(code==='NEU') alert('존재하지 않는 유저입니다.');
      if(code==='DBE') alert('데이터베이스 오류.');
      if(code!=='SU') {
        navigate(MAIN_PATH());
        return;
      }

      const {email, nickname, profileImage} = responseBody as GetUserResponseDTO;
      setNickname(nickname);
      setProfileImage(profileImage);
      const isMyPage = email === loginUser?.email;
      setMyPage(isMyPage);
    };
    // fileUploadResponse
    const fileUploadResponse = (profileImage: string | null) => {
      if(!profileImage) return;
      if(!cookie.accessToken) return;

      const requestBody: EditProfileImageRequestDTO = {profileImage};
      editProfileImageRequest(requestBody, cookie.accessToken).then(editProfileImageResponse);
    };
    // editProfileImageResponse
    const editProfileImageResponse = (responseBody: EditProfileImageResponseDTO | ResponseDTO | null) => {
      if(!responseBody) return;
      const{code} = responseBody;
      if(code==='AF') alert('인증에 실패했습니다.');
      if(code==='NEU') alert('존재하지 않는 유저입니다.');
      if(code==='DBE') alert('데이터베이스 오류.');
      if(code!=='SU') return;

      if(!userEmail) return;
      getUserRequest(userEmail).then(getUserResponse);
    };
    // editNicknameResponse
    const editNicknameResponse = (responseBody: EditNicknameResponseDTO | ResponseDTO | null) => {
      if(!responseBody) return;
      const{code} = responseBody;
      if(code==='VF') alert('닉네임은 필수입니다.');
      if(code==='AF') alert('인증에 실패했습니다.');
      if(code==='DN') alert('중복된 닉네임입니다.');
      if(code==='NEU') alert('존재하지 않는 유저입니다.');
      if(code==='DBE') alert('닉네임이 글자수 초과.');
      if(code!=='SU') return;

      if(!userEmail) return;
      getUserRequest(userEmail).then(getUserResponse);
      setNicknameChange(false);
      alert('닉네임이 변경되었습니다.');
    };
    //#         onClick 이벤트 핸들러         //
    // 프로필 박스 클릭
    const onProfileBoxClickHandler = () => {
      if(!isMyPage) return;
      if(!imageInputRef.current) return;
      imageInputRef.current.click();
    };
    // 닉네임 수정 버튼 클릭
    const onNicknameEditButtonClickHandler = () => {
      if(!isNicknameChange) {
        setChangeNickname(nickname);
        setNicknameChange(!isNicknameChange);
        return;
      }
      if(!cookie.accessToken) return;

      const requestBody: EditNicknameRequestDTO = {
        nickname: changeNickname
      };
      editNicknameRequest(requestBody, cookie.accessToken).then(editNicknameResponse);
    };
    //#         onChange 이벤트 핸들러          //
    // 프로필 이미지 변경
    const onProfileImageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      if(!event.target.files || !event.target.files.length) return;

      const file = event.target.files[0];
      const data = new FormData();
      data.append('file', file);

      fileUploadRequest(data).then(fileUploadResponse);
    };
    // 닉네임 변경
    const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const {value} = event.target;
      setChangeNickname(value);
    };
    //#         userEmail 이펙트          //
    useEffect(() => {
      if(!userEmail) return;
      getUserRequest(userEmail).then(getUserResponse);
    }, [userEmail])
    //#         UserTop 렌더링          //
    return(
      <div id='user-top__wrapper'>
        <div className='user-top__container'>
          {isMyPage
          ? <div className='user-top__my-profile-image-box' onClick={onProfileBoxClickHandler}>
              {profileImage !== null
              ? <div className='user-top__profile-image' style={{backgroundImage: `url(${profileImage})`}}></div>
              : <div className='app__icon-box-large'>
                  <div className='app__icon app__image-box-white-icon'></div>
                </div>
              }
              <input ref={imageInputRef} type='file' accept='image/*' style={{display: 'none'}} onChange={onProfileImageChangeHandler}/>
            </div>
          : <div className='user-top__profile-image-box' style={{backgroundImage: `url(${profileImage?profileImage:defaultProfileImage})`}}></div>
          }
          <div className='user-top__info-box'>
            <div className='user-top__info-nickname-box'>
              {isMyPage
              ? <>
                  {isNicknameChange
                  ? <input className='user-top__info-nickname-input' type='text' size={changeNickname.length + 2} value={changeNickname} onChange={onNicknameChangeHandler}/>
                  : <div className='user-top__info-nickname'>{nickname}</div>
                  }
                  <div className='app__icon-button' onClick={onNicknameEditButtonClickHandler}>
                    <div className='app__icon app__edit-icon'></div>
                  </div>
                </>
              : <div className='user-top__info-nickname'>{nickname}</div>
              }
            </div>
            <div className='user-top__info-email'>{userEmail}</div>
          </div>
        </div>
      </div>
    )
  };
  //#           UserBottom 컴포넌트           //
  const UserBottom = () => {
    //#         상태          //
    // 페이지네이션 관련 상태
    const {
      currentPage, currentSection, viewList, viewPageList, totalSection,
      setCurrentPage, setCurrentSection, setTotalList
    } = usePagination<IPostsListItem>(5);

    const [count, setCount] = useState<number>(0); // 게시물 개수 상태
    //#         response 처리 함수          //
    // getUserPostsListResponse
    const getUserPostsListResponse = (responseBody: GetUserPostsListResponseDTO | ResponseDTO | null) => {
      if(!responseBody) return;
      const{code} = responseBody;
      if(code==='NEU') {
        alert('존재하지 않는 유저입니다.');
        navigate(MAIN_PATH());
        return;
      } 
      if(code==='DBE') alert('데이터베이스 오류.');
      if(code!=='SU') return;

      const {userPostsList} = responseBody as GetUserPostsListResponseDTO;
      setTotalList(userPostsList);
      setCount(userPostsList.length);
    };
    //#         onClick 이벤트 핸들러           //
    // 사이드 카드 클릭
    const onSideCardClickHandler = () => {
      if(isMyPage) navigate(POSTS_PATH()+'/'+POSTS_CREATE_PATH());
      else if (loginUser) navigate(USER_PATH(loginUser.email));
      else navigate(AUTH_PATH());
    };
    //#         userEmail 이펙트            //
    useEffect(() => {
      if(!userEmail) return;
      getUserPostsListRequest(userEmail).then(getUserPostsListResponse);
    }, [userEmail])
    //#         UserBottom 렌더링          //
    return(
      <div id='user-bottom__wrapper'>
        <div className='user-bottom__container'>
          <div className='user-bottom__title'>{isMyPage?'내 게시물':'게시물'}<span className='app__emphasis'>{count}</span></div>
          <div className='user-bottom__contents-box'>
            {count === 0
            ? <div className='user-bottom__contents-nothing'>{'게시물이 없습니다.'}</div>
            : <div className='user-bottom__contents'>
                {viewList.map(postsListItem => <PostsItem postsListItem={postsListItem}/>)}
              </div>
            }
            <div className='user-bottom__side-box'>
              <div className='user-bottom__side-card' onClick={onSideCardClickHandler}>
                <div className='user-bottom__side-container'>
                  {isMyPage
                  ? <>
                    <div className='app__icon-box'>
                      <div className='app__icon app__edit-icon'></div>
                    </div>
                    <div className='user-bottom__side-text-create'>{'게시물 작성'}</div>
                    </>
                  : <>
                    <div className='user-bottom__side-text-mypage'>{'마이페이지'}</div>
                    <div className='app__icon-box'>
                      <div className='app__icon app__arrow-right-icon'></div>
                    </div>
                    </>
                  }
                </div>
              </div>
            </div>
          </div>
          <div className='user-bottom__pagination-box'>
            {count !== 0 &&
              <Pagination
                currentPage={currentPage}
                currentSection={currentSection}
                setCurrentPage={setCurrentPage}
                setCurrentSection={setCurrentSection}
                viewPageList={viewPageList}
                totalSection={totalSection}
              />
            }
          </div>
        </div>
      </div>
    )
  };
  //#           User 렌더링             //
  return (
    <>
      <UserTop/>
      <UserBottom/>
    </>
  )
}
