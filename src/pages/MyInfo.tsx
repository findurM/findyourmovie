import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useCallback, useEffect, useRef, useState } from "react";
import { db } from "../Application";
import { CustomInput, RoundButton, Warning } from "./Register";
import tw from "tailwind-styled-components";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { fetchUserInfo, UserInfoState } from "../features/fetchUserInfoSlice";
import { MypageTitle } from "../components/SideMenu";
import Spinner from "../components/Spinner";

const InfoTitle = tw.p`
font-bold
mt-5
`;

interface UpdateFormInputs {
  password?: string;
  passwordConfirm?: string;
}

const MyInfo = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<UpdateFormInputs>();

  watch("password");
  const auth = getAuth();
  const localStorageUserInfo = JSON.parse(localStorage.getItem("user"));
  const [authing, setAuthing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [file, setFile] = useState<File>();
  const [url, setUrl] = useState<string>();
  const passwordRef = useRef<HTMLInputElement>();
  const [currentPassword, setCurrentPassword] = useState("");
  const [nicknameInputValue, setNicknameInputValue] = useState<string>();
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo: currentUserInfo, loading: currentUserInfoLoading } = useSelector<RootState, UserInfoState>(
    (state) => state.userInfo,
  );

  useEffect(() => {
    dispatch(fetchUserInfo());
  }, []);

  useEffect(() => {
    if (currentUserInfo) {
      setNicknameInputValue(currentUserInfo.nickname);
      if (currentUserInfo.profileImg !== "" && !currentUserInfo.profileImg.includes("googleusercontent.com")) {
        imageDownload(currentUserInfo.profileImg);
      } else if (currentUserInfo?.profileImg.includes("googleusercontent.com")) {
        setUrl(currentUserInfo?.profileImg);
      } else {
        setUrl("/assets/defaultImage.png");
      }
    }
  }, [currentUserInfo]);

  const signIn = async () => {
    setAuthing(true);
    if (passwordRef.current) {
      const email = auth.currentUser.email;
      const password = passwordRef.current.value;
      const credential = EmailAuthProvider.credential(email, password);
      try {
        await reauthenticateWithCredential(auth.currentUser, credential);
        setCurrentPassword(password);
        setIsConfirmed(true);
        setAuthing(false);
      } catch (error) {
        alert("비밀번호를 잘못 입력하셨습니다.");
        passwordRef.current.value = "";
        setAuthing(false);
      }
    }
  };

  const imagePreview = () => {
    const preview = new FileReader();
    preview.onload = (e) => {
      (document.getElementById("previewImg") as HTMLImageElement).src = String(e.target.result);
    };
    setFile((document.getElementById("selectImg") as HTMLInputElement).files[0]);
    preview.readAsDataURL((document.getElementById("selectImg") as HTMLInputElement).files[0]);
  };

  const userRef = doc(db, "users", localStorageUserInfo.uid);
  const imageUpload = (file: File) => {
    const storage = getStorage();
    const storageRef = ref(storage, "images/" + file.name);
    updateDoc(userRef, { profileImg: file.name });
    uploadBytes(storageRef, file).catch((error) => {
      alert(error + "파일이 storage에 올라가지 않았습니다.");
    });
  };

  const imageDownload = (fileName: string) => {
    const storage = getStorage();
    getDownloadURL(ref(storage, "images/" + fileName))
      .then((url) => {
        setUrl(url);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const inputChange = useCallback((e) => {
    setNicknameInputValue(e.target.value);
  }, []);

  const onSubmit: SubmitHandler<UpdateFormInputs> = async (data) => {
    const confirmClick = async () => {
      if (file !== undefined) {
        imageUpload(file);
      }
      if (currentUserInfo.nickname !== nicknameInputValue) {
        updateDoc(userRef, { nickname: nicknameInputValue }).catch((error) => {
          alert(error + "닉네임이 제대로 업데이트되지 않았습니다.");
        });
      }
      if (data.password && data.password !== "") {
        const email = auth.currentUser.email;
        const credential = EmailAuthProvider.credential(email, currentPassword);
        await reauthenticateWithCredential(auth.currentUser, credential)
          .then(() => {
            updatePassword(auth.currentUser, data.password).catch((error) => {
              alert(error + "비밀번호가 제대로 업데이트되지 않았습니다.");
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    };
    confirmClick()
      .then(() => {
        alert("회원정보가 수정되었습니다.");
        dispatch(fetchUserInfo());
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (currentUserInfoLoading !== "succeeded") return <Spinner />;

  return (
    <>
      <section className="w-full mx-auto">
        <div className="mb-10">
          <MypageTitle>{currentUserInfo?.nickname} 님의 회원정보조회</MypageTitle>
        </div>
        {localStorageUserInfo.providerData[0].providerId === "password" && !isConfirmed ? (
          <>
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
          </>
        ) : (
          <form className="max-w-[25rem] pb-[1.875rem]" onSubmit={handleSubmit(onSubmit)}>
            <InfoTitle className="mt-0">아이디</InfoTitle>
            <CustomInput type="text" value={currentUserInfo.email} className="text-gray-500" disabled />

            {localStorageUserInfo.providerData[0].providerId === "password" && (
              <>
                <InfoTitle>비밀번호</InfoTitle>
                <CustomInput
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="변경하고 싶은 비밀번호를 입력하세요"
                  {...register("password", { minLength: 6 })}
                />
                <Warning>
                  {errors.password && errors.password.type === "minLength" && "최소 6자리 이상이어야 합니다"}
                </Warning>

                <InfoTitle>비밀번호 재확인</InfoTitle>
                <CustomInput
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type="password"
                  autoComplete="current-password"
                  placeholder="비밀번호를 다시 한 번 입력하세요"
                  {...register("passwordConfirm", {
                    required: (document.getElementById("password") as HTMLInputElement).value !== "",
                    validate: (val: string) => {
                      if (watch("password") != val) {
                        return "비밀번호가 일치하지 않습니다!";
                      }
                    },
                  })}
                />
                <Warning>{errors.passwordConfirm?.message}</Warning>

                <div className="flex gap-5 mt-5 items-center">
                  <InfoTitle className="shrink-0 mt-0">성별</InfoTitle>
                  <div className="w-full flex">
                    <div className="mr-3 flex justify-between w-10">
                      <span>남</span>
                      <input
                        type="radio"
                        name="radio-3"
                        value="남"
                        className="radio radio-secondary"
                        checked={currentUserInfo.sex === "남"}
                        readOnly
                      />
                    </div>
                    <div className="flex justify-between w-10">
                      <span>여</span>
                      <input
                        type="radio"
                        name="radio-3"
                        value="여"
                        className="radio radio-secondary"
                        checked={currentUserInfo.sex === "여"}
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-5 mt-5 items-center">
                  <InfoTitle className="mt-0">나이</InfoTitle>
                  <p>{currentUserInfo.age} 세</p>
                </div>
              </>
            )}

            <InfoTitle>닉네임</InfoTitle>
            <CustomInput type="text" id="nickname" name="nickname" value={nicknameInputValue} onChange={inputChange} />

            <div className="flex flex-col xs:flex-row gap-5 items-start xs:items-end my-5">
              <img id="previewImg" src={url} alt="" className="max-w-[15rem] aspect-square object-contain border" />
              <label htmlFor="selectImg" className="btn btn-secondary min-h-fit h-8 self-center xs:self-auto">
                사진 선택
              </label>
              <input type="file" id="selectImg" accept="image/*" style={{ display: "none" }} onChange={imagePreview} />
            </div>

            <button type="submit" className="btn min-h-fit h-8 block mx-auto">
              수정
            </button>
          </form>
        )}
      </section>
    </>
  );
};

export default MyInfo;
