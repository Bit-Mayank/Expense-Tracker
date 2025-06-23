import * as React from "react"
import Svg, { Path } from "react-native-svg"

function TransactionsIcon
    ({ fillColor = "#ADADAD" }) {
    return (
        <Svg
            width={19}
            height={16}
            viewBox="0 0 19 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.25 2A.75.75 0 016 1.25h12a.75.75 0 010 1.5H6A.75.75 0 015.25 2zM18 7.25H6a.75.75 0 000 1.5h12a.75.75 0 000-1.5zm0 6H6a.75.75 0 000 1.5h12a.75.75 0 000-1.5zM1.875.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zm0 6a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zm0 6a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
                fill={fillColor}
            />
        </Svg>
    )
}

export default TransactionsIcon

