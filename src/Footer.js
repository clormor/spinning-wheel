import React from "react";

export default function Footer() {
    const freepikLink = (
        <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
            Freepik
        </a>
    );

    const flatIconLink = (
        <a href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
        </a>
    );

    return (
        <div className="footer">
            Icons made by {freepikLink} from {flatIconLink}
        </div>
    );
}
