import * as React from "react";
import Svg, { Path } from "react-native-svg";

function HomeIcon({ fillColor = "#ADADAD" }) {
    return (
        <Svg
            width={19}
            height={19}
            viewBox="0 0 19 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.265 7.728l-7.5-7.076a1.5 1.5 0 00-2.029-.01l-.01.01-7.491 7.076A1.5 1.5 0 00.75 8.833V17.5a1.5 1.5 0 001.5 1.5h4.5a1.5 1.5 0 001.5-1.5V13h3v4.5a1.5 1.5 0 001.5 1.5h4.5a1.5 1.5 0 001.5-1.5V8.833a1.5 1.5 0 00-.485-1.105zM17.25 17.5h-4.5V13a1.5 1.5 0 00-1.5-1.5h-3a1.5 1.5 0 00-1.5 1.5v4.5h-4.5V8.833l.01-.01L9.75 1.75l7.49 7.072.01.009V17.5z"
                fill={fillColor}
            />
        </Svg>
    );
}

export default HomeIcon;
