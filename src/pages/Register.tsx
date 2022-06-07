import React, { useRef, useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { LockClosedIcon } from '@heroicons/react/solid'
import tw from "tailwind-styled-components"

export interface ILoginPageProps {}

export const CustomInput = tw.input`
appearance-none
rounded-md
relative
block
w-full
px-3
py-2
border
border-gray-300 
placeholder-gray-500 
text-gray-900 
rounded-b-md 
focus:outline-none 
focus:ring-indigo-500 
focus:border-indigo-500 
focus:z-10 sm:text-sm
bg-base-300
mt-2
`
export const InputBox = tw.div`
py-2
`

export const RoundButton = tw.button`
group 
relative 
w-4/12
flex 
rounded-full
justify-center 
py-3
px-4 
mt-2
border 
border-transparent 
text-sm font-medium 
text-white 
bg-indigo-600 
hover:bg-indigo-700 
focus:outline-none 
focus:ring-2 
focus:ring-offset-2 
focus:ring-indigo-500
min-w-max
`



const LoginPage: React.FunctionComponent<ILoginPageProps> = (props) => {
    const navigate = useNavigate();
    const auth = getAuth()
    const [authing, setAuthing] = useState(false);
    const emailRef = useRef<HTMLInputElement>()
    const passwordRef = useRef<HTMLInputElement>()
    const passwordConfirmRef = useRef<HTMLInputElement>()
    
    const signup = async () => {
      setAuthing(true)
      if(emailRef.current && passwordRef.current && passwordConfirmRef.current) {
        const email = emailRef.current.value
        const password = passwordRef.current.value
        const passwordConfirm = passwordConfirmRef.current.value
        if(password != passwordConfirm) {
          alert('비밀번호를 다르게 입력하셨습니다')
          emailRef.current.value=''
          passwordRef.current.value=''
          passwordConfirmRef.current.value=''
          return 
        }
        await createUserWithEmailAndPassword(auth,email,password)
      }
      setAuthing(false)
      navigate('/')
    }


    return (
    <div>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-1/3 space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">FindurM</h2>
          </div>
          <form className="mt-8 space-y-6">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <InputBox>
                <label htmlFor="email-address">
                  이메일
                </label>
                <CustomInput
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="이메일을 입력하세요"
                  ref={emailRef}
                />
              </InputBox>
              <InputBox>
                <label htmlFor="password">
                  비밀번호
                </label>
                <CustomInput
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="비밀번호를 입력하세요"
                  ref={passwordRef}
                />
              </InputBox>
              <InputBox>
                <label htmlFor="password">
                  비밀번호 확인
                </label>
                <CustomInput
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="비밀번호를 다시 한 번 입력하세요"
                  ref={passwordConfirmRef}
                />
              </InputBox>
              <InputBox>
                <label htmlFor="password" >
                  닉네임
                </label>
                <CustomInput
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="사용하실 닉네임을 입력하세요"
                  ref={passwordConfirmRef}
                />
              </InputBox>
            </div>

            <div className='flex justify-center'>
              <RoundButton onClick={signup} disabled={authing}
                type="submit"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                </span>
                  회원가입
              </RoundButton>
            </div>
          </form>
        </div>
      </div>
    </div>
    );
};

export default LoginPage;
