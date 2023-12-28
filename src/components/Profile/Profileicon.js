import React, { useState } from 'react';
import robotImage from './avatar.png';
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import PropTypes from 'prop-types';
import 'tachyons';


function Profileicon({ toggleModal, onRouteChange, direction, ...args }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen((prevState) => !prevState);

    return (
        <div className="d-flex p-1 pa4 tc">
            <Dropdown isOpen={dropdownOpen} toggle={toggle} direction={direction}>
                <DropdownToggle caret
                    data-toggle="dropdown"
                    tag="span">
                    <img
                        src={robotImage}
                        className="br-100 ba h3 w3 dib" alt="avatar" />
                </DropdownToggle>
                <DropdownMenu
                    {...args}
                    style={{ marginTop: '1.2rem', backgroundColor: 'rgba(255,255,255,0.5)' }}>
                    <DropdownItem onClick={toggleModal}>View Profile</DropdownItem>
                    <DropdownItem onClick={()=> onRouteChange('signout')}> Sign Out</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    );
};

Profileicon.propTypes = {
    direction: PropTypes.string,
};

export default Profileicon;