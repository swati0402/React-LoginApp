import React, { useState, useEffect, useReducer,useContext,useRef } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context'
import Input from '../UI/Input/Input';
//import { act } from 'react-dom/cjs/react-dom-test-utils.production.min';

const emailReducer =(state,action)=>{
  if(action.type==='USER_INPUT'){
    return{value:action.val, isvalid:action.val.includes('@') }
  }
  if(action.type==='INPUT_BLUR'){
    return{value:state.value, isvalid:state.value.includes('@') }
  }
  return {
    value:'', isValid:false
  }
}
const Login = (props) => {
  const ctx=useContext(AuthContext)
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState,dispatchEmail]= useReducer(emailReducer, {value:'',isvalid:false})

  const {isvalid:emailIsvalid}=emailState
  const emailInputRef=useRef()
  const passInputRef=useRef()

  useEffect(()=>{
    const ident= setTimeout(() => {
      setFormIsValid(
        emailIsvalid && enteredPassword.trim().length > 6
      );
    }, 500);
    return ()=>{clearTimeout(ident)}
  },[emailIsvalid,enteredPassword])

  const emailChangeHandler = (event) => {
    //setEnteredEmail(event.target.value);
    dispatchEmail({type:'USER_INPUT', val:event.target.value})
    setFormIsValid(
      emailState.isValid && enteredPassword.trim().length > 6
    );
  };

  const passwordChangeHandler = (event) => {
    setEnteredPassword(event.target.value);
  };

  const validateEmailHandler = () => {
    //setEmailIsValid(emailState.isValid);
    dispatchEmail({type:'INPUT_BLUR'})
  };

  const validatePasswordHandler = () => {
    setPasswordIsValid(enteredPassword.trim().length > 6);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if(formIsValid){
      ctx.onLogin(emailState.value, enteredPassword);
    }
    else if(!emailIsvalid){
      emailInputRef.current.activate()
    }
    else{
      passInputRef.current.activate()
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          ref={emailInputRef} 
          id="email" 
          label="E-Mail" 
          type="email" 
          isValid={emailIsvalid} 
          value={emailState.value} 
          onBlur={validateEmailHandler} 
          onChange={emailChangeHandler}
        />
          <Input
          ref={passInputRef}  
          id="password" 
          label="Password" 
          type="password" 
          isValid={passwordIsValid} 
          value={emailState.value} 
          onBlur={validatePasswordHandler} 
          onChange={passwordChangeHandler}
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
