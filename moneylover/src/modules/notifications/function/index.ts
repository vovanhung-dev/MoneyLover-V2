import {get} from "@/libs/api.ts";
import {useQuery} from "@tanstack/react-query";
import {nameQueryKey} from "@/utils/nameQueryKey.ts";
import {NotificationProps} from "@/modules/notifications/model/notificationModel.ts";
import dayjs from "dayjs";

const useNotifications = (btnType: string) => {
	const fetchNotification = () => {
		return get({url: `notifications?status=${btnType}`})
	}
	const {data} = useQuery({queryKey: [nameQueryKey.notification, btnType], queryFn: fetchNotification})

	const result: NotificationProps[] = data?.data || []

	const notificationSort = result.sort((a, b) => {
		const time1 = dayjs(a.createdDate)
		const time2 = dayjs(b.createdDate)
		return time1.isAfter(time2) ? -1 : time1.isBefore(time2) ? 1 : 0;
	})
	return {notifications: notificationSort}
}

export default useNotifications