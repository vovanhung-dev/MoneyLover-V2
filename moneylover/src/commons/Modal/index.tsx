import {Modal} from "antd";

interface props {
	isModalOpen: boolean,
	handleOk?: () => void,
	handleCancel?: () => void,
	children: React.ReactNode
	title?: string
	showCancel?: boolean
	showOke?: boolean
	className?: string
	width?: string | number
}

const ModalPopUp: React.FC<props> = ({width, className, isModalOpen, showOke = true, showCancel = true, handleCancel, handleOk, children, title}) => {
	return <>
		<Modal width={width} className={className} title={title} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
			   footer={(_, {OkBtn, CancelBtn}) => (
				   <div className={`flex-center gap-5`}>
					   {showCancel && <CancelBtn/>}
					   {showOke && <OkBtn/>}
				   </div>
			   )}>
			{children}
		</Modal>
	</>
}

export default ModalPopUp