import React from "react";
import { createPortal } from 'react-dom';
import "./Modal.css";

const modalRoot = document.getElementById('modal-root');

export default function Modal(props) {
    return (
        <>
            {createPortal(
                props.children,
                modalRoot
            )}
        </>
    )
};