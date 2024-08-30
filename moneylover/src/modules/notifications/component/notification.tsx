import {calculateElapsedTime} from "@/utils/day.ts";
import {NotificationProps, NotificationType} from "@/modules/notifications/model/notificationModel.ts";
import {Avatar} from "antd";
import cn from "@/utils/cn";
import {IWarning} from "@/assets";

interface checkTypeNotification {
	id: string
	type: string
}

interface props {
	notification: NotificationProps
	onClick: (data: checkTypeNotification) => void
}

const NotificationCard = ({notification, onClick}: props) => {
	const showMessage = (notification: NotificationProps) => {
		if (notification.type === NotificationType.friend) {
			return <>{notification?.message || "sent you a friend request"}</>
		}

		if (notification.type === NotificationType.budget) {
			const amount = notification?.message.split(" ")
			const span = (
				<span className={`line-clamp-1`}>
    				{amount?.slice(0, 2).join(" ")}{" "}
					<span className="text-lg font-bold">{amount[2]}</span>{" "}
					{amount?.slice(4).join(" ")}
					<span className={`text-lg font-bold`}>{notification.category}</span>
  				</span>
			);

			return <>{span}</>
		}

		if (NotificationType.budgetCreate === notification.type) {
			return <>{notification?.message}<span className={`text-lg font-bold`}>{notification.category}</span></>
		}

		if (NotificationType.transaction === notification.type) {
			return <>{notification?.message}</>
		}
	}

	const showHeader = (notification: NotificationProps) => {
		if (notification.type === NotificationType.friend || notification.type === NotificationType.budgetCreate) {
			return <>
				<Avatar className={"w-6 h-6 mr-3"}/>
				<span className={`font-bold text-lg`}> {notification.user} </span>
			</>
		}

		if (notification.type === NotificationType.budget) {
			return <>
				<div className={`mr-3`}><IWarning/></div>
				<h3 className="font-bold text-base text-gray-800">Warning</h3>
			</>
		}


		if (NotificationType.transaction === notification.type) {
			return <>
				<img
					src="https://img.icons8.com/?size=100&id=13016&format=png&color=000000"
					alt="Training Icon" className="w-6 h-6 mr-3"/>
				<h3 className="font-bold text-base text-gray-800">{notification.wallet}</h3>
			</>
		}
	}

	return (<div onClick={() => {
		const data: checkTypeNotification = {
			id: notification.id,
			type: notification.type
		}
		if (notification.unread) {
			onClick(data)
		}
	}}
				 className={cn("mt-2 hover:bg-gray-300 duration-200 cursor-pointer px-6 py-4 bg-white rounded-lg shadow w-full"
					 , {"bg-red-300": notification.type === NotificationType.budget})}>
		<div className=" inline-flex items-center justify-between w-full">
			<div className="inline-flex items-center">
				{showHeader(notification)}
			</div>
			<p className="text-xs text-gray-500">
				{calculateElapsedTime(notification.createdDate)} ago
			</p>
		</div>
		<div className={`flex-between`}>
			{notification.type === NotificationType.transaction ?
				<p className="mt-1 text-sm">
					<span className={`font-bold text-lg`}> {notification.user} </span>
					<span>{"created a transaction for "} </span>
					<span className={`font-bold text-lg`}> {notification.category} </span> <br/>
				</p> :
				<>
					<p className="mt-1 text-sm">
						<span>{showMessage(notification)}</span>
					</p>
				</>
			}

			{notification.unread && <div className={`bg-blue-500 rounded-full size-4`}></div>}
		</div>
	</div>)
}

export default NotificationCard