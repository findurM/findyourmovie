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
        alert("??????????????? ?????? ?????????????????????.");
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
      alert(error + "????????? storage??? ???????????? ???????????????.");
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
          alert(error + "???????????? ????????? ?????????????????? ???????????????.");
        });
      }
      if (data.password && data.password !== "") {
        const email = auth.currentUser.email;
        const credential = EmailAuthProvider.credential(email, currentPassword);
        await reauthenticateWithCredential(auth.currentUser, credential)
          .then(() => {
            updatePassword(auth.currentUser, data.password).catch((error) => {
              alert(error + "??????????????? ????????? ?????????????????? ???????????????.");
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    };
    confirmClick()
      .then(() => {
        alert("??????????????? ?????????????????????.");
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
          <MypageTitle>{currentUserInfo?.nickname} ?????? ??????????????????</MypageTitle>
        </div>
        {localStorageUserInfo.providerData[0].providerId === "password" && !isConfirmed ? (
          <>
            <p className="text-lg mt-[7.75rem] mb-[1.875rem]">???????????? ????????? ?????? ??????????????? ??????????????????.</p>
            <div className="flex gap-5">
              <CustomInput
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="??????????????? ???????????????"
                ref={passwordRef}
                className="h-12 max-w-[32.5rem]"
              />
              <RoundButton className="text-2xl h-12 w-fit px-5 py-0" onClick={signIn} disabled={authing} type="submit">
                ??????
              </RoundButton>
            </div>
          </>
        ) : (
          <form className="max-w-[25rem] pb-[1.875rem]" onSubmit={handleSubmit(onSubmit)}>
            <InfoTitle className="mt-0">?????????</InfoTitle>
            <CustomInput type="text" value={currentUserInfo.email} className="text-gray-500" disabled />

            {localStorageUserInfo.providerData[0].providerId === "password" && (
              <>
                <InfoTitle>????????????</InfoTitle>
                <CustomInput
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="???????????? ?????? ??????????????? ???????????????"
                  {...register("password", { minLength: 6 })}
                />
                <Warning>
                  {errors.password && errors.password.type === "minLength" && "?????? 6?????? ??????????????? ?????????"}
                </Warning>

                <InfoTitle>???????????? ?????????</InfoTitle>
                <CustomInput
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type="password"
                  autoComplete="current-password"
                  placeholder="??????????????? ?????? ??? ??? ???????????????"
                  {...register("passwordConfirm", {
                    required: (document.getElementById("password") as HTMLInputElement).value !== "",
                    validate: (val: string) => {
                      if (watch("password") != val) {
                        return "??????????????? ???????????? ????????????!";
                      }
                    },
                  })}
                />
                <Warning>{errors.passwordConfirm?.message}</Warning>

                <div className="flex gap-5 mt-5 items-center">
                  <InfoTitle className="shrink-0 mt-0">??????</InfoTitle>
                  <div className="w-full flex">
                    <div className="mr-3 flex justify-between w-10">
                      <span>???</span>
                      <input
                        type="radio"
                        name="radio-3"
                        value="???"
                        className="radio radio-secondary"
                        checked={currentUserInfo.sex === "???"}
                        readOnly
                      />
                    </div>
                    <div className="flex justify-between w-10">
                      <span>???</span>
                      <input
                        type="radio"
                        name="radio-3"
                        value="???"
                        className="radio radio-secondary"
                        checked={currentUserInfo.sex === "???"}
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-5 mt-5 items-center">
                  <InfoTitle className="mt-0">??????</InfoTitle>
                  <p>{currentUserInfo.age} ???</p>
                </div>
              </>
            )}

            <InfoTitle>?????????</InfoTitle>
            <CustomInput type="text" id="nickname" name="nickname" value={nicknameInputValue} onChange={inputChange} />

            <div className="flex flex-col xs:flex-row gap-5 items-start xs:items-end my-5">
              <img id="previewImg" src={url} alt="" className="max-w-[15rem] aspect-square object-contain border" />
              <label htmlFor="selectImg" className="btn btn-secondary min-h-fit h-8 self-center xs:self-auto">
                ?????? ??????
              </label>
              <input type="file" id="selectImg" accept="image/*" style={{ display: "none" }} onChange={imagePreview} />
            </div>

            <button type="submit" className="btn min-h-fit h-8 block mx-auto">
              ??????
            </button>
          </form>
        )}
      </section>
    </>
  );
};

export default MyInfo;
