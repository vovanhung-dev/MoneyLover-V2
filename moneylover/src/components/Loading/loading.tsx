import {Spin} from "antd";
import {LoadingOutlined} from "@ant-design/icons";

const LoadingSpin = () => {
	return <>
		<Spin className={`flex justify-center  items-center `}
			  indicator={<LoadingOutlined style={{fontSize: 50}} spin/>}/></>
}
export default LoadingSpin