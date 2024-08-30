import {FloatButton} from "antd";
import {BiMessageRounded} from "react-icons/bi";

interface props {
	onClick: () => void
	count?: number
}

const FloatButtonAction = ({onClick, count = 0}: props,) => {
	return <>
		<FloatButton
			type="primary"
			style={{insetInlineEnd: 24}}
			icon={<BiMessageRounded/>}
			onClick={onClick}
			badge={{count, color: "red"}}
		>
		</FloatButton>
	</>
}

export default FloatButtonAction