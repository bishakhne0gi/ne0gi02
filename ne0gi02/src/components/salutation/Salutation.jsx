import React from 'react'
import './salutation.css'
import Sign from '../../assets/sign.png'
const Salutation = () => {
    return (
        <>
            <div className="salutation__container section__padding">
                <h2>Yours faithfully,</h2>
                <img src={Sign} />
            </div>
        </>
    )
}

export default Salutation