import React from "react";
// import { useState, useEffect } from 'react';

const Rank = ({ name, entries }) => {

    // const [emoji, setEmoji] = useState('');

    // const generateEmoji = (entries) => {
    //     fetch(`https://6aekm53adf.execute-api.us-east-1.amazonaws.com/rank?rank=${entries}`)
    //         .then(response => response.json())
    //         .then(data => {
    //             setEmoji(data.input)
    //         })
    //         .catch(console.log);
    // }

    // useEffect(() => {
    //     generateEmoji(entries);
    // }, [entries])

    return (
        <div>
            <div className='white f3'>
                {`${name}, your current entry count is...`}
            </div>
            <div className='white f1'>
                {entries}
            </div>
            {/* <div className='white f1'>
                {`Rank Badge: ${emoji}`}
            </div> */}
        </div>
    );
}

export default Rank;