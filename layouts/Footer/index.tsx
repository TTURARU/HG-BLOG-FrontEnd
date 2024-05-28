import React from 'react'
import './style.css';

//#             Footer 레이아웃 컴포넌트            //
export default function Footer() {
  //#           인스타 아이콘 버튼 클릭했을 때 인스타 웹사이트 여는 함수          //
  const instaIconClickHandler = () => {
    window.open('https://www.instagram.com');
  }
  //#           네이버 아이콘 버튼 클릭했을 때 네이버 웹사이트 여는 함수            //
  const naverIconClickHandler = () => {
    window.open('https://www.naver.com');
  }
  //#           렌더링          //
  return (
    <div id='footer'>
        <div className='footer__container'>
            {/* 탑 */}
            <div className='footer__top'>
                <div className='footer__logo-box'>
                    <div className='app__icon-box'>
                        <div className='app__icon app__logo-light-icon'></div>
                    </div>
                    <div className='footer__logo-text'>{'HG Blog'}</div>
                </div>
                <div className='footer__link-box'>
                    <div className='footer__email-link'>{'bho913@naver.com'}</div>
                    <div className='app__icon-button' onClick={instaIconClickHandler}>
                        <div className='app__icon app__insta-icon'></div>
                    </div>
                    <div className='app__icon-button' onClick={naverIconClickHandler}>
                        <div className='app__icon app__naver-blog-icon'></div>
                    </div>
                </div>
            </div>
            {/* 바텀 */}
            <div className='footer__bottom'>
                <div className='footer__copyright'>{'ⓒ 2024. HG All rights reserved.'}</div>
            </div>
        </div>
    </div>
  )
}
