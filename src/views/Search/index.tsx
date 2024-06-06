import React, { useEffect, useState } from 'react'
import './style.css';
import { useNavigate, useParams } from 'react-router-dom';
import { usePagination } from 'hooks';
import { IPostsListItem } from 'types/interface';
import PostsItem from 'components/BoardItem';
import Pagination from 'components/Pagination';
import { GetSearchPostsListResponseDTO } from 'apis/response/posts';
import { ResponseDTO } from 'apis/response';
import { GetRelationListResponseDTO } from 'apis/response/search';
import { SEARCH_PATH } from 'constant';
import { getRelationListRequest, getSearchPostsListRequest } from 'apis';

//#             Search 컴포넌트           //
export default function Search() {
  //#           상태            //
  const {searchWord} = useParams(); // 검색어 경로 변수 상태

  // 페이지네이션 관련 상태
  const {
    currentPage, currentSection, viewList, viewPageList, totalSection,
    setCurrentPage, setCurrentSection, setTotalList
  } = usePagination<IPostsListItem>(5);

  const [preSearchWord, setPreSearchWord] = useState<string|null>(null); // 이전 검색어 상태
  const [count, setCount] = useState<number>(0); // 검색 게시물 개수 상태
  const [relationWordList, setRelationWordList] = useState<string[]>([]); // 관련 검색어 리스트 상태
  //#           네비게이션 함수             //
  const navigate = useNavigate();
  //#           response 처리 함수            //
  // getSearchPostsListResponse
  const getSearchPostsListResponse = (responseBody: GetSearchPostsListResponseDTO | ResponseDTO | null) => {
    if(!responseBody) return;
    const {code} = responseBody;
    if(code==='DBE') alert('데이터베이스 오류.');
    if(code!=='SU') return;

    if(!searchWord) return;
    const {searchList} = responseBody as GetSearchPostsListResponseDTO;
    setTotalList(searchList);
    setCount(searchList.length);
    setPreSearchWord(searchWord);
  };
  // getRelationListResponse
  const getRelationListResponse = (responseBody: GetRelationListResponseDTO | ResponseDTO | null) => {
    console.log(responseBody);
    if(!responseBody) return;
    if(!('relationWordList' in responseBody)) return;
    const {code} = responseBody;
    if(code==='DBE') alert('데이터베이스 오류.');
    if(code!=='SU') return;

    const {relationWordList} = responseBody as GetRelationListResponseDTO;
    //console.log(relationWordList);
    setRelationWordList(relationWordList);
  };
  //#           onClick 이벤트 핸들러           //
  // 연관 검색어 클릭
  const onRelationWordClickHandler = (word: string) => {
    navigate(SEARCH_PATH(word));
  };
  //#           searchWord 이펙트           //
  useEffect(() => {
    if(!searchWord) return;
    getRelationListRequest(searchWord).then(getRelationListResponse);
    getSearchPostsListRequest(searchWord, preSearchWord).then(getSearchPostsListResponse);
  }, [searchWord])
  //#           Search 렌더링             //
  if(!searchWord) return (<></>)
  return (
    <div id='search__wrapper'>
      <div className='search__container'>
        <div className='search__title-box'>
          <div className='search__title'><span className='search__title-emphasis'>{"'"}{searchWord}{"'"}</span>{' 의 검색결과 : '}</div>
          <div className='search__count'>{count}{'개'}</div>
        </div>
        <div className='search__contents-box'>
          {count === 0
          ?<div className='search__contents-nothing'>{'검색 결과가 없습니다.'}</div>
          :<div className='search__contents'>{viewList.map(postsListItem => <PostsItem postsListItem={postsListItem}/>)}</div>
          }
          <div className='search__relation-box'>
            <div className='search__relation-card'>
              <div className='search__relation-card__container'>
                <div className='search__relation-card__title'>{'관련 검색어'}</div>
                {relationWordList.length === 0
                ?<div className='search__relation-card__contents-nothing'>{'관련 검색어가 없습니다.'}</div>
                :<div className='search__relation-card__contents'>
                   {relationWordList && relationWordList.map(word => <div className='app__word-badge' onClick={() => onRelationWordClickHandler(word)}>{word}</div>)}
                 </div>
                }
              </div>
            </div>
          </div>
        </div>
        <div className='search__pagination-box'>
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
}
