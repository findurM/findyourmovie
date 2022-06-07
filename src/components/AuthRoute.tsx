import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { setUserInfo } from '../features/userSlice';
import { useDispatch } from 'react-redux';

export interface IAuthRouteProps {}

const AuthRoute: React.FunctionComponent<IAuthRouteProps> = (props) => {
    //props에 디폴트로 들어있는 property children 자식 컴포넌트 전달
    const { children } = props;
    const auth = getAuth();
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const AuthCheck = onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoading(false);
                localStorage.setItem('user',JSON.stringify(user))
                dispatch(setUserInfo({email: user.email}))
            } else {
                console.log('unauthorized');
                navigate('/login');
            }
        });

        return () => AuthCheck();
    }, [auth]);

    if (loading) return <p>loading ...</p>;

    return <div style={{height:'100vh'}}>{children}</div>;
};

export default AuthRoute;
