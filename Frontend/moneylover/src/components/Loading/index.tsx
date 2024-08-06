import {Spin} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {useLoading} from "@/context/LoadingContext.tsx";

const LoadingComponent = () => {
	const {isLoading} = useLoading()

	return <>
		{isLoading && <div className={`fixed bg-black-2 h-screen flex justify-center w-screen z-999999 opacity-70`}>
            <Spin className={`flex justify-center  items-center `}
                  indicator={<LoadingOutlined style={{fontSize: 50}} spin/>}/>
        </div>}</>
}

export default LoadingComponent