import React from 'react'
import './connect.css'
import { Envelope, GithubLogo, InstagramLogo, LinkedinLogo, ReadCvLogo } from '@phosphor-icons/react'
import Thanking from '../thanking/Thanking'
import Salutation from '../salutation/Salutation'
import Footer from '../footer/Footer'
const Connect = () => {
    return (
        <>
            <div className="connect__container section__padding">
                <div className="header">
                    Get Connected
                </div>
                <div className="social__container section__padding">
                    <LinkedinLogo className="icons" size={68} color="var(--secondary)" />
                    <GithubLogo className="icons" size={68} color="var(--secondary)" />
                    <InstagramLogo className="icons" size={68} color="var(--secondary)" />
                    <Envelope className="icons" size={68} color="var(--secondary)" />
                    <ReadCvLogo className="icons" size={68} color="var(--secondary)" />

                </div>
            </div>
            <Thanking />
            <Salutation />
            <Footer />
        </>
    )
}

export default Connect