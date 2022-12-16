import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar(props) {

	const logout = (event) => {
		event.preventDefault()
		sessionStorage.removeItem("userId")
		window.location.href = "/"
	}

	return (
		<nav class="navbar navbar-dark bg-dark">
            <span className="navbar-brand h1 set-span-nav"><a href="/" className="navbar-link">ETET</a></span>
			{
			sessionStorage.getItem("userId") ?
			<span className="navbar-brand h1 set-span-nav"><button className='btn btn-info' onClick={logout}>Logout</button></span>	: ""
		 	}
			
        </nav>
	);
}

export default Navbar;