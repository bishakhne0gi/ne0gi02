import React from 'react'
import './connect.css'
import { GithubLogo, InstagramLogo, LinkedinLogo, ReadCvLogo } from '@phosphor-icons/react'
import { Icon } from '@iconify/react';

const Connect = () => {





    const openComposeMail = () => {
        const emailAddress = 'bneogi102002@gmail.com';
        const subject = 'Feedback';
        const body = 'Body of the email';

        const mailtoLink = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        window.location.href = mailtoLink;
    };



    return (
        <>
            <div className="connect__container section__padding">
                <div className="header" data-aos="fade-right" data-aos-easing="linear" data-aos-duration="1000" das-aos-offset="300">
                    Get Connected
                </div>
                <div className="social__container section__padding">
                    <a href='https://www.linkedin.com/in/bishakh-neogi-387815205/'>

                        <LinkedinLogo className="icons" size={68} color="var(--secondary)" />
                    </a>
                    <a href='https://github.com/bishakhne0gi'>

                        <GithubLogo className="icons" size={68} color="var(--secondary)" />
                    </a>
                    <a href='https://www.instagram.com/bishakh.neogi/'>

                        <InstagramLogo className="icons" size={68} color="var(--secondary)" />
                    </a>
                    <a href='https://drive.google.com/file/d/1A4EeEkMIh0E2SIVDm8qxhn7rUNGuCyia/view?usp=drive_link'>
                        <ReadCvLogo className="icons" size={68} color="var(--secondary)" />
                    </a>

                    <a href='https://leetcode.com/ne0gi02/'>

                        <Icon className="icons" icon="cib:leetcode" color="#e0eec6" width="68" />
                    </a>

                    <a href='https://www.codechef.com/users/ne0gi02'>
                        <Icon className="icons" icon="simple-icons:codechef" color="#e0eec6" width="68" />
                    </a>

                    <a href='https://codeforces.com/profile/ne0gi02'>

                        <Icon className="icons" icon="simple-icons:codeforces" color="#e0eec6" width="68" />
                    </a>


                </div>

            </div>

        </>
    )
}

export default Connect