import "./ImageLinkForm.css"
import React from "react";
import Concepts from "../Concepts/Concepts";

const ImageLinkForm = ({ onFileUpload, onInputChange, onButtonSubmit, matchingConcepts, sortByConcept }) => {


    return (
        <div>
            <p className="f3">
                {"This Magic Brain will detect faces in your pictures. Give it a try."}
            </p>
            <div className="center">
                <div className="form center pa4 br4 shadow-1">
                    <input className="f4 pa2 w-70 center" type="text" placeholder="Input image link here or click Upload button" onChange={onInputChange} /> {/* f4-size 4, padding=2, width=70%, located in center */}
                    <button className="w-30 grow f4 link ph3 pv2 dib white bg-light-purple" onClick={onButtonSubmit}>Detect</button> {/* width 30%, grow when hover over,padding horizontal=3, padding vertical=2, Display Inline-Block, background - light purple   */}
                </div>
                <div className="form center pa4 br4 shadow-1">
                    <h3>Add Image:</h3>
                    <input type="file" onChange={onFileUpload} multiple />
                </div >
            </div>
            {matchingConcepts
                ? <Concepts className="center"
                    matchingConcepts={matchingConcepts}
                    sortByConcept={sortByConcept} />
                : <h1 className="center" >no matching concepts found</h1>
            }
        </div >
    )
}

export default ImageLinkForm;