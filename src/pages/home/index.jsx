import React, { useEffect, useState } from 'react';
import { removeToken } from '../../utils/storage';
import { Navigate } from "react-router";
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

function Index(props) {
    const [name, setName]  = useState('');
    const navigate = useNavigate();
    const logout = () => {
        removeToken();
        localStorage.removeItem('name');
        toast.success("You just Logged Out", {
            pauseOnHover: false,
            closeOnClick: true,
        })
        navigate('/login')
    }

    useEffect(() => {
        setName(localStorage.getItem('name'));
    },[])
    return (
        <div className="home-container">
            <div className="head">
            <div className="profile"> 
                <a className="name">Welcome {name}</a>
                <a onClick={logout} className="logout">Logout</a>
            </div>
            </div>
        </div>
    );
}

export default Index;
