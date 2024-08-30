import {useQueryClient} from "@tanstack/react-query";
import useRequest from "@/hooks/useRequest.ts";
import {del} from "@/libs/api.ts";
import {nameQueryKey} from "@/utils/nameQueryKey.ts";

const usePostFriend = () => {
	const queryClient = useQueryClient()
	const {mutate: removeFriend} = useRequest({
		mutationFn: (value: string) => {
			return del({
				url: `friends/delete/${value}`,
			})
		},
		onSuccess: () => {
			// @ts-ignore
			queryClient.invalidateQueries([nameQueryKey.friendsReceive])
		}
	})

	return {removeFriend}
}

export default usePostFriend