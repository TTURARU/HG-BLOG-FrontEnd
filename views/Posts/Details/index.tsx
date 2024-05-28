import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import './style.css';
import defaultProfileImage from 'assets/images/default-profile-image.png';
import { useNavigate, useParams } from 'react-router-dom';
import useLoginUserStore from 'stores/login-user.store';
import { useCookies } from 'react-cookie';
import { ICommentListItem, IFavoriteListItem, IPosts } from 'types/interface';
import dayjs from 'dayjs';
import { ResponseDTO } from 'apis/response';
import { MAIN_PATH, POSTS_EDIT_PATH, POSTS_PATH, USER_PATH } from 'constant';
import DeletePostsResponseDTO from 'apis/response/posts/delete-posts.response.dto';
import { createCommentRequest, deleteCommentRequest, deletePostsRequest, detailPostsRequest, getCommentListRequest, getFavoriteListRequest, increaseViewCountRequest, putFavoriteRequest } from 'apis';
import DetailPostsResponseDTO from 'apis/response/posts/detail-posts.response.dto';
import GetFavoriteListResponseDTO from 'apis/response/posts/get-favorite-list.response.dto';
import GetCommentListResponseDTO from 'apis/response/posts/get-comment-list.response.dto';
import PutFavoriteResponseDTO from 'apis/response/posts/put-favorite.response.dto';
import CreateCommentResponseDTO from 'apis/response/posts/create-comment.response.dto';
import CreateCommentRequestDTO from 'apis/request/posts/create-comment.request.dto';
import FavoriteItem from 'components/FavoriteItem';
import IncreaseViewCountResponseDTO from 'apis/response/posts/increase-view-count.response.dto';
import usePagination from 'hooks/pagination.hook';
import Pagination from 'components/Pagination';
import CommentItem from 'components/CommentItem';
import { DeleteCommentResponseDTO } from 'apis/response/posts';

