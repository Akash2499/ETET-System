import { auth, signInWithGoogle } from "../Firebase/Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function OauthLogin(){
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();
    useEffect(() => {
      if (loading) {
        return;
      }
      if(error){
          console.log(error)
          alert (error)
      }
      if (user){
          console.log(user)
          sessionStorage.setItem("userId", user.uid)
          sessionStorage.setItem("email", user.email)
          sessionStorage.setItem("oauth", true)
        // navigate("/my-activities")
      } ;
    }, [user, loading]);
    return (
      <div className="login">
        <div className="login__container"> 
            <img onClick={signInWithGoogle} className="set-img" src="google.png"/> 
        </div>
      </div>
    );
  }

export default OauthLogin;