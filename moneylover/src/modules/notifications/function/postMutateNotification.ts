import {useQueryClient} from "@tanstack/react-query";
import useRequest from "@/hooks/useRequest.ts";
import {NotificationProps, NotificationType} from "@/modules/notifications/model/notificationModel.ts";
import {post} from "@/libs/api.ts";
import {nameQueryKey} from "@/utils/nameQueryKey.ts";
import {useProfileStore} from "@/modules/userProfile/store";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {routePath} from "@/utils";

interface checkTypeNotification {
	id: string
	type: string
}

const useNotificationPost = () => {
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const {setTypeFriend, setFriendOpen} = useProfileStore()
	const [typeNotification, setTypeNotification] = useState<string>("")
	const {mutate: MakeAllRead} = useRequest({
		mutationFn: (values: NotificationProps[]) => {
			return post({
				url: "notification/mark-all-as-read",
				data: values
			})
		},
		onSuccess: () => {
			// @ts-ignore
			queryClient.invalidateQueries([nameQueryKey.notification])
		}
	})

	const {mutate: MarkAsRead} = useRequest({
		mutationFn: (value: string) => {
			return post({
				url: `notification/mark-as-read/${value}`,
			})
		},
		showSuccess: false,
		onSuccess: () => {
			// @ts-ignore
			queryClient.invalidateQueries([nameQueryKey.notification])
			if (typeNotification === NotificationType.friend) {
				setFriendOpen(true)
				setTypeFriend("Request")
			}
			if (typeNotification === NotificationType.budget) {
				navigate(routePath.budget.path)
			}
		}
	})

	const handleMarkAsRead = (data: checkTypeNotification) => {
		if (data.type) {
			setTypeNotification(data.type)
		}
		MarkAsRead(data.id)
	}

	return {
		MakeAllRead,
		handleMarkAsRead
	}

}

export default useNotificationPost