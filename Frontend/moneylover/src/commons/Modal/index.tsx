import {Modal} from "antd";

interface props {
	isModalOpen: boolean,
	handleOk?: () => void,
	handleCancel?: () => void,
	children: React.ReactNode
	title?: string
	showCancel?: boolean
	showOke?: boolean
}

const ModalPopUp: React.FC<props> = ({isModalOpen, showOke = true, showCancel = true, handleCancel, handleOk, children, title}) => {
	return <>
		<Modal title={title} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={(_, {OkBtn, CancelBtn}) => (
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