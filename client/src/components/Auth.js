import {useState} from 'react'
import {signupUser, signinUser} from '../reducers/authReducer';
import {useDispatch, useSelector} from 'react-redux';
function Auth() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [auth, setAuth] = useState('signIn');
    const {loading, error} = useSelector(state=>state.user);
    const dispatch = useDispatch();
    // authenticate
    const authenticate = ()=>{
        if(auth === 'signIn'){
            dispatch(signinUser({email,password})); 
        }else{
           dispatch(signupUser({email,password})); 
        }
    }
    return (
        <div>
            {
                loading &&
                <div className="progress purple accent-3">
                    <div className="indeterminate"></div>
                </div>
            }
            <h1>Please {auth}! </h1>
            {
                error &&
                <h5>{error}</h5>
            }
            <input type="email" name="email" value={email} onChange={(e)=>setEmail(e.target.value)} id="email" />
            <input type="password" name="password" value={password} onChange={(e)=>setPassword(e.target.value)} id="password" />
            {
                auth === 'signIn'?
                <h6 onClick={()=>setAuth('signUp')}>Dont have an account?</h6>:
                <h6 onClick={()=>setAuth('signIn')}>Already Have an account?</h6>
            }
            <button className="btn purple accent-3" onClick={()=>authenticate()}>{auth}</button>
        </div>
    )
}

export default Auth
