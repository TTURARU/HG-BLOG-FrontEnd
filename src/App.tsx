import Container from 'layouts/Container';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AUTH_PATH, MAIN_PATH, POSTS_CREATE_PATH, POSTS_DETAIL_PATH, POSTS_EDIT_PATH, POSTS_PATH, SEARCH_PATH, USER_PATH } from 'constant';
import Authentication from 'views/Authentication';
import Main from 'views/Main';
import Search from 'views/Search';
import User from 'views/User';
import CreatePosts from 'views/Posts/Creates';
import DetailPosts from 'views/Posts/Details';
import EditPosts from 'views/Posts/Edits';
import useLoginUserStore from 'stores/login-user.store';
import { useCookies } from 'react-cookie';
import { useEffect } from 'react';
import GetLoginUserResponseDTO from 'apis/response/user/get-login-user.response.dto';
import { ResponseDTO } from 'apis/response';
import { IUser } from 'types/interface';
import { getLoginUserRequest } from 'apis';


//#           App 컴포넌트            //
function App() {
  //#         상태          //
  const {setLoginUser, resetLoginUser} = useLoginUserStore(); // 로그인 유저 전역 상태 관리
  const [cookie, setCookie] = useCookies(); // 쿠키 상태 관리
  //#         getLoginUserResponse 처리 함수          //
  const getLoginUserResponse = (responseBody: GetLoginUserResponseDTO | ResponseDTO | null) => {
    if(!responseBody) return;
    const {code} = responseBody;
    if(code==='AF' || code==='NEU' || code==='DBE') {
      resetLoginUser();
      return;
    }
    const loginUser: IUser = {...responseBody as GetLoginUserResponseDTO};
    setLoginUser(loginUser);
  };
  //#         cookie.accessToken 이펙트         //
  useEffect(() => {
    if(!cookie.accessToken) {
      resetLoginUser();
      return;
    }
    getLoginUserRequest(cookie.accessToken).then(getLoginUserResponse);
  }, [cookie.accessToken])
  //#         App 렌더링          //
  // MAIN_PATH : '/'
  // AUTH_PATH : '/auth'
  // SEARCH_PATH : '/search/:searchWord'
  // USER_PATH : '/user/:userEmail'
  // POSTS_PATH : '/posts'
  // POSTS_CREATE_PATH : '/posts/creates'
  // POSTS_DETAIL_PATH : '/posts/detail/:postsNumber'
  // POSTS_EDIT_PATH : '/posts/edit/:postsNumber'
  return (
    <Router>
      <Routes>
        <Route element={<Container/>}>
          <Route path={MAIN_PATH()} element={<Main/>}></Route>
          <Route path={AUTH_PATH()} element={<Authentication/>}></Route>
          <Route path={SEARCH_PATH(':searchWord')} element={<Search/>}></Route>
          <Route path={USER_PATH(':userEmail')} element={<User/>}></Route>
          <Route path={POSTS_PATH()}>
            <Route path={POSTS_CREATE_PATH()} element={<CreatePosts/>}></Route>
            <Route path={POSTS_DETAIL_PATH(':postsNumber')} element={<DetailPosts/>}></Route>
            <Route path={POSTS_EDIT_PATH(':postsNumber')} element={<EditPosts/>}></Route>
          </Route>
          <Route path='*' element={<h1>404 Not Found</h1>}></Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
