import React from 'react';
import CreateAccount from '../components/CreateAccount';

const SignUpPage = () =>
{

    return(
        <div id="page-container">
            <div id="user-authentication-container">
                <div id="user-authentication-container-elements">
                    <h1 id="user-authetication-title">Sign Up</h1>
                    <CreateAccount/>
                </div> 

                <div className='side-image-container'></div>            
            </div>
        </div>
    );
};
export default SignUpPage;
