import React from 'react';

import s from './Footer.module.scss';

function Footer() {
    return (
        <footer className={s.wrapper}>
            <p className={s.tht}>
                With 🤍 from <a
                    className={s.link}
                    href="https://thehelpfultipper.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    The Helpful Tipper
                </a>
            </p>
            <p><small>Built with React + Flask.<br />&#169;{new Date().getFullYear()}, The Helpful Tipper. All Rights Reserved.</small></p>
        </footer>
    );
}

export default Footer;
