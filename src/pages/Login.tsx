import { db, doc, onSnapshot, collection, query, updateDoc, addDoc } from "../firebase";
import { useEffect, useState } from 'react'
import '../assets/css/Login.css'
import { getDocs, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../slices/userSlice";
import noti from "../common/noti";
const Login = () => {
    const auth = useSelector(state => state.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [isLogin, setIsLogin] = useState(true)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [passwordAgain, setPasswordAgain] = useState('')
    const [fullName, setFullName] = useState('')
    const [imgUrl, setImgUrl] = useState('')

    useEffect(() => {

        if (auth.username != '') return navigate('/')
    }, [])

    const submitForm = async () => {

        if (isLogin) {
            if (username.trim() == '' || password.trim() == '') return noti.error('Please fill all information!!!')
            const userRef = collection(db, 'users');
            const q = query(userRef, where('username', '==', username), where('password', '==', password));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.size === 1) {
                querySnapshot.forEach((doc) => {
                    const userData = {
                        id: doc.id,
                        username: doc.data().username,
                        fullname: doc.data().fullname,
                        image: doc.data().image
                    };
                    localStorage.setItem('auth', JSON.stringify(userData));
                    dispatch(addUser(userData));
                    navigate('/');
                });
            } else {
                noti.error('Invalid username or password.')
            }
        } else {
            if (username.trim() == '' || password.trim() == '' || fullName.trim() == '' || imgUrl.trim() == '') return noti.error('Please fill all information.')
            if (password !== passwordAgain) {
                noti.error('Password not match!')
                return;
            }

            const userRef = collection(db, 'users');
            const q = query(userRef, where('username', '==', username));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.size > 0) {
                noti.error('Username already exist')
            } else {
                await addDoc(userRef, {
                    username: username,
                    password: password,
                    fullname: fullName,
                    image: imgUrl
                });
                noti.success('Registration successful!')

                setUsername('');
                setPassword('');
                setPasswordAgain('');
                setFullName('');
                setImgUrl('');
                setIsLogin(true)
            }
        }
    };
    return (

        <div className="login text-black">
            <div className="login-triangle"></div>

            <h2 className="login-header">{isLogin ? 'Login' : 'Register'}</h2>

            <div className="login-container">
                <p><input value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username" /></p>
                <p><input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" /></p>
                {isLogin ? null : <p><input value={passwordAgain} onChange={(e) => setPasswordAgain(e.target.value)} type="password" placeholder="Password again" /></p>}
                {isLogin ? null : <p><input value={fullName} onChange={(e) => setFullName(e.target.value)} type="text" placeholder="Full Name" /></p>}
                {isLogin ? null : <p><input value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} type="text" placeholder="Image URL" /></p>}
                <span onClick={() => setIsLogin(!isLogin)} className='text-white hover:underline ml-3 cursor-pointer'>{isLogin ? "You don't have a account? Register" : 'You have a account? Login'} now!</span>
                <p><input onClick={submitForm} type="submit" value={isLogin ? 'Login' : 'Register'} /></p>
            </div>
        </div>
    )
}

export default Login