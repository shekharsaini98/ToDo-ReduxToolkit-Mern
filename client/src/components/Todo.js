import {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux';
import {createTodo, deleteTodo, getTodo} from '../reducers/todoReducer';
import {logout} from '../reducers/authReducer';
function Todo() {
    const dispatch = useDispatch();
    const [mytodo, setTodo] = useState('');
    const todos = useSelector(state => state.todos);
    useEffect(() => {
        dispatch(getTodo());
    }, [])
    const addTodo = ()=>{
        dispatch(createTodo({todo:mytodo}));
        setTodo('');
    }
    const delTodo = (id)=>{
        dispatch(deleteTodo(id))
    }
    const userlogout = ()=>{
        dispatch(logout());
    }
    return (
        <div>
            <button className="btn purple accent-3" onClick={()=>userlogout()}>Logout</button>
            <input type="text" value={mytodo} onChange={(e)=>setTodo(e.target.value)} name="" id="" placeholder="What's in your TO-DO list?" />
            <button className="btn purple accent-3" onClick={()=>addTodo()} >Create To-Do</button>
            <br/>
            <ul className="collection card-panel z-depth-1">
            {
                todos.map(item => {
                    return <li onClick={()=>{delTodo(item._id)}} className="collection-item" key={item._id}>{item.todo}</li>
                })
            }
            </ul>
        </div>
    )
}

export default Todo
