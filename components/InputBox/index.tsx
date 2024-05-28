import React, { ChangeEvent, KeyboardEvent, forwardRef } from 'react'
import './style.css';
//#             Props 인터페이스            //
interface Props {
    label: string;
    type: 'text' | 'password';
    placeholder: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    error: boolean;

    icon?: 'app__eye-light-off-icon' | 'app__eye-light-on-icon' | 'app__expand-right-light-icon';
    onButtonClick?: () => void;
    message?: string;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}
//#             InputBox 컴포넌트           //
const InputBox = forwardRef<HTMLInputElement, Props>((props: Props, ref) => {
    //#         props 속성          //
    const {label, type, placeholder, value, error, icon, message} = props;
    const {onChange, onButtonClick, onKeyDown} = props;
    //#         input 키다운 이벤트를 처리하는 함수         //
    const onKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if(!onKeyDown) return;
        onKeyDown(event);
    };
    //#         렌더링          //
    return(
        <div className='inputbox'>
            <div className='inputbox__label'>{label}</div>
            <div className={error?'inputbox__container--error':'inputbox__container'}>
                <input ref={ref} type={type} className='inputbox__input' placeholder={placeholder}
                    value={value} onChange={onChange} onKeyDown={onKeyDownHandler} />
                {onButtonClick !== undefined &&
                    <div className='app__icon-button' onClick={onButtonClick}>
                        {icon !== undefined && <div className={`app__icon ${icon}`}></div>}
                    </div>
                }
            </div>
            {message !== undefined && <div className='inputbox__message'>{message}</div>}
        </div>
    );
});

export default InputBox;