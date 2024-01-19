import React, { useState } from "react";

const Concepts = ({ matchingConcepts, sortByConcept }) => {
    const renderConcepts = () => {
        return matchingConcepts.slice(0, 10).map((concept, index) => {
            return (
                <button key={index} className='dib pa1 ma1 bg-light-blue br2 o-80' onClick={() => {
                    console.log("indexes after click", concept.indexes);
                    sortByConcept(concept.indexes)
                }}>{concept.conceptName}</button>
            )
        })
    }

    return (
        <div className="center f2 pv2">
            <div className='tc mb2'>Matching concepts: </div>
            <div className='flex flex-wrap justify-center'>
                {renderConcepts()}
            </div>
        </div>
    );
}

export default Concepts;