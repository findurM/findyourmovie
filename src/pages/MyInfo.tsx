import { EmailAuthProvider, getAuth, reauthenticateWithCredential } from "firebase/auth";
import { useRef, useState } from "react";
import { CustomInput, RoundButton } from "./Register";

const MyInfo = () => {
  const auth = getAuth();
  const [authing, setAuthing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const passwordRef = useRef<HTMLInputElement>()

  const signIn = async () => {
    setAuthing(true)
    if(passwordRef.current) {
      const email = auth.currentUser.email
      const password = passwordRef.current.value
      const credential = EmailAuthProvider.credential(email, password);
      try {
        await reauthenticateWithCredential(auth.currentUser, credential);
        setIsConfirmed(true);
        setAuthing(false)
      } catch(error) {
        alert('비밀번호를 잘못 입력하셨습니다.')
        passwordRef.current.value = ''
      }
    }
  }
  
  return (
    <>
      <section className="w-full mx-auto">
        <div className="mb-[7.75rem]">
          <h2 className="text-5xl font-bold">{auth.currentUser.displayName} 님의 회원정보수정</h2>
          <hr/>
        </div>
        {auth.currentUser.providerData[0].providerId === "password" && !isConfirmed ?
        (<>
          <p className="text-lg mb-[1.875rem]">회원정보 조회를 위해 비밀번호를 입력해주세요.</p>
          <div className="flex gap-5">
            <CustomInput
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="비밀번호를 입력하세요"
              ref={passwordRef}
              className="h-12 max-w-[32.5rem]"
            />
            <RoundButton className="text-2xl h-12 w-fit px-5 py-0" onClick={signIn} disabled={authing} type="submit">
              확인
            </RoundButton>
          </div>
        </>)
        : (<div>회원 정보</div>)
        }
      </section>
    </>
  )
};

export default MyInfo;