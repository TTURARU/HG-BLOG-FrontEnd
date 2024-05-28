import { AUTH_PATH } from 'constant';
import Footer from 'layouts/Footer';
import Header from 'layouts/Header';
import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'

//#             Container 컴포넌트              //
export default function Container() {
  //#           상태          //
  const {pathname} = useLocation(); // 현재 페이지 경로 이름 상태
  //#           렌더링              //
  return (
    <>
    <Header/>
    <Outlet/>
    {pathname !== AUTH_PATH() && <Footer/>}
    </>
  );
}
