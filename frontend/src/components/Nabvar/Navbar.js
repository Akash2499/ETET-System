import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar(props) {
	return (
		<nav class="navbar navbar-dark bg-dark">
            <span className="navbar-brand h1 set-span-nav"><a href="/" className="navbar-link">ETET</a></span>
        </nav>
	);
}

export default Navbar;