import { EmailAuthProvider, getAuth, reauthenticateWithCredential } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { db, CurrentUserInfo } from "../Application";
import { CustomInput, RoundButton } from "./Register";

const MyInfo = () => {
  const auth = getAuth();
  const [authing, setAuthing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [file, setFile] = useState<File>();
  const [currentUserInfo, setCurrentUserInfo] = useState<CurrentUserInfo>();
  const [url, setUrl] = useState<string>();
  const passwordRef = useRef<HTMLInputElement>()
  
  const userRef = doc(db, "users", auth.currentUser?.uid);
  const getUserInfo = async () => {
    const userSnap = await getDoc(userRef);
    setCurrentUserInfo((userSnap.data() as CurrentUserInfo));
  }
  useEffect(() => {
    getUserInfo();
  }, []);
  useEffect(() => {
    if(currentUserInfo && currentUserInfo?.profileImg !== "") {
      imageDownload(currentUserInfo?.profileImg);
    } else if(auth.currentUser?.photoURL) {
      setUrl(auth.currentUser.photoURL);
    }
  }, [currentUserInfo, auth.currentUser])

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

  const imagePreview = () => {
    const preview = new FileReader();
    preview.onload = (e) => {
      (document.getElementById("previewImg") as HTMLImageElement).src = String(e.target.result);
    }
    setFile((document.getElementById("selectImg") as HTMLInputElement).files[0]);
    preview.readAsDataURL((document.getElementById("selectImg") as HTMLInputElement).files[0]);
  }

  const imageUpload = (file: File) => {
    const storage = getStorage();
    const storageRef = ref(storage, 'images/' + file.name);
    updateDoc(userRef, {profileImg: file.name});
    uploadBytes(storageRef, file)
    .then(() => {
      alert("성공적으로 storage에 올라갔습니다!")
    });
  }

  const imageDownload = (fileName: string) => {
    const storage = getStorage();
    getDownloadURL(ref(storage, 'images/' + fileName))
    .then((url) => {
      setUrl(url);
    })
    .catch((error) => {
      console.log(error);
    })
  }

  const confirmClick = () => {
    if(file !== undefined) {
      imageUpload(file)
    } else {
      alert("파일이 선택되지 않았습니다.")
    }
  }
  
  return (
    <>
      <section className="w-full mx-auto">
        <div className="mb-[7.75rem]">
          <h2 className="text-5xl font-bold">{currentUserInfo?.nickname} 님의 회원정보수정</h2>
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
        : (<>
          <div>회원 정보</div>
          <img id="previewImg" src={url} alt="" className="w-60 h-60 object-contain"/>
          <label htmlFor="selectImg" className="btn btn-secondary min-h-fit h-8">사진 선택</label>
          <input type="file" id="selectImg" accept="image/*" style={{display: "none"}} onChange={imagePreview}/>
          <button className="btn min-h-fit h-8" onClick={confirmClick}>확인</button>
        </>)
        }
      </section>
    </>
  )
};

export default MyInfo;