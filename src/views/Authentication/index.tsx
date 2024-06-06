import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import './style.css';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import InputBox from 'components/InputBox';
import { Address, useDaumPostcodePopup } from 'react-daum-postcode';
import { LoginResponseDTO, SignUpResponseDTO } from 'apis/response/auth';
import { ResponseDTO } from 'apis/response';
import { LoginRequestDTO, SignUpRequestDTO } from 'apis/request/auth';
import { loginRequest, signUpRequest } from 'apis';
import { MAIN_PATH } from 'constant';

//#             Authentication 컴포넌트             //
export default function Authentication() {
  //#           상태             //
  const [view, setView] = useState<'login' | 'sign-up'>('login'); // 화면 상태
  const [cookie, setCookie] = useCookies(); // 쿠키 상태
  //#           네비게이트            //
  const navigate = useNavigate();

  
  //#           SignUpCard 컴포넌트           //
  const SignUpCard = () => {
    //#         상태          //
    const [page, setPage] = useState<1 | 2>(1); // 페이지 번호 상태
    const emailRef = useRef<HTMLInputElement | null>(null); // 이메일 요소 참조 상태
    const passwordRef = useRef<HTMLInputElement | null>(null); // 비밀번호 요소 참조 상태
    const passwordCheckRef = useRef<HTMLInputElement | null>(null); // 비밀번호 확인 요소 참조 상태
    const nicknameRef = useRef<HTMLInputElement | null>(null); // 닉네임 요소 참조 상태
    const telNumberRef = useRef<HTMLInputElement | null>(null); // 전화번호 요소 참조 상태
    const addressRef = useRef<HTMLInputElement | null>(null); // 주소 요소 참조 상태
    const addressDetailRef = useRef<HTMLInputElement | null>(null); // 상세 주소 요소 참조 상태

    const [email, setEmail] = useState<string>(''); // 이메일 상태
    const [password, setPassword] = useState<string>(''); // 비밀번호 상태
    const [passwordCheck, setPasswordCheck] = useState<string>(''); // 비밀번호 확인 상태
    const [nickname, setNickname] = useState<string>(''); // 닉네임 상태
    const [telNumber, setTelNumber] = useState<string>(''); // 전화번호 상태
    const [address, setAddress] = useState<string>(''); // 주소 상태
    const [addressDetail, setAddressDetail] = useState<string>(''); // 상세 주소 상태
    const [agreedPersonal, setAgreedPersonal] = useState<boolean>(false); // 개인정보 동의 상태

    const [passwordType, setPasswordType] = useState<'text' | 'password'>('password'); // 비밀번호 타입 상태
    const [passwordCheckType, setPasswordCheckType] = useState<'text' | 'password'>('password'); // 비밀번호 확인 타입 상태
    const [isEmailError, setEmailError] = useState<boolean>(false); // 이메일 에러 상태
    const [isPasswordError, setPasswordError] = useState<boolean>(false); // 비밀번호 에러 상태
    const [isPasswordCheckError, setPasswordCheckError] = useState<boolean>(false); // 비밀번호 확인 에러 상태
    const [isNicknameError, setNicknameError] = useState<boolean>(false); // 닉네임 에러 상태
    const [isTelNumberError, setTelNumberError] = useState<boolean>(false); // 전화번호 에러 상태
    const [isAddressError, setAddressError] = useState<boolean>(false); // 주소 에러 상태
    const [isAgreedPersonalError, setAgreedPersonalError] = useState<boolean>(false); // 개인정보 동의 에러 상태

    const [emailErrorMessage, setEmailErrorMessage] = useState<string>(''); // 이메일 에러 메시지 상태
    const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>(''); // 비밀번호 에러 메시지 상태
    const [passwordCheckErrorMessage, setPasswordCheckErrorMessage] = useState<string>(''); // 비밀번호 확인 에러 메시지 상태
    const [nicknameErrorMessage, setNicknameErrorMessage] = useState<string>(''); // 닉네임 에러 메시지 상태
    const [telNumberErrorMessage, setTelNumberErrorMessage] = useState<string>(''); // 전화번호 에러 메시지 상태
    const [addressErrorMessage, setAddressErrorMessage] = useState<string>(''); // 주소 에러 메시지 상태

    const [passwordButtonIcon, setPasswordButtonIcon] = useState<'app__eye-light-off-icon' | 'app__eye-light-on-icon'>('app__eye-light-off-icon'); // 비밀번호 버튼 아이콘 상태
    const [passwordCheckButtonIcon, setPasswordCheckButtonIcon] = useState<'app__eye-light-off-icon' | 'app__eye-light-on-icon'>('app__eye-light-off-icon'); // 비밀번호 확인 버튼 아이콘 상태

    //#         다음 주소 검색창 팝업 오픈 함수         //
    const openDaumPostcodePopup = useDaumPostcodePopup();

    //#         회원가입 응답 처리 함수          //
    const signUpResponse = (responseBody: SignUpResponseDTO | ResponseDTO | null) => {
      if(!responseBody) {
        alert('네트워크 오류.');
        return;
      }
      const {code} = responseBody;
      if(code==='DE'){
        setEmailError(true);
        setEmailErrorMessage('이메일 형식이 아니거나, 이미 존재하는 이메일입니다.');
      }
      if(code==='DN'){
        setNicknameError(true);
        setNicknameErrorMessage('이미 존재하는 닉네임입니다.');
      }
      if(code==='DT'){
        setTelNumberError(true);
        setTelNumberErrorMessage('이미 존재하는 전화번호입니다.')
      }
      if(code==='VF') alert('모든 값은 필수입니다.');
      if(code==='DBE') alert('데이터베이스 오류...');
      if(code!=='SU') return;
      setView('login');
    }; //* signUpResponse */

    //#         onChange 이벤트 핸들러        //
    // 이메일 필드 변경
    const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const {value} = event.target;
      setEmail(value);
      setEmailError(false);
      setEmailErrorMessage('');
    }; //*  */
    // 비밀번호 필드 변경
    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const {value} = event.target;
      setPassword(value);
      setPasswordError(false);
      setPasswordErrorMessage('');
    }; //*  */
    // 비밀번호 확인 필드 변경
    const onPasswordCheckChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const {value} = event.target;
      setPasswordCheck(value);
      setPasswordError(false);
      setPasswordErrorMessage('');
    }; //*  */
    // 닉네임 필드 변경
    const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const {value} = event.target;
      setNickname(value);
      setNicknameError(false);
      setNicknameErrorMessage('');
    }; //*  */
    // 전화번호 필드 변경
    const onTelNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const {value} = event.target;
      setTelNumber(value);
      setTelNumberError(false);
      setTelNumberErrorMessage('');
    }; //*  */
    // 주소 필드 변경
    const onAddressChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const {value} = event.target;
      setAddress(value);
      setAddressError(false);
      setAddressErrorMessage('');
    }; //*  */
    // 상세 주소 필드 변경
    const onAddressDetailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const {value} = event.target;
      setAddressDetail(value);
    }; //*  */
    //#         onClick 이벤트 핸들러         //
    // 개인정보 동의 체크박스 클릭
    const onAgreedPersonalClickHandler = () => {
      setAgreedPersonal(!agreedPersonal);
      setAgreedPersonalError(false);
    }; //*  */
    // 비밀번호 표시하기/숨기기 버튼 클릭
    const onPasswordButtonClickHandler = () => {
      if(passwordButtonIcon === 'app__eye-light-off-icon') {
        setPasswordButtonIcon('app__eye-light-on-icon');
        setPasswordType('text');
      }else {
        setPasswordButtonIcon('app__eye-light-off-icon');
        setPasswordType('password');
      }
    }; //*  */
    // 비밀번호 확인 표시하기/숨기기 버튼 클릭
    const onPasswordCheckButtonClickHandler = () => {
      if(passwordCheckButtonIcon === 'app__eye-light-off-icon') {
        setPasswordCheckButtonIcon('app__eye-light-on-icon');
        setPasswordCheckType('text');
      }else {
        setPasswordCheckButtonIcon('app__eye-light-off-icon');
        setPasswordCheckType('password');
      }
    }; //*  */
    // 주소 버튼 클릭
    const onAddressButtonClickHandler = () => {
      openDaumPostcodePopup({onComplete});
    }; //*  */
    // 다음 주소 검색 완료 이벤트 처리
    const onComplete = (data: Address) => {
      const {address} = data;
      setAddress(address);
      setAddressError(false);
      setAddressErrorMessage('');
      if(!addressDetailRef.current) return;
      addressDetailRef.current.focus();
    }; //*  */
    // 1/2 페이지 다음 단계 버튼 클릭(검증)
    const onNextButtonClickHandler = () => {
      const emailPattern = /^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9])*\.[a-zA-Z]{2,4}$/;
      const isEmailPattern = emailPattern.test(email);
      if(!isEmailPattern){
        setEmailError(true);
        setEmailErrorMessage('올바른 이메일 형식이 아닙니다.');
      }
      const isCheckedPassword = password.trim().length >= 8;
      if(!isCheckedPassword){
        setPasswordError(true);
        setPasswordErrorMessage('8자 이상의 비밀번호를 입력해주세요.');
      }
      const isEqualPassword = password === passwordCheck;
      if(!isEqualPassword){
        setPasswordCheckError(true);
        setPasswordCheckErrorMessage('비밀번호가 일치하지 않습니다.');
      }
      if(!isEmailPattern || !isCheckedPassword || !isEqualPassword) return;
      setPage(2);
    }; //*  */
    // 회원가입 버튼 클릭(검증)
    const onSignUpButtonClickHandler = () => {
      const emailPattern = /^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9])*\.[a-zA-Z]{2,4}$/;
      const isEmailPattern = emailPattern.test(email);
      if(!isEmailPattern){
        setEmailError(true);
        setEmailErrorMessage('올바른 이메일 형식이 아닙니다.');
      }
      const isCheckedPassword = password.trim().length >= 8;
      if(!isCheckedPassword){
        setPasswordError(true);
        setPasswordErrorMessage('8자 이상의 비밀번호를 입력해주세요.');
      }
      const isEqualPassword = password === passwordCheck;
      if(!isEqualPassword){
        setPasswordCheckError(true);
        setPasswordCheckErrorMessage('비밀번호가 일치하지 않습니다.');
      }
      if(!isEmailPattern || !isCheckedPassword || !isEqualPassword) {
        setPage(1);
        return;
      }

      const isInputNickname = nickname.trim().length > 0;
      if(!isInputNickname) {
        setNicknameError(true);
        setNicknameErrorMessage('닉네임을 입력해주세요.');
      }
      const telNumberPattern = /^[0-9]{11,13}$/;
      const isTelNumberPattern = telNumberPattern.test(telNumber);
      if(!isTelNumberPattern) {
        setTelNumberError(true);
        setTelNumberErrorMessage('올바른 전화번호 형식이 아닙니다.');
      }
      const isInputAddress = address.trim().length > 0;
      if(!isInputAddress) {
        setAddressError(true);
        setAddressErrorMessage('주소를 기입해주세요.');
      }
      if(!agreedPersonal) {
        setAgreedPersonalError(true);
      }
      if(!isInputNickname || !isTelNumberPattern || !isInputAddress ||!agreedPersonal) return;
      const requestBody: SignUpRequestDTO = {
        email, password, nickname, telNumber, address, addressDetail, agreedPersonal
      };
      signUpRequest(requestBody).then(signUpResponse);
    }; //*  */
    // 로그인 링크 클릭
    const onLoginLinkClickHandler = () => {
      setView('login');
    }; //*  */
    //#         onKeyDown 이벤트 핸들러           //
    // 이메일 키다운
    const onEmailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if(event.key !== 'Enter') return;
      if(!passwordRef.current) return;
      passwordRef.current.focus();
    }; //*  */
    // 비밀번호 키다운
    const onPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if(event.key !== 'Enter') return;
      if(!passwordCheckRef.current) return;
      passwordCheckRef.current.focus();
    }; //*  */
    // 비밀번호 확인 키다운 //? 까지 1/2
    const onPasswordCheckKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if(event.key !== 'Enter') return;
      onNextButtonClickHandler();
    }; //*  */
    // 닉네임 키다운 //? 부터 2/2
    const onNicknameKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if(event.key !== 'Enter') return;
      if(!telNumberRef.current) return;
      telNumberRef.current.focus();
    }; //*  */
    // 전화번호 키다운
    const onTelNumberKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if(event.key !== 'Enter') return;
      onAddressButtonClickHandler();
    }; //*  */
    // 주소 키다운
    const onAddressKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if(event.key !== 'Enter') return;
      if(!addressDetailRef.current) return;
      addressDetailRef.current.focus();
    }; //*  */
    // 상세주소 키다운
    const onAddressDetailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if(event.key !== 'Enter') return;
      onSignUpButtonClickHandler();
    }; //*  */
    //#         page 이펙트           //
    useEffect(() => {
      if(page === 2) {
        if(!nicknameRef.current) return;
        nicknameRef.current.focus();
      }
    }, [page]) 
    //#         signUpCard 렌더링           //
    return (
      <div className='auth__card'>
        <div className='auth__card-box'>
          <div className='auth__card-top'>
            <div className='auth__card-title-box'>
              <div className='auth__card-title'>{'회원가입'}</div>
              <div className='auth__card-page'>{`${page}/2`}</div>
            </div>
            {page === 1 && (
              <>
                <InputBox ref={emailRef} label='*이메일' type='text' placeholder='이메일 주소(이메일 형식으로 입력해주세요)' value={email} onChange={onEmailChangeHandler} error={isEmailError} message={emailErrorMessage} onKeyDown={onEmailKeyDownHandler}/>
                <InputBox ref={passwordRef} label='*비밀번호' type={passwordType} placeholder='비밀번호(8자 이상 입력해주세요)' value={password} onChange={onPasswordChangeHandler} error={isPasswordError} message={passwordErrorMessage} onKeyDown={onPasswordKeyDownHandler} icon={passwordButtonIcon} onButtonClick={onPasswordButtonClickHandler}/>
                <InputBox ref={passwordCheckRef} label='*비밀번호 확인' type={passwordCheckType} placeholder='비밀번호 확인' value={passwordCheck} onChange={onPasswordCheckChangeHandler} error={isPasswordCheckError} message={passwordCheckErrorMessage} onKeyDown={onPasswordCheckKeyDownHandler} icon={passwordCheckButtonIcon} onButtonClick={onPasswordCheckButtonClickHandler}/>
              </>
            )}
            {page === 2 && (
              <>
                <InputBox ref={nicknameRef} label='*닉네임' type='text' placeholder='닉네임' value={nickname} onChange={onNicknameChangeHandler} error={isNicknameError} message={nicknameErrorMessage} onKeyDown={onNicknameKeyDownHandler}/>
                <InputBox ref={telNumberRef} label='*전화번호' type='text' placeholder='전화번호(숫자만 입력해주세요)' value={telNumber} onChange={onTelNumberChangeHandler} error={isTelNumberError} message={telNumberErrorMessage} onKeyDown={onTelNumberKeyDownHandler}/>
                <InputBox ref={addressRef} label='*주소' type='text' placeholder='우편번호 찾기' value={address} onChange={onAddressChangeHandler} error={isAddressError} message={addressErrorMessage} onKeyDown={onAddressKeyDownHandler} icon='app__expand-right-light-icon' onButtonClick={onAddressButtonClickHandler}/>
                <InputBox ref={addressDetailRef} label='상세 주소' type='text' placeholder='상세 주소' value={addressDetail} onChange={onAddressDetailChangeHandler} error={false} message={''} onKeyDown={onAddressDetailKeyDownHandler}/>
              </>
            )}
          </div>
          <div className='auth__card-bottom'>
            {page === 1 && (
              <div className='app__black-large-full-button' onClick={onNextButtonClickHandler}>{'다음 단계'}</div>
            )}
            {page === 2 && (
              <>
              <div className='auth__consent-box'>
                <div className='auth__check-box' onClick={onAgreedPersonalClickHandler}>
                  <div className={`app__icon ${agreedPersonal?'app__check-round-fill-icon':'app__check-ring-light-icon'}`}></div>
                </div>
                <div className={isAgreedPersonalError?'auth__consent-title-error':'auth__consent-title'}>{'개인정보동의'}</div>
                <div className='auth__consent-link'>{'더보기 >'}</div>
              </div>
              <div className='app__black-large-full-button' onClick={onSignUpButtonClickHandler}>{'회원가입'}</div>
              </>
            )}
            <div className='auth__description-box'>
              <div className='auth__description'>{'이미 계정이 있으신가요? '}<span className='auth__description-link' onClick={onLoginLinkClickHandler}>{'로그인'}</span></div>
            </div>
          </div>
        </div>
      </div>
    )
  }; //* SignUpCard */


  //#           LoginCard 컴포넌트             //
  const LoginCard = () => {
    //#         상태          //
    const emailRef = useRef<HTMLInputElement | null>(null); // 이메일 요소 참조 상태
    const passwordRef = useRef<HTMLInputElement | null>(null); // 비밀번호 요소 참조 상태
    
    const [email, setEmail] = useState<string>(''); // 이메일 상태
    const [password, setPassword] = useState<string>(''); // 비밀번호 상태
    const [passwordType, setPasswordType] = useState<'text' | 'password'>('password'); // 비밀번호 타입 상태
    const [passwordButtonIcon, setPasswordButtonIcon] = useState<'app__eye-light-off-icon'|'app__eye-light-on-icon'>('app__eye-light-off-icon'); // 비밀번호 표시/숨기기 버튼 아이콘 상태
    const [error, setError] = useState<boolean>(false); // 에러 상태
    //#         로그인 응답 처리 함수       //
    const loginResponse = (responseBody: LoginResponseDTO | ResponseDTO | null) => {
      if(!responseBody){
        alert('네트워크 오류.');
        return;
      }
      const {code} = responseBody;
      if(code==='DBE') alert('데이터베이스 오류');
      if(code==='LF' || code==='VF') {
        setError(true);
      }
      if(code!=='SU') return;

      const {token, expirationTime} = responseBody as LoginResponseDTO;
      const nowToken = new Date().getTime();
      const expirationToken = new Date(nowToken + expirationTime * 1000);

      setCookie('accessToken', token, {expires: expirationToken, path:MAIN_PATH()});
      navigate(MAIN_PATH());
    }; //* */
    //#         onChange 이벤트 핸들러        //
    // 이메일 변경
    const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      setError(false);
      const {value} = event.target;
      setEmail(value);
    };
    // 비밀번호 변경
    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      setError(false);
      const {value} = event.target;
      setPassword(value);
    };
    //#         onClick 이벤트 핸들러        //
    // 로그인 버튼 클릭
    const onLoginButtonClickHandler = () => {
      const isInputEmail = email.trim().length > 0;
      const isInputPassword = password.trim().length > 0;
      if(!isInputEmail || !isInputPassword) {
        setError(true);
      }

      if(!isInputEmail || !isInputPassword) return;

      const requestBody: LoginRequestDTO = {email, password};
      loginRequest(requestBody).then(loginResponse);
    };
    // 회원가입 링크 클릭
    const onSignUpButtonClickHandler = () => {
      setView('sign-up');
    };
    // 비밀번호 표시/숨기기 아이콘 버튼 클릭
    const onPasswordButtonClickHandler = () => {
      if(passwordType === 'text') {
        setPasswordType('password');
        setPasswordButtonIcon('app__eye-light-off-icon');
      } else {
        setPasswordType('text');
        setPasswordButtonIcon('app__eye-light-on-icon');
      }
    };
    //#         onKeyDown 이벤트 핸들러       //
    // 이메일 키다운
    const onEmailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if(event.key !== 'Enter') return;
      if(!passwordRef.current) return;
      passwordRef.current.focus();
    };
    // 비밀번호 키다운
    const onPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if(event.key !== 'Enter') return;
      onLoginButtonClickHandler();
    };
    //#         LoginCard 렌더링           //
    return(
      <div className='auth__card'>
        <div className='auth__card-box'>
          <div className='auth__card-top'>
            <div className='auth__card-title-box'>
              <div className='auth__card-title'>{'로그인'}</div>
            </div>
            <InputBox ref={emailRef} label='이메일' type='text' placeholder='이메일' error={error} value={email} onChange={onEmailChangeHandler} onKeyDown={onEmailKeyDownHandler}/>
            <InputBox ref={passwordRef} label='비밀번호' type={passwordType} placeholder='비밀번호' error={error} value={password} onChange={onPasswordChangeHandler} onKeyDown={onPasswordKeyDownHandler} icon={passwordButtonIcon} onButtonClick={onPasswordButtonClickHandler}/>
          </div>
          <div className='auth__card-bottom'>
            {error &&
            <div className='auth__login-error-box'>
              <div className='auth__login-error-message'>
                {'해당 이메일이 존재하지 않거나 비밀번호가 일치하지 않습니다.'}
              </div>
            </div>
            }
            <div className='app__black-large-full-button' onClick={onLoginButtonClickHandler}>{'로그인'}</div>
            <div className='auth__description-box'>
              <div className='auth__description'>{'계정이 없으신가요? '}<span className='auth__description-link' onClick={onSignUpButtonClickHandler}>{'회원가입'}</span></div>
            </div>
          </div>
        </div>
      </div>
    )
  }; //* LoginCard */


  //#           Authentication 렌더링          //
  return (
    <div id='auth__wrapper'>
      <div className='auth__container'>
        <div className='auth__screen-box'>
          <div className='auth__screen-contents'>
            <div className='auth__logo-icon'></div>
            <div className='auth__screen-text-box'>
              <div className='auth__screen-text'>{'반가워요!'}</div>
            </div>
          </div>
        </div>
        {view === 'sign-up' && <SignUpCard/>}
        {view === 'login' && <LoginCard/>}
      </div>
    </div>
  )
} //* Authentication */
