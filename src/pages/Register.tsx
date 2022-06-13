import React, { useRef, useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import tw from "tailwind-styled-components"
import {useForm,SubmitHandler } from 'react-hook-form';
import { db } from '../Application';
import {setDoc, doc} from 'firebase/firestore'

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
const Warning = tw.p`
text-rose-600
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
focus:outline-none 
focus:ring-2 
focus:ring-offset-2 
btn
btn-secondary 
min-w-max
`
export interface ILoginPageProps {}

interface IFormInputs {
  email: string
  password: string
  nickname: string
  passwordConfirm: string
}

const LoginPage: React.FunctionComponent<ILoginPageProps> = (props) => {
  const { register, formState: { errors }, handleSubmit, watch } = useForm<IFormInputs>()

    watch("password")
    const auth = getAuth()
    const navigate = useNavigate()
    const [authing, setAuthing] = useState(false);
    const [age, setAge] = useState(20)
    const [selectedRadio, setSelectedRadio] = useState('여')

    const ageRef = useRef<HTMLInputElement>()

    const onSubmit: SubmitHandler<IFormInputs> = async(data) => {
      await createUserWithEmailAndPassword(auth,data.email,data.password)
      await setDoc(doc(db,"users", auth.currentUser?.uid), 
                        {id: auth.currentUser?.uid , 
                        email:data.email, 
                        nickname: data.nickname,
                        profileImg: "",
                        age: age,
                        sex: selectedRadio})
      navigate('/')
    }

    const handleRange = () => {
      setAge(Number(ageRef.current.value))
    }

    const isRadioSelected = (value:string) : boolean => selectedRadio === value

    const handleRadio = (e: React.ChangeEvent<HTMLInputElement>): void => {
      setSelectedRadio(e.currentTarget.value)
    }

    return (
    <div>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-1/3 space-y-8">
          <div>
            <img src="/assets/Findurm_regular_logo.png" alt="FindurM Logo"/>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                  placeholder="이메일을 입력하세요"
                  {...register("email",{required: true})}
                />
                <Warning>{errors.email && "이메일을 입력해 주십시오"}</Warning>
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
                  placeholder="비밀번호를 입력하세요"
                  {...register("password",{required: true, minLength: 6})}
                />
                <Warning> 
                  {errors.password && errors.password.type === "required" && (
                    "필수 입력 사항입니다"
                  )}
                  {errors.password && errors.password.type === "minLength" && (
                    "최소 6자리 이상이어야 합니다"
                  )}
                </Warning>
              </InputBox>
              <InputBox>
                <label htmlFor="passwordConfirm">
                  비밀번호 확인
                </label>
                <CustomInput
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type="password"
                  autoComplete="current-password"
                  placeholder="비밀번호를 다시 한 번 입력하세요"
                  {...register("passwordConfirm",{required: true,
                    validate: (val: string) => {
                      if (watch('password') != val) {
                        return "비밀번호가 일치하지 않습니다!";
                      }}})}
                />
                <Warning>{errors.passwordConfirm?.message}</Warning>
              </InputBox>
              <InputBox>
                <label htmlFor="nickname" >
                  닉네임
                </label>
                <CustomInput
                  id="nickname"
                  name="nickname"
                  type="text"
                  autoComplete="nickname"
                  placeholder="사용하실 닉네임을 입력하세요"
                  {...register("nickname",{required: true})}
                />
                <Warning>{errors.nickname && '닉네임을 입력해 주십시오'}</Warning>
              </InputBox>
              <InputBox>
                <label htmlFor="sex">
                  성별
                </label>
                <div className='mt-3 w-full flex'>
                  <div className='mr-3 flex justify-between w-10'> 
                    <span>남</span>
                    <input type="radio" name="radio-3" value='남' className="radio radio-secondary" 
                    checked={isRadioSelected('남')} 
                    onChange={handleRadio} />
                  </div>
                  <div className='flex justify-between w-10'>
                    <span>여</span>
                    <input type="radio" name="radio-3" value='여' className="radio radio-secondary" 
                     checked={isRadioSelected('여')} 
                     onChange={handleRadio} />
                  </div>
                </div>
              </InputBox>
              <InputBox>
                <label htmlFor="age">
                  나이: {age}세
                </label>
                <input 
                type="range" min="10" max="90" value={age} step="1" className="range range-secondary my-3"
                id='age'
                name='age'
                onChange={handleRange}
                ref={ageRef}
               />
              </InputBox>
            </div>

            <div className='flex justify-center'>
              <RoundButton  disabled={authing}
                type="submit"
              >
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
