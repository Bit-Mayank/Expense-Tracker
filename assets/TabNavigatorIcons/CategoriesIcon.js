// YourIcon.js
import React from 'react';
import Svg, { Path } from 'react-native-svg';

const MyIcon = ({ fillColor = "#000" }) => {
    return (
        <Svg
            width={20}
            height={20}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.25.25C4.865.25.5 4.615.5 10s4.365 9.75 9.75 9.75S20 15.385 20 10C19.994 4.618 15.632.256 10.25.25zm0 1.5a8.25 8.25 0 016.738 3.494l-6.738 3.89V1.75zm0 16.5a8.25 8.25 0 01-6.738-3.494L17.74 6.543a8.25 8.25 0 01-7.49 11.707z"
                fill={fillColor}
            />
        </Svg>
    );
};

export default MyIcon;
