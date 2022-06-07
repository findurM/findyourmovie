import React, { useRef, useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { CustomInput, RoundButton  } from './Register';
import {FaGooglePlus} from 'react-icons/fa'
import { toast } from 'react-toastify';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../Application';

export interface ILoginPageProps {}

const LoginPage: React.FunctionComponent<ILoginPageProps> = (props) => {
    const auth = getAuth();
    const navigate = useNavigate();
    const [authing, setAuthing] = useState(false);
    const emailRef = useRef<HTMLInputElement>()
    const passwordRef = useRef<HTMLInputElement>()

    const signIn = async () => {
      setAuthing(true)
      if(emailRef.current && passwordRef.current) {
        const email = emailRef.current.value
        const password = passwordRef.current.value
        try {
          await signInWithEmailAndPassword(auth,email,password)
          setAuthing(false)
          navigate('/')
        } catch(error) {
          toast.error('이메일 혹은 비밀번호를 잘못 입력하셨습니다!')
          emailRef.current.value = ''
          passwordRef.current.value = ''
          setAuthing(false)
        }
      }
    }
    const signInWithGoogle = async () => {
        setAuthing(true);

        signInWithPopup(auth, new GoogleAuthProvider())
            .then((response) => {
                setDoc(doc(db,"users", response.user?.uid), {id: response.user?.uid , email:response.user?.email, nickname: response.user?.displayName})
                navigate('/');
                setAuthing(false);
            })
            .catch((error) => {
                setAuthing(false);
            });
    };

    return (
    <div className='bg-base-300 min-h-screen flex flex-col sm:flex-row sm:justify-around pt-20'>
      <div className=" h-5/6 sm:w-5/12 flex items-center mx-auto w-full justify-center py-5 px-4 sm:px-3 lg:px-5 bg-base-100 rounded-lg">
        <div className="max-w-md w-2/3 space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">로그인</h2>
          </div>
          <form className="mt-8 space-y-6" action="#" method="POST">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
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
              </div>
              <div className='py-3'>
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
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  이메일 기억하기
                </label>
              </div>

              <div className="text-sm">
                <a className="font-medium text-accent hover:text-indigo-500">
                  비밀번호 찾기
                </a>
              </div>
            </div>

            <div className='flex justify-center py-1'>
            <RoundButton onClick={() => signIn()} disabled={authing} type="submit">
                로그인
            </RoundButton>
            </div>
            <div onClick={() => signInWithGoogle()} className='cursor-pointer flex justify-between w-36 m-auto py-5'>
                구글로 로그인 <FaGooglePlus size={24}/>
            </div>
          </form>
        </div>
      </div>
      <div className='flex-col w-4/12 pt-24 mx-auto'>
        <div>
        <p className='text-5xl font-bold'>Hello, <br/> Welcome Friend!</p>
        <p className='mt-10 text-lg'>회원가입하고 많은 혜택을 누려보세요!</p>
        </div>
        <RoundButton className="mx-auto my-10" >
        <Link to='/register'>
                회원가입
          </Link>
        </RoundButton>
      </div>
    </div>
    );
};

export default LoginPage;
