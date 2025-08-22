import React, { useState } from 'react'
import API from "../API/API"

function ChatBot() {
    const [res, setRes] =  useState([]);
    const [ques, setQues] =  useState("");

    async function ai() {
        API.post('/ai/ask', { ques })
        .then(res => {
            console.log(res.data);
            setRes(res.data);
        })
    }


    return (
        <>
            {res}
            <div>ChatBot</div>
            <input type="text"  value={ques} onChange={ e => setQues(e.target.value)}/>
            <button onClick={() => ai()}></button>             
        </>
    )
}

export default ChatBot;