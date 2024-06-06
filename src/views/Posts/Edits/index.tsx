import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import './style.css';
import { useNavigate, useParams } from 'react-router-dom';
import usePostsStore from 'stores/posts.store';
import useLoginUserStore from 'stores/login-user.store';
import { useCookies } from 'react-cookie';
import { ResponseDTO } from 'apis/response';
import { MAIN_PATH } from 'constant';
import { convertUrlsToFile } from 'utils';
import { detailPostsRequest } from 'apis';
import { DetailPostsResponseDTO } from 'apis/response/posts';
//#             EditPosts 컴포넌트           //
export default function EditPosts() {
  //#           상태            //
  const titleRef = useRef<HTMLTextAreaElement | null>(null); // 제목 textarea 요소 참조 상태
  const contentRef = useRef<HTMLTextAreaElement | null>(null); // 내용 textarea 요소 참조 상태
  const imageInputRef = useRef<HTMLInputElement | null>(null); // 이미지 input 요소 참조 상태

  const {postsNumber} = useParams(); // 게시물 번호 경로 변수 상태
  
  // 게시물 상태
  const {title, setTitle} = usePostsStore();
  const {content, setContent} = usePostsStore();
  const {postsImageFileList, setPostsImageFileList} = usePostsStore();

  const {loginUser} = useLoginUserStore(); // 로그인한 유저 상태

  const [cookie, setCookie] = useCookies(); // 쿠키 상태

  const [imageUrls, setImageUrls] = useState<string[]>([]); // 게시물 이미지 미리보기 URL 상태
  //#           네비게이트 함수           //
  const navigate = useNavigate();
  //#           detailPostsResponse 처리 함수          //
  const detailPostsResponse = (responseBody: DetailPostsResponseDTO | ResponseDTO | null) => {
    if(!responseBody) return;
    const {code} = responseBody;
    if(code === 'NEP') alert('존재하지 않는 게시물입니다.');
    if(code === 'DBE') alert('데이터베이스 오류.');
    if(code !== 'SU') {
      navigate(MAIN_PATH());
      return;
    }

    const {title, content, postsImageList, writerEmail} = responseBody as DetailPostsResponseDTO;
    setTitle(title);
    setContent(content);
    setImageUrls(postsImageList);
    convertUrlsToFile(postsImageList).then(postsImageFileList => setPostsImageFileList(postsImageFileList));

    if(!loginUser || loginUser.email !== writerEmail) {
      navigate(MAIN_PATH());
      return;
    }

    if(!contentRef.current) return;
    contentRef.current.style.height = 'auto';
    contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
  }; //* */
  //#           onChange 이벤트 핸들러            //
  // 제목 변경
  const onTitleChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const {value} = event.target;
    setTitle(value);
    if (!titleRef.current) return;
    titleRef.current.style.height = 'auto';
    titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
  }; //* */
  // 내용 변경
  const onContentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const {value} = event.target;
    setContent(value);

    if (!contentRef.current) return;
    contentRef.current.style.height = 'auto';
    contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
  }; //* */
  // 이미지 변경
  const onImageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if(!event.target.files || !event.target.files.length) return;
    const file = event.target.files[0];

    const imageUrl = URL.createObjectURL(file);
    const newImageUrls = imageUrls.map(item => item);
    newImageUrls.push(imageUrl);
    setImageUrls(newImageUrls);

    const newPostsImageFileList = postsImageFileList.map(item => item);
    newPostsImageFileList.push(file);
    setPostsImageFileList(newPostsImageFileList);

    if(!imageInputRef.current) return;
    imageInputRef.current.value = '';
  }; //* */
  //#           onClick 이벤트 핸들러           //
  // 이미지 업로드 버튼 클릭
  const onImageUploadButtonClickHandler = () => {
    if(!imageInputRef.current) return;
    imageInputRef.current.click();
  }; //* */
  // 이미지 삭제 버튼 클릭
  const onImageDeleteButtonClickHandler = (deleteIndex: number) => {
    if(!imageInputRef.current) return;
    imageInputRef.current.value = '';

    const newImageUrls = imageUrls.filter((url, index) => index !== deleteIndex);
    setImageUrls(newImageUrls);

    const newPostsImageFileList = postsImageFileList.filter((file, index) => index !== deleteIndex);
    setPostsImageFileList(newPostsImageFileList);
  }; //* */
  //#           마운트 시 실행 이펙트           //
  useEffect(() => {
    const accessToken = cookie.accessToken;
    if (!accessToken) {
      navigate(MAIN_PATH());
      return;
    }
    if(!postsNumber) return;
    detailPostsRequest(postsNumber).then(detailPostsResponse);
  }, [postsNumber])
  //#           EditPosts 렌더링             //
  return (
    <div id='edit-posts__wrapper'>
      <div className='edit-posts__container'>
        <div className='edit-posts__box'>
          <div className='edit-posts__title-box'>
            <textarea className='edit-posts__title-textarea' ref={titleRef} rows={1} placeholder='제목을 작성해주세요.' value={title} onChange={onTitleChangeHandler}/>
          </div>
          <div className='app__divider'></div>
          <div className='edit-posts__content-box'>
            <textarea className='edit-posts__content-textarea' ref={contentRef} placeholder='내용을 작성해주세요.' value={content} onChange={onContentChangeHandler}/>
            <div className='app__icon-button' onClick={onImageUploadButtonClickHandler}>
              <div className='app__icon app__image-box-light-icon'></div>
            </div>
            <input ref={imageInputRef} type='file' accept='image/*' style={{display: 'none'}} onChange={onImageChangeHandler}/>
          </div>
          <div className='edit-posts__images-box'>
            {imageUrls.map((imageUrls, index) =>
              <div className='edit-posts__image-box'>
                <img className='edit-posts__image' src={imageUrls}/>
                <div className='app__icon-button edit-posts__image-close' onClick={() => onImageDeleteButtonClickHandler(index)}>
                  <div className='app__icon app__close-icon'></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
