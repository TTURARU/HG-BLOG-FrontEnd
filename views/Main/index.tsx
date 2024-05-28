import React, { useEffect, useState } from 'react'
import './style.css';
import { useNavigate } from 'react-router-dom';
import { IPostsListItem } from 'types/interface';
import Top3Item from 'components/Top3Item';
import { getLatestPostsListRequest, getPopularListRequest, getTop3PostsListRequest } from 'apis';
import { GetLatestPostsListResponseDTO, GetTop3PostsListResponseDTO } from 'apis/response/posts';
import { ResponseDTO } from 'apis/response';
import { usePagination } from 'hooks';
import PostsItem from 'components/BoardItem';
import Pagination from 'components/Pagination';
import { GetPopularListResponseDTO } from 'apis/response/search';
import { SEARCH_PATH } from 'constant';
//#             Main 컴포넌트           //
export default function Main() {
  //#           네비게이트 함수           //
  const navigate = useNavigate();
  //#           MainTop 컴포넌트          //
  const MainTop = () => {
    //#         상태          //
    const [top3PostsList, setTop3PostsList] = useState<IPostsListItem[]>([]); // top3 게시물 리스트 상태
    //#         getTop3PostsListResponse 처리 함수          //
    const getTop3PostsListResponse = (responseBody: GetTop3PostsListResponseDTO | ResponseDTO | null) => {
      if(!responseBody) return;
      const{code} = responseBody;
      if(code==='DBE') alert('데이터베이스 오류.');
      if(code!=='SU') return;

      const {top3List} = responseBody as GetTop3PostsListResponseDTO;
      setTop3PostsList(top3List);
    };
    //#         마운트 시 실행할 이펙트         //
    useEffect(() => {
      getTop3PostsListRequest().then(getTop3PostsListResponse);
    }, [])
    //#         MainTop 렌더링          //
    return(
      <div id='main-top__wrapper'>
        <div className='main-top__container'>
          <div className='main-top__title'>{'주간 TOP 3 게시물'}</div>
          <div className='main-top__contents-box'>
            <div></div>
            <div className='main-top__contents'>
              {top3PostsList.map(top3ListItem => <Top3Item top3ListItem={top3ListItem}/>)}
            </div>
          </div>
        </div>
      </div>
    )
  };
  //#           MainBottom 컴포넌트         //
  const MainBottom = () => {
    //#         상태          //
    // 페이지네이션 관련 상태
    const {
      currentPage, currentSection, viewList, viewPageList, totalSection,
      setCurrentPage, setCurrentSection, setTotalList
    } = usePagination<IPostsListItem>(5);

    const [popularWordList, setPopularWordList] = useState<string[]>([]); // 인기 검색어 리스트 상태
    //#         response 처리 함수          //
    // getLatestPostsListResponse
    const getLatestPostsListResponse = (responseBody: GetLatestPostsListResponseDTO | ResponseDTO | null) => {
      if(!responseBody) return;
      const{code} = responseBody;
      if(code==='DBE') alert('데이터베이스 오류.');
      if(code!=='SU') return;

      const {latestList} = responseBody as GetLatestPostsListResponseDTO;
      setTotalList(latestList);
    };
    // getPopularListResponse
    const getPopularListResponse = (responseBody: GetPopularListResponseDTO | ResponseDTO | null) => {
      if(!responseBody) return;
      const{code} = responseBody;
      if(code==='DBE') alert('데이터베이스 오류.');
      if(code!=='SU') return;

      const {popularWordList} = responseBody as GetPopularListResponseDTO;
      setPopularWordList(popularWordList);
    };
    //#         onClick 이벤트 핸들러       //
    // 인기 검색어 클릭
    const onPopularWordClickHandler = (word: string) => {
      navigate(SEARCH_PATH(word));
    };
    //#         마운트 시 실행할 이펙트       //
    useEffect(() => {
      getLatestPostsListRequest().then(getLatestPostsListResponse);
      getPopularListRequest().then(getPopularListResponse);
    }, [])
    //#         MainBottom 렌더링          //
    return(
      <div id='main-bottom__wrapper'>
        <div className='main-bottom__container'>
          <div className='main-bottom__title'>{'최신 게시물'}</div>
          <div className='main-bottom__contents-box'>
            <div className='main-bottom__contents'>
              {viewList.map(postsListItem => <PostsItem postsListItem={postsListItem}/>)}
            </div>
            <div className='main-bottom__popular-box'>
              <div className='main-bottom__popular-card'>
                <div className='main-bottom__popular-card__container'>
                  <div className='main-bottom__popular-card__title'>{'인기 검색어'}</div>
                  <div className='main-bottom__popular-card__contents'>
                    {popularWordList.map(word => <div className='app__word-badge' onClick={() => onPopularWordClickHandler(word)}>{word}</div>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='main-bottom__pagination-box'>
            <Pagination
              currentPage={currentPage}
              currentSection={currentSection}
              setCurrentPage={setCurrentPage}
              setCurrentSection={setCurrentSection}
              viewPageList={viewPageList}
              totalSection={totalSection}
            />
          </div>
        </div>
      </div>
    )
  };
  //#           Main 렌더링             //
  return (
    <>
      <MainTop/>
      <MainBottom/>
    </>
  )
}
