import React, { Dispatch, SetStateAction } from 'react'
import './style.css';

interface Props {
    currentPage: number;
    currentSection: number;
    setCurrentPage: Dispatch<SetStateAction<number>>;
    setCurrentSection: Dispatch<SetStateAction<number>>;

    viewPageList: number[];
    totalSection: number;
}

//#         Pagination 컴포넌트         //
export default function Pagination(props: Props) {
  //#           상태            //
  const {currentPage, currentSection, viewPageList, totalSection} = props;
  const {setCurrentPage, setCurrentSection} = props;
  //#           onClick 이벤트 핸들러           //
  // 페이지 번호 클릭
  const onPageClickHandler = (page: number) => {
    setCurrentPage(page);
  }
  // 이전 버튼 클릭
  const onPreviousClickHandler = () => {
    if(currentSection === 1) return; 
    setCurrentPage((currentSection - 1) * 10); 
    setCurrentSection(currentSection - 1);
  }
  // 다음 버튼 클릭
  const onNextClickHandler = () => {
    if(currentSection === totalSection) return;
    setCurrentPage(currentSection * 10 + 1);
    setCurrentSection(currentSection + 1);
  }
  //#           Pagination 렌더링           //
  return (
    <div id='pagination__wrapper'>
        <div className='pagination__change-link-box'>
            <div className='app__icon-box-small'>
                <div className='app__icon app__expand-left-icon'></div>
            </div>
            <div className='pagination__change-link-text' onClick={onPreviousClickHandler}>{'이전'}</div>
        </div>
        <div className='pagination__divider'>{'|'}</div>

        {viewPageList.map(page =>
            page === currentPage
            ?<div key={page} className='pagination__text-active'>{page}</div>
            :<div key={page} className='pagination__text' onClick={() => onPageClickHandler(page)}>{page}</div>
        )}

        <div className='pagination__divider'>{'|'}</div>
        <div className='pagination__change-link-box'>
            <div className='pagination__link-text' onClick={onNextClickHandler}>{'다음'}</div>
            <div className='app__icon-box-small'>
                <div className='app__icon app__expand-right-icon'></div>
            </div>
        </div>
    </div>
  )
}
