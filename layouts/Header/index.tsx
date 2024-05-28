import { AUTH_PATH, MAIN_PATH, POSTS_DETAIL_PATH, POSTS_EDIT_PATH, POSTS_PATH, POSTS_CREATE_PATH, SEARCH_PATH, USER_PATH } from 'constant';
import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import './style.css';
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import usePostsStore from 'stores/posts.store';
import useLoginUserStore from 'stores/login-user.store'
import { ResponseDTO } from 'apis/response';
import { createPostsRequest, editPostsRequest, fileUploadRequest } from 'apis';
import CreatePostsRequestDTO from 'apis/request/posts/create-posts.request.dto';
import EditPostsRequestDTO from 'apis/request/posts/edit-posts.request.dto';
import CreatePostsResponseDTO from 'apis/response/posts/create-posts.response.dto';
import EditPostsResponseDTO from 'apis/response/posts/edit-posts.response.dto';

//#             Header 레이아웃 컴포넌트            //
export default function Header() {
  //#           상태            //
  const {loginUser, setLoginUser, resetLoginUser} = useLoginUserStore(); // 로그인 유저 상태
  const {pathname} = useLocation(); // 경로 상태
  const [cookie, setCookie] = useCookies(); // 쿠키 상태
  const [isLogin, setLogin] = useState<boolean>(false); // 로그인 상태
  const [isAuthenticationPage, setAuthenticationPage] = useState<boolean>(false); // 인증 페이지 상태
  const [isMainPage, setMainPage] = useState<boolean>(false); // 메인 페이지 상태
  const [isSearchPage, setSearchPage] = useState<boolean>(false); // 검색 페이지 상태
  const [isPostsDetailsPage, setPostsDetailsPage] = useState<boolean>(false); // 게시물 상세 페이지 상태
  const [isCreatePostsPage, setCreatePostsPage] = useState<boolean>(false); // 게시물 작성 페이지 상태
  const [isEditPostsPage, setEditPostsPage] = useState<boolean>(false); // 게시물 수정 페이지 상태
  const [isUserPage, setUserPage] = useState<boolean>(false); // 유저 페이지 상태

  //#           네비게이트 함수             //
  const navigate = useNavigate();

  //#           로고를 클릭했을 때 메인 페이지로 이동하는 함수          //
  const onLogoClickHandler = () => {
    navigate(MAIN_PATH());
  };
















  //#           SearchButton 컴포넌트             //
  const SearchButton = () => {
    //#         상태          //
    const searchButtonRef = useRef<HTMLDivElement | null>(null); // 검색 버튼 참조 상태
    const [isSearchButton, setSearchButton] = useState<boolean>(false); // 검색 버튼 상태
    const [inputSearchWord, setInputSearchWord] = useState<string>(''); // 검색어 입력 상태
    const {searchWord} = useParams(); // 검색어 URL 경로 변수 상태

    //#         검색어 필드 값 변경 시 검색어를 업데이트하는 함수       //
    const onSearchWordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const updateWord = event.target.value;
      setInputSearchWord(updateWord);
    };
    //#         엔터키 입력 시 검색 버튼 클릭 이벤트를 처리하는 함수          //
    const onSearchWordEnterKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if(event.key !== 'Enter') return;
      if(!searchButtonRef.current) return;
      searchButtonRef.current.click();
    };
    //#         검색 버튼 클릭 시 검색 완료 페이지로 이동하는 함수          //
    const onSearchButtonClickHandler = () => {
      if(!isSearchButton){
        setSearchButton(!isSearchButton);
        return;
      }
      navigate(SEARCH_PATH(inputSearchWord));
    };
    //#         검색어 URL 경로 변수가 변경될 때마다 실행될 이펙트          //
    useEffect(() => {
      if(searchWord) {
        setInputSearchWord(searchWord);
        setSearchButton(true);
      }
    }, [searchWord]);
    //#         SeachButton 컴포넌트 : 클릭 false 상태 렌더링          //
    if(!isSearchButton)
    return (
      <div className='app__icon-button' onClick={onSearchButtonClickHandler}>
        <div className='app__icon app__search-white-icon'></div>
      </div>
    );
    //#         SeachButton 컴포넌트 : 클릭 true 상태 렌더링          //
    return(
      <div className='header__search-button__input-box'>
        <input className='header__search-button__input' type='text' placeholder='검색할 단어를 입력하세요.' 
                value={inputSearchWord} onChange={onSearchWordChangeHandler} onKeyDown={onSearchWordEnterKeyDownHandler}/>
        <div className='app__icon-button' ref={searchButtonRef} onClick={onSearchButtonClickHandler}>
          <div className='app__icon app__search-light-icon'></div>
        </div>
      </div>
    );
  }; //* SearchButton */






  //#           UserButton 컴포넌트             //
  const UserButton = () => {
    //#         상태        //
    const {userEmail} = useParams(); // 유저 이메일 URL 경로 변수 상태

    //#         로그아웃 버튼 클릭 이벤트 처리 함수         //
    const onLogoutButtonClickHandler = () => {
      resetLoginUser();
      setCookie('accessToken', '', {path: MAIN_PATH(), expires: new Date()});
      navigate(MAIN_PATH());
    };
    //#         마이페이지 버튼 클릭 이벤트 처리 함수         //
    const onMyPageButtonClickHandler = () => {
      if(!loginUser) return;
      const {email} = loginUser;
      navigate(USER_PATH(email));
    };
    //#         로그인 버튼 클릭 이벤트 처리 함수         //
    const onLoginButtonClickHandler = () => {
      navigate(AUTH_PATH());
    };

    //#         UserButton 렌더링           //
    //! 로그아웃 버튼 렌더링
    if(isLogin && userEmail === loginUser?.email)
    return (
      <div className='app__white-button' onClick={onLogoutButtonClickHandler}>{'로그아웃'}</div>
    );

    //! 마이페이지 버튼 렌더링
    if(isLogin)
    return (
      <div className='app__white-button' onClick={onMyPageButtonClickHandler}>{'마이페이지'}</div>
    );

    //! 로그인 버튼 렌더링
    return (
      <div className='app__white-button' onClick={onLoginButtonClickHandler}>{'로그인'}</div>
    );
  }; //* UserButton */





  //#           UploadButton 컴포넌트             //
  const UploadButton = () => {
    //#         상태         //
    const {postsNumber} = useParams(); // 게시물 번호 URL 경로 변수 상태
    const {title, content, postsImageFileList, resetPosts} = usePostsStore(); // 게시물 상태
    //#         POST: 게시물 응답 처리 함수         //
    const createPostsResponse = (responseBody: CreatePostsResponseDTO | ResponseDTO | null) => {
      if(!responseBody) return;
      const {code} = responseBody;
      if(code==='DBE') alert('데이터베이스 오류');
      if(code==='AF' || code==='NEU') navigate(AUTH_PATH());
      if(code==='VF') alert('제목과 내용을 작성해주세요.');
      if(code!=='SU') return;

      resetPosts();
      if(!loginUser) return;
      const {email} = loginUser;
      navigate(USER_PATH(email));
    };
    //#         PATCH: 게시물 응답 처리 함수         //
    const editPostsResponse = (responseBody: EditPostsResponseDTO | ResponseDTO | null) => {
      if(!responseBody) return;
      const {code} = responseBody;
      if(code==='DBE') alert('데이터베이스 오류.');
      if(code==='AF' || code==='NEU' || code==='NEP' || code==='NP') navigate(AUTH_PATH());
      if(code==='VF') alert('제목과 내용을 작성해주세요.');
      if(code!=='SU') return;

      if(!postsNumber) return;
      navigate(POSTS_PATH()+'/'+POSTS_DETAIL_PATH(postsNumber));
    };
    //#         업로드 버튼 클릭 이벤트 핸들러         //
    const onUploadButtonClickHandler = async () => {
      const accessToken = cookie.accessToken;
      if(!accessToken) return;

      const postsImageList: string[] = [];
      for(const imageFile of postsImageFileList) {
        const imageData = new FormData();
        imageData.append('file', imageFile);
        const imageUrl = await fileUploadRequest(imageData);
        if(imageUrl) postsImageList.push(imageUrl);
      }

      const isWriterPage = pathname === POSTS_PATH()+'/'+POSTS_CREATE_PATH();
      if(isWriterPage) {
        const requestBody: CreatePostsRequestDTO = {
          title, content, postsImageList
        };
        createPostsRequest(requestBody, accessToken).then(createPostsResponse);
      } else {
        if(!postsNumber) return;
        const requestBody: EditPostsRequestDTO = {
          title, content, postsImageList
        };
        editPostsRequest(postsNumber, requestBody, accessToken).then(editPostsResponse);
      }
    };
    //#         UploadButton 렌더링         //
    //! 제목과 내용이 입력된 경우에만 업로드 버튼 활성화 
    if(title && content)
    return(
      <div className='app__white-button' onClick={onUploadButtonClickHandler}>{'업로드'}</div>
    );
    //! 제목과 내용 입력 전엔 비활성화
    return(
      <div className='app__disable-button'>{'업로드'}</div>
    );
  }; //* UploadButton */




  //#           경로가 변경될 때의 이펙트          //
  useEffect(()=>{
    const isAuthenticationPage = pathname.startsWith(AUTH_PATH());
    setAuthenticationPage(isAuthenticationPage);
    const isMainPage = pathname === MAIN_PATH();
    setMainPage(isMainPage);
    const isSearchPage = pathname.startsWith(SEARCH_PATH(''));
    setSearchPage(isSearchPage);
    const isPostsDetailsPage = pathname.startsWith(POSTS_PATH()+'/'+POSTS_DETAIL_PATH(''));
    setPostsDetailsPage(isPostsDetailsPage);
    const isCreatePostsPage = pathname.startsWith(POSTS_PATH()+'/'+POSTS_CREATE_PATH());
    setCreatePostsPage(isCreatePostsPage);
    const isEditPostsPage = pathname.startsWith(POSTS_PATH()+'/'+POSTS_EDIT_PATH(''));
    setEditPostsPage(isEditPostsPage);
    const isUserPage = pathname.startsWith(USER_PATH(''));
    setUserPage(isUserPage);
  }, [pathname]);
  //#           로그인 유저가 변경될 때의 이펙트          //
  useEffect(()=>{
    setLogin(loginUser !== null);
  }, [loginUser]);


  //#           Header 렌더링          //
  return (
    <div id='header'>
      <div className='header__container'>
        <div className='header__left-box' onClick={onLogoClickHandler}>
          <div className='app__icon-box'>
            <div className='app__icon app__logo-light-icon'></div>
          </div>
          <div className='header__logo'>{'HG BLOG'}</div>
        </div>
        <div className='header__right-box'>
          {(isAuthenticationPage || isMainPage || isSearchPage || isPostsDetailsPage) && <SearchButton/>}
          {(isMainPage || isSearchPage || isPostsDetailsPage || isUserPage) && <UserButton/>}
          {(isCreatePostsPage || isEditPostsPage) && <UploadButton/>}
        </div>
      </div>
    </div>
  )
} //* Header */
