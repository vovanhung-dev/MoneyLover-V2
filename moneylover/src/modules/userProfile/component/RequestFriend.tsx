import LoadingSpin from "@/components/Loading/loading.tsx";
import {Avatar} from "@/assets";
import {Button, Empty} from "antd";
import {get, post} from "@/libs/api.ts";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {nameQueryKey} from "@/utils/nameQueryKey.ts";
import {FriendProps} from "@/model/interface.ts";
import useRequest from "@/hooks/useRequest.ts";
import {motion as m} from "framer-motion"
import {useProfileStore} from "@/modules/userProfile/store";
import cn from "@/utils/cn";
import usePostFriend from "@/modules/userProfile/function/postMutateFriend.ts";

const RequestFriend = () => {
	const queryClient = useQueryClient()
	const {setTypeFriendRequest, typeFriendRequest} = useProfileStore()
	const btnTypeRequest = [
		{
			title: "Receive",
			value: "none"
		},
		{
			title: "Send",
			value: "pending"
		}
	]

	const getAllFriend = () => {
		return get({url: `friends-request`, params: {type: typeFriendRequest}})
	}

	const {data, isLoading} = useQuery({
		queryKey: [nameQueryKey.friendsReceive, typeFriendRequest],
		queryFn: getAllFriend,
	})

	const {mutate: acceptFriend} = useRequest({
		mutationFn: (value: string) => {
			return post({
				url: `friends/accept/${value}`,
			})
		},
		onSuccess: () => {
			// @ts-ignore
			queryClient.invalidateQueries([nameQueryKey.friendsReceive])
		}
	})

	const {removeFriend} = usePostFriend()


	const result: FriendProps[] = data?.data || []
	return <>
		<div>
			<m.div
				initial={{x: "50%", opacity: 0}}
				animate={{x: 0, opacity: 1}}
				exit={{x: "50%", opacity: 0}}
				className={`my-8 flex-center flex-col gap-8`}>
				<div className={`flex gap-2`}>
					{btnTypeRequest.map((e) => (
						<button key={e.title} onClick={() => setTypeFriendRequest(e.value)}
								className={cn(`py-2 hover:scale-105 hover:bg-gray-300 shadow-3 text-lg px-4 rounded-sm border`, {
									"bg-blue-400 text-white ": typeFriendRequest === e.value
								})}>{e.title}</button>
					))}
				</div>
				<div className={` grid grid-cols-2 w-full px-8 gap-6`}>
					{isLoading ? <LoadingSpin/> :
						result.length > 0 ? result?.map((e) => (
							<div key={e.user.id} className={`p-4 shadow-3 flex-between rounded-lg border-bodydark border`}>
								<div className={`flex items-center gap-4`}>
									<img src={Avatar} alt={""} className={`size-10 rounded-full`}/>
									<div className={`flex flex-col justify-start`}>
										<span className={`font-bold text-lg`}>{e?.user?.username || "hehehe"}</span>
										<span className={`py-4 font-normal text-sm`}>{e?.user?.email || "hidden"}</span>
									</div>
								</div>
								<div className={`flex-center flex-col gap-4`}>
									{typeFriendRequest === "none" &&
                                        <Button onClick={() => acceptFriend(e?.id)} className={``} type={"primary"}>Accept</Button>}
									<Button onClick={() => removeFriend(e?.id)} className={`text-red-400`}>Cancel</Button>
								</div>
							</div>
						)) : <>
							{<Empty className={`col-span-2`}/>}
						</>
					}
				</div>
			</m.div>
		</div>
	</>
}

export default RequestFriend