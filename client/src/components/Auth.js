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
            <h1 className="text-capital">Please {auth}! </h1>
            {
                error &&
                <h5 className="text-capital"><b className="white-text purple darken-4 errorShow">{error}</b></h5>
            }
            <div className="row card-panel grey lighten-5 z-depth-1">
                <div className="input-field col s12">
                    <input type="email" name="email" className="validate" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} id="emailLabel" />
                </div>
                <div className="input-field col s12">
                    <input type="password" name="password" className="validate" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} id="passwordLabel" />
                </div>
            </div>
            {
                auth === 'signIn'?
                <h6>Don't have an account? <span onClick={()=>setAuth('signUp')} className="purple-text text-darken-3"><b>Create One</b></span></h6>:
                <h6>Already Have an account? <span onClick={()=>setAuth('signIn')} className="purple-text text-darken-3"><b>Login</b></span></h6>
            }
            <button className="btn purple accent-3" onClick={()=>authenticate()}>{auth}</button>
        </div>
    )
}

export default Auth