//#             DetailPosts 컴포넌트           //
export default function DetailPosts() {

  //#           상태            //
  const {postsNumber} = useParams(); // 게시물 번호 경로 변수 상태

  const {loginUser} = useLoginUserStore(); // 로그인한 유저 상태

  const [cookie, setCookie] = useCookies(); // 쿠키 상태

  //#           네비게이트 함수           //
  const navigate = useNavigate();
  //#           increaseViewCountResponse 처리 함수           //
  const increaseViewCountResponse = (responseBody: IncreaseViewCountResponseDTO | ResponseDTO | null) => {
    if(!responseBody) return;
    const {code} = responseBody;
    if(code==='NEP') alert('존재하지 않는 게시물입니다.');
    if(code==='DBE') alert('데이터베이스 오류.');
  };



  //#           DetailPostsTop 컴포넌트           //
  const DetailPostsTop = () => {
    //#         상태          //
    const [isWriter, setWriter] = useState<boolean>(false); // 작성자 여부 상태
    const [posts, setPosts] = useState<IPosts | null>(null); // 게시물 정보 상태
    const [showMoreButton, setShowMoreButton] = useState<boolean>(false); // 확장 버튼 상태

    //#         작성일 포맷 변경 함수          //
    const getWriteDatetimeFormat = () => {
      if(!posts) return '';
      const date = dayjs(posts.writeDatetime);
      return date.format('YYYY. MM. DD HH:mm');
    };
    //#         response 처리 함수        //
    // detailPostsResponse
    const detailPostsResponse = (responseBody: DetailPostsResponseDTO | ResponseDTO | null) => {
      if(!responseBody) return;
      const {code} = responseBody;
      if(code==='NEP') alert('게시물이 존재하지 않습니다.');
      if(code==='DBE') alert('데이터베이스 오류.');
      if(code!=='SU') {
        navigate(MAIN_PATH());
        return;
      }

      const posts: IPosts = {...responseBody as DetailPostsResponseDTO};
      setPosts(posts);

      if(!loginUser) {
        setWriter(false);
        return;
      }
      const isWriter = loginUser.email === posts.writerEmail;
      setWriter(isWriter);
    }; //*  */
    // deletePostsResponse
    const deletePostsResponse = (responseBody: DeletePostsResponseDTO | ResponseDTO | null) => {
      if(!responseBody) return;
      const {code} = responseBody;
      if(code==='VF') alert('잘못된 접근입니다.');
      if(code==='NEU') alert('존재하지 않는 유저입니다.');
      if(code==='NEP') alert('게시물이 존재하지 않습니다.');
      if(code==='AF') alert('인증에 실패했습니다.');
      if(code==='NP') alert('권한이 없습니다.');
      if(code==='DBE') alert('데이터베이스 오류.');
      if(code!=='SU') return;

      navigate(MAIN_PATH());
      alert('게시물이 삭제되었습니다.');
    }; //*  */
    //#         onClick 이벤트 핸들러         //
    // 닉네임 클릭
    const onNicknameClickHandler = () => {
      if(!posts) return;
      navigate(USER_PATH(posts.writerEmail));
    };
    // 확장 버튼 클릭
    const onMoreButtonClickHandler = () => {
      setShowMoreButton(!showMoreButton);
    };
    // 수정 버튼 클릭
    const onEditButtonClickHandler = () => {
      if(!posts || !loginUser) return;
      if(loginUser.email !== posts.writerEmail) return;
      navigate(POSTS_PATH() + '/' + POSTS_EDIT_PATH(posts.postsNumber));
    };
    // 삭제 버튼 클릭
    const onDeleteButtonClickHandler = () => {
      if(!postsNumber || !posts || !loginUser || !cookie.accessToken) return;
      if(loginUser.email !== posts.writerEmail) return;

      deletePostsRequest(postsNumber, cookie.accessToken).then(deletePostsResponse);
    };
    //#         게시물 번호 경로 변수 이펙트 (게시물 불러오기)        //
    useEffect(() => {
      if(!postsNumber) {
        navigate(MAIN_PATH());
        return;
      }
      detailPostsRequest(postsNumber).then(detailPostsResponse);
    }, [postsNumber])
    //#         DetailPostsTop 렌더링         //
    if(!posts) return <></>
    return (
      <div id='detail-posts-top'>
        <div className='detail-posts-top__header'>
          <div className='detail-posts-top__header__title'>{posts.title}</div>
          <div className='detail-posts-top__header__sub-box'>
            <div className='detail-posts-top__header__write-info-box'>
              <div className='detail-posts-top__header__writer-profile-image-box'>
                <div className='detail-posts-top__header__writer-profile-image' style={{backgroundImage: `url(${posts.writerProfileImage?posts.writerProfileImage:defaultProfileImage})`}}></div>
              </div>
              <div className='detail-posts-top__header__writer-nickname' onClick={onNicknameClickHandler}>{posts.writerNickname}</div>
              <div className='detail-posts-top__header__info-divider'>{'|'}</div>
              <div className='detail-posts-top__header__write-date'>{getWriteDatetimeFormat()}</div>
              <div className='detail-posts-top__header__info-divider'>{'|'}</div>
              <div className='detail-posts-top__header__view-count'>{`조회수 ${posts.viewCount}`}</div>
            </div>
            {isWriter &&
            <div className='app__icon-button' onClick={onMoreButtonClickHandler}>
              <div className='app__icon app__more-icon'></div>
            </div>
            }
            {showMoreButton &&
            <div className='detail-posts-top__header__more-box'>
              <div className='detail-posts-top__header__more-box__edit-button' onClick={onEditButtonClickHandler}>{'수정'}</div>
              <div className='app__divider'></div>
              <div className='detail-posts-top__header__more-box__delete-button' onClick={onDeleteButtonClickHandler}>{'삭제'}</div>
            </div>
            }
          </div>
        </div>
        <div className='app__divider'></div>
        <div className='detail-posts-top__main'>
          <div className='detail-posts-top__main__text'>{posts.content}</div>
          {posts.postsImageList.map(image => <img className='detail-posts-top__main__image' src={image}/>)}
        </div>
      </div>
    )
  }; //* DetailPostsTop */


  //#           DetailPostsBottom 컴포넌트            //
  const DetailPostsBottom = () => {
    //#         상태          //
    const commentRef = useRef<HTMLTextAreaElement | null>(null); // 댓글 textarea 요소 참조 상태

    // 페이지네이션 관련 상태
    const {
      currentPage, currentSection, viewList, viewPageList, totalSection,
      setCurrentPage, setCurrentSection, setTotalList
    } = usePagination<ICommentListItem>(5);

    const [favoriteList, setFavoriteList] = useState<IFavoriteListItem[]>([]); // 좋아요 리스트 상태
    const [isFavorite, setFavorite] = useState<boolean>(false); // 좋아요 상태
    const [showFavorite, setShowFavorite] = useState<boolean>(false); // 좋아요 상자 확장 상태
    const [totalCommentCount, setTotalCommentCount] = useState<number>(0); // 전체 댓글 개수 상태
    const [comment, setComment] = useState<string>(''); // 댓글 상태
    const [showComment, setShowComment] = useState<boolean>(true); // 댓글 상자 확장 상태
    //#         Response 처리 함수          //
    // getFavoriteListResponse 처리 함수
    const getFavoriteListResponse = (responseBody: GetFavoriteListResponseDTO | ResponseDTO | null) => {
      if(!responseBody) return;
      const {code} = responseBody;
      if(code==='NEP') alert('존재하지 않는 게시물입니다.');
      if(code==='DBE') alert('데이터베이스 오류.');
      if(code!=='SU') return;

      const {favoriteList} = responseBody as GetFavoriteListResponseDTO;
      setFavoriteList(favoriteList);

      if(!loginUser) {
        setFavorite(false);
        return;
      }
      const isFavorite = favoriteList.findIndex(favorite => favorite.email === loginUser.email) !== -1;
      setFavorite(isFavorite);
    };
    // getCommentListResponse 처리 함수
    const getCommentListResponse = (responseBody: GetCommentListResponseDTO | ResponseDTO | null) => {
      if(!responseBody) return;
      const {code} = responseBody;
      if(code==='NEP') alert('존재하지 않는 게시물입니다.');
      if(code==='DBE') alert('데이터베이스 오류.');
      if(code!=='SU') return;

      const {commentList} = responseBody as GetCommentListResponseDTO;
      setTotalList(commentList);
      setTotalCommentCount(commentList.length);
    };
    // putFavoriteResponse 처리 함수
    const putFavoriteResponse = (responseBody: PutFavoriteResponseDTO | ResponseDTO | null) => {
      if(!responseBody) return;
      const {code} = responseBody;
      if(code==='VF') alert('잘못된 접근입니다.');
      if(code==='NEU') alert('존재하지 않는 유저입니다.');
      if(code==='NEP') alert('존재하지 않는 게시물입니다.');
      if(code==='AF') alert('인증에 실패했습니다.');
      if(code==='DBE') alert('데이터베이스 오류.');
      if(code!=='SU') return;

      if(!postsNumber) return;
      getFavoriteListRequest(postsNumber).then(getFavoriteListResponse);
    };
    // createCommentResponse 처리 함수
    const createCommentResponse = (responseBody: CreateCommentResponseDTO | ResponseDTO | null) => {
      if(!responseBody) return;
      const {code} = responseBody;
      if(code==='VF') alert('잘못된 접근입니다.');
      if(code==='NEU') alert('존재하지 않는 유저입니다.');
      if(code==='NEP') alert('존재하지 않는 게시물입니다.');
      if(code==='AF') alert('인증에 실패했습니다.');
      if(code==='DBE') alert('데이터베이스 오류.');
      if(code!=='SU') return;

      setComment('');
      if(!postsNumber) return;
      getCommentListRequest(postsNumber).then(getCommentListResponse);
    };
    // deleteCommentResponse
    const deleteCommentResponse = (responseBody: DeleteCommentResponseDTO | ResponseDTO | null) => {
      if (!responseBody) return;
      const { code } = responseBody;
      if (code === 'VF') alert('잘못된 접근입니다.');
      if (code === 'NEU') alert('존재하지 않는 유저입니다.');
      if (code === 'NEP') alert('존재하지 않는 게시물입니다.');
      if (code === 'NEC') alert('존재하지 않는 댓글입니다.');
      if (code === 'AF') alert('인증에 실패했습니다.');
      if (code === 'DBE') alert('데이터베이스 오류.');
      if (code !== 'SU') return;

      if (!postsNumber) return;
      getCommentListRequest(postsNumber).then(getCommentListResponse);
    };
    //#         onChange 이벤트 핸들러          //
    // 댓글 변경
    const onCommentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
      const {value} = event.target;
      setComment(value);

      if(!commentRef.current) return;
      commentRef.current.style.height = 'auto';
      commentRef.current.style.height = `${commentRef.current.scrollHeight}px`;
    };
    //#         onClick 이벤트 핸들러         // 
    // 좋아요 클릭
    const onFavoriteClickHandler = () => {
      if(!postsNumber || !loginUser || !cookie.accessToken) return;
      putFavoriteRequest(postsNumber, cookie.accessToken).then(putFavoriteResponse);
    };
    // 좋아요 상자 확장 클릭
    const onShowFavoriteClickHandler = () => {
      setShowFavorite(!showFavorite);
    };
    // 댓글 상자 확장 클릭
    const onShowCommentClickHandler = () => {
      setShowComment(!showComment);
    };
    // 댓글 작성 버튼 클릭
    const onCommentSubmitButtonClickHandler = () => {
      if(!comment || !postsNumber || !loginUser || !cookie.accessToken) return;
      
      const requestBody: CreateCommentRequestDTO = {content: comment};
      createCommentRequest(postsNumber, requestBody, cookie.accessToken).then(createCommentResponse);
    };
    //# 댓글 삭제 버튼 클릭
    const onDeleteCommentButtonClickHandler = (commentNumber: number) => {
      if(!postsNumber || !loginUser || !cookie.accessToken) return alert("권한이 없습니다.");

      deleteCommentRequest(commentNumber, cookie.accessToken).then(deleteCommentResponse);
    };
    //#         게시물 번호 경로 변수 이펙트 (좋아요, 댓글 리스트 불러오기)         //
    useEffect(() => {
      if(!postsNumber) return;
      getFavoriteListRequest(postsNumber).then(getFavoriteListResponse);
      getCommentListRequest(postsNumber).then(getCommentListResponse);
    }, [postsNumber])
    //#         DetailPostsBottom 렌더링         
    return (
      <div id='detail-posts-bottom'>
        <div className='app__divider'></div>
        <div className='detail-posts-bottom__button-box'>
          <div className='detail-posts-bottom__button-group'>
            <div className='app__icon-button' onClick={onFavoriteClickHandler}>
              {isFavorite
              ?<div className='app__icon app__favorite-fill-icon'></div>
              :<div className='app__icon app__favorite-light-icon'></div>
              }
            </div>
            <div className='detail-posts-bottom__button-text'>{`좋아요 ${favoriteList.length}`}</div>
            <div className='app__icon-button' onClick={onShowFavoriteClickHandler}>
              {showFavorite
              ?<div className='app__icon app__up-light-icon'></div>
              :<div className='app__icon app__down-light-icon'></div>
              }
            </div>
          </div>
          <div className='detail-posts-bottom__button-group'>
            <div className='app__icon-button'>
              <div className='app__icon app__comment-icon'></div>
            </div>
            <div className='detail-posts-bottom__button-text'>{`댓글 ${totalCommentCount}`}</div>
            <div className='app__icon-button' onClick={onShowCommentClickHandler}>
            {showComment
            ?<div className='app__icon app__up-light-icon'></div>
            :<div className='app__icon app__down-light-icon'></div>
            }
          </div>
        </div>
      </div>
      {showFavorite &&
        <div className='detail-posts-bottom__favorite-box'>
          <div className='detail-posts-bottom__favorite-container'>
            <div className='detail-posts-bottom__favorite-title'>{'좋아요 '}<span className='app__emphasis'>{favoriteList.length}</span></div>
            <div className='detail-posts-bottom__favorite-contents'>
              {favoriteList.map(item => <FavoriteItem favoriteListItem={item}/>)}
            </div>
          </div>
        </div>
      }
      {showComment &&
        <div className='detail-posts-bottom__comment-box'>
          <div className='detail-posts-bottom__comment-container'>
            <div className='detail-posts-bottom__comment-title'>{'댓글 '}<span className='app__emphasis'>{totalCommentCount}</span></div>
            <div className='detail-posts-bottom__comment-list-container'>
              {viewList.map(item => <CommentItem commentListItem ={item} onDeleteComment={onDeleteCommentButtonClickHandler}/>)}
            </div>
          </div>
          <div className='detail-posts-bottom__comment-pagination-box'>
            <Pagination
              currentPage={currentPage}
              currentSection={currentSection}
              setCurrentPage={setCurrentPage}
              setCurrentSection={setCurrentSection}
              viewPageList={viewPageList}
              totalSection={totalSection}
            />
          </div>
          {loginUser !== null &&
          <div className='detail-posts-bottom__comment-input-box'>
            <div className='detail-posts-bottom__comment-input-container'>
              <textarea className='detail-posts-bottom__comment-textarea' ref={commentRef} placeholder='댓글을 작성해주세요.' value={comment} onChange={onCommentChangeHandler}/>
              <div className='detail-posts-bottom__comment-button-box'>
                <div className={comment===''?'app__disable-button':'app__black-button'} onClick={onCommentSubmitButtonClickHandler}>{'댓글 작성'}</div>
              </div>
            </div>
          </div>
          }
        </div>
      }
      </div>
    )
  }; //* DetailPostsBottom */



  //#           게시물 번호 경로 변수 이펙트 (조회수)          //
  let effectFlag = true;
  useEffect(() => {
    if(!postsNumber) return;
    if(effectFlag) {
      effectFlag = false;
      return;
    }
    increaseViewCountRequest(postsNumber).then(increaseViewCountResponse);
  }, [postsNumber])
  //#           DetailPosts 렌더링             //
  return (
    <div id='detail-posts__wrapper'>
      <div className='detail-posts__container'>
        <DetailPostsTop/>
        <DetailPostsBottom/>
      </div>
    </div>
  )
} //* DetailPosts */
