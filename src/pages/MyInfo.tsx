import { EmailAuthProvider, getAuth, reauthenticateWithCredential } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useCallback, useEffect, useRef, useState } from "react";
import { db, CurrentUserInfo } from "../Application";
import { CustomInput, RoundButton } from "./Register";

const MyInfo = () => {
  const auth = getAuth();
  const localStorageUserInfo = JSON.parse(localStorage.getItem('user'))
  const [authing, setAuthing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [file, setFile] = useState<File>();
  const [currentUserInfo, setCurrentUserInfo] = useState<CurrentUserInfo>();
  const [url, setUrl] = useState<string>();
  const passwordRef = useRef<HTMLInputElement>()
  const [isLoading, setIsLoading] = useState(true);
  const [nicknameInputValue, setNicknameInputValue] = useState<string>();
  
  const userRef = doc(db, "users", localStorageUserInfo.uid);
  const getUserInfo = async () => {
    const userSnap = await getDoc(userRef);
    setCurrentUserInfo((userSnap.data() as CurrentUserInfo));
  }
  useEffect(() => {
    getUserInfo()
    .then(() => {
      setIsLoading(false);
    });
  }, []);
  useEffect(() => {
    if(currentUserInfo && currentUserInfo.profileImg !== "" && !currentUserInfo.profileImg.includes("googleusercontent.com")) {
      setNicknameInputValue(currentUserInfo.nickname);
      imageDownload(currentUserInfo.profileImg);
    } else if(currentUserInfo?.profileImg.includes("googleusercontent.com")) {
      setUrl(currentUserInfo?.profileImg);
    } else {
      setUrl('/assets/defaultImage.png');
    }
  }, [currentUserInfo])

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

  const inputChange = useCallback(e => {
    setNicknameInputValue(e.target.value);
  }, []);

  const confirmClick = async() => {
    if(file !== undefined) {
      imageUpload(file);
    }
    if(currentUserInfo.nickname !== nicknameInputValue) {
      updateDoc(userRef, {nickname: nicknameInputValue});
    }
  }

  if(isLoading) return <div>Loading...</div>
  
  return (
    <>
      <section className="w-full mx-auto">
        <div className="mb-10">
          <h2 className="text-5xl font-bold"><span id="nicknameTitle">{currentUserInfo?.nickname}</span> 님의 회원정보조회</h2>
        </div>
        {localStorageUserInfo.providerData[0].providerId === "password" && !isConfirmed ?
        (<>
          <p className="text-lg mt-[7.75rem] mb-[1.875rem]">회원정보 조회를 위해 비밀번호를 입력해주세요.</p>
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
          <p>아이디</p>
          <CustomInput type="text" value={currentUserInfo.email} readOnly={true} className="max-w-[25rem] text-gray-500"/>
          <p className="mt-5">닉네임</p>
          <CustomInput type="text" value={nicknameInputValue} id="nicknameInput" className="max-w-[25rem]"
            onChange={inputChange}
          />

          <img id="previewImg" src={url} alt="" className="w-60 h-60 object-contain"/>
          <label htmlFor="selectImg" className="btn btn-secondary min-h-fit h-8">사진 선택</label>
          <input type="file" id="selectImg" accept="image/*" style={{display: "none"}} onChange={imagePreview}/>
          <button className="btn min-h-fit h-8" 
            onClick={() => {
              confirmClick()
              .then(() => {
                alert("회원정보가 수정되었습니다.");
                document.getElementById("nicknameTitle").textContent = nicknameInputValue;
              })
            }}
          >수정</button>
        </>)
        }
      </section>
    </>
  )
};

export default MyInfo;