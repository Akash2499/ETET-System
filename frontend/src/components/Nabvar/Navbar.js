import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar(props) {
	return (
		<nav class="navbar navbar-dark bg-dark">
            <span class="navbar-brand h1 set-span-nav">ETET</span>
        </nav>
	);
}

export default Navbar;