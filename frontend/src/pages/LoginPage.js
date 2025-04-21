import React from 'react';
import Login from '../components/Login';

const LoginPage = () =>
{

    return(
        <div id="page-container">
            <div id="user-authentication-container">
                <div id="user-authentication-container-elements">
                    <h1 id="user-authetication-title">Login</h1>
                    <Login />
                </div>   

                <div className='side-image-container'></div>           
            </div>
            
        </div>
    );
};
export default LoginPage;
