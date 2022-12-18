import { auth, signInWithGoogle } from "../Firebase/Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function OauthLogin(){
    const DATA_URL = "http://localhost:4000/users"
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
      } ;
    }, [user, loading]);


    const getData = async(user) =>{
        let url = DATA_URL + "/users/getUserByEmail"
        let newUrl = DATA_URL + "/users/register/oauth"
        let newBody = {
            firstName: user.displayName,
            email: user.email,
        }
        try{
        const userData =  await axios.get(url, user.email)
        if(userData){
            alert("User already present in database!!")
        }
        }catch(e){
            await axios
            .post(newUrl, newBody)
            .then((data)=>{
                console.log(data)
                sessionStorage.setItem("userId", data.data.userId)
                sessionStorage.setItem("email", user.email)
                sessionStorage.setItem("oauth", true)
                navigate("/my-activities")  
            })
            .catch((e)=>{
                console.log(e)
            })

        }
    }
    getData(user)


    return (
      <div className="login">
        <div className="login__container"> 
            <img onClick={signInWithGoogle} className="set-img" src="google.png"/> 
        </div>
      </div>
    );
  }

export default OauthLogin;