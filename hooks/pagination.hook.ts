import { useEffect, useState } from "react";

const usePagination = <T>(countPerPage: number) => {
    //#         상태          //
    const [totalList, setTotalList] = useState<T[]>([]); // 전체 객체 리스트 상태
    const [viewList, setViewList] = useState<T[]>([]); // 현재 페이지에서 보여줄 객체 리스트 상태
    const [currentPage, setCurrentPage] = useState<number>(1); // 현재 페이지 번호 상태
    const [totalPageList, setTotalPageList] = useState<number[]>([1]); // 전체 페이지 번호 리스트 상태
    const [viewPageList, setViewPageList] = useState<number[]>([1]); // 현재 섹션에서 보여줄 페이지 번호 리스트 상태
    const [currentSection, setCurrentSection] = useState<number>(1); // 현재 섹션 번호 상태
    const [totalSection, setTotalSection] = useState<number>(1); // 전체 섹션 수 상태
    //#         현재 페이지에 따라 보여줄 객체 리스트를 추출하는 함수           //
    const setView = () => {
        const FIRST_INDEX = countPerPage * (currentPage - 1);
        const LAST_INDEX = totalList.length > countPerPage * currentPage ? countPerPage * currentPage : totalList.length;
        const viewList = totalList.slice(FIRST_INDEX, LAST_INDEX); // ex) 0, 1, 2
        setViewList(viewList);
    };
    //#         현재 섹션에 따라 보여줄 페이지 리스트를 추출하는 함수           //
    const setViewPage = () => {
        const FIRST_INDEX = 10 * (currentSection - 1);
        const LAST_INDEX = totalPageList.length > 10 * currentSection ? 10 * currentSection : totalPageList.length;
        const viewPageList = totalPageList.slice(FIRST_INDEX, LAST_INDEX);
        setViewPageList(viewPageList);
    };
    //#         totalList 이펙트 (전체 페이지 리스트, 전체 섹션 수 재계산 후 현재 페이지, 섹션 초기화)          //
    useEffect(() => {
        const totalPage = Math.ceil(totalList.length / countPerPage);
        const totalPageList: number[] = [];
        for(let page = 1; page <= totalPage; page++) totalPageList.push(page);
        setTotalPageList(totalPageList);
        
        const totalSection = Math.ceil(totalList.length / (countPerPage * 10));
        setTotalSection(totalSection);

        setCurrentPage(1);
        setCurrentSection(1);

        setView();
        setViewPage();
    }, [totalList])
    //#         currentPage 이펙트 (보여줄 객체 리스트 업데이트)            //
    useEffect(setView, [currentPage])
    //#         currentSection 이펙트 (보여줄 페이지 리스트 업데이트)           //
    useEffect(setViewPage, [currentSection])
    return {
        currentPage,
        setCurrentPage,
        currentSection,
        setCurrentSection,
        viewList,
        viewPageList,
        totalSection,
        setTotalList
    }
};

export default usePagination;