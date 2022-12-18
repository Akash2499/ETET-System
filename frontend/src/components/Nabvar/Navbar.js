import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar(props) {

	const logout = (event) => {
		event.preventDefault()
		sessionStorage.removeItem("userId")
		window.location.href = "/"
	}

	const addTransaction = (event) => {
		event.preventDefault()
		window.location.href = "/add-transaction"
	}
	
	const addGroup = (event) => {
		event.preventDefault()
		window.location.href = "/add-group"
	}
	
	const addFriend = (event) => {
		event.preventDefault()
		window.location.href = "/add-friend"
	}
	
	const myActivity = (event) => {
		event.preventDefault()
		window.location.href = "/my-activities"
	}

	return (
		<nav class="navbar navbar-dark bg-dark">
            <span className="navbar-brand h1 set-span-nav"><a href="/" className="navbar-link">ETET</a></span>
			{
			sessionStorage.getItem("userId") ?
			<React.Fragment>
				<span className="navbar-brand h1 set-span-nav-position">
					<button className="btn btn-info" onClick={addFriend}>Add Friend</button>&nbsp;&nbsp;
					<button className="btn btn-info" onClick={addTransaction}>Add Transaction</button>&nbsp;&nbsp;
					<button className="btn btn-info" onClick={addGroup}>Add Group</button>&nbsp;&nbsp;
					<button className="btn btn-info" onClick={myActivity}>My Activity</button>&nbsp;&nbsp;
				</span>
				<span className="navbar-brand h1 set-span-nav"><button className='btn btn-danger' onClick={logout}>Logout</button></span>
			</React.Fragment> : ""
		 	}
			
        </nav>
	);
}

export default Navbar;