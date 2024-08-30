import {Button, Empty} from "antd";
import NotificationCard from "@/modules/notifications/component/notification.tsx";
import {NotificationProps} from "@/modules/notifications/model/notificationModel.ts";
import useNotificationPost from "@/modules/notifications/function/postMutateNotification.ts";

interface props {
	notifications: NotificationProps[]
	btnType: string
	setBtnType: (status: string) => void
}

enum statusNoti {
	All = "All",
	Unread = "Unread"
}


const Notifications = ({notifications, setBtnType, btnType}: props) => {

	const {MakeAllRead, handleMarkAsRead} = useNotificationPost()

	return <>
		<div
			className={`flex gap-2 flex-col h-[calc(100%*5)] overflow-y-scroll rounded-lg w-[40%] p-4 shadow-3 z-10 absolute top-[90%] right-[20px] bg-white`}
		>
			<div className={`flex-between `}>
				<div className={`flex gap-4`}>
					{Object.entries(statusNoti).map(([status]) => (
						<Button type={btnType === status ? "primary" : "default"} onClick={() => setBtnType(status)}>{status}</Button>
					))}
				</div>
				<p onClick={() => MakeAllRead(notifications)}
				   className={`text-blue-500 underline cursor-pointer hover:scale-105 duration-200`}>Mark
					all read</p>
			</div>
			{notifications.length > 0 ?
				<>
					{notifications?.map((e) => (
						<>
							<NotificationCard onClick={handleMarkAsRead} key={e.id} notification={e}/>
						</>
					))}
				</> : <Empty description={"No notifications"}/>}

		</div>
	</>
}

export default Notifications