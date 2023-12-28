import React from "react";
import Profileicon from "../Profile/Profileicon";

const Navigation = ({ onRouteChange, isSignedIn, toggleModal }) => {

    if (isSignedIn) {
        return (
            <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Profileicon onRouteChange={onRouteChange} toggleModal={toggleModal} />
            </nav>
        )
    } else {
        return (
            <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <p onClick={() => onRouteChange('signing')} className='f3 link dim black underline pa3 pointer'>Sign In</p>
                <p onClick={() => onRouteChange('register')} className='f3 link dim black underline pa3 pointer'>Register</p>
            </nav>
        )
    }
}

export default Navigation;