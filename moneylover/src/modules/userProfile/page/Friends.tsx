import {useCallback} from "react";
import cn from "@/utils/cn";
import {AnimatePresence} from "framer-motion"
import {useProfileStore} from "@/modules/userProfile/store";
import {AllFriend, RequestFriend, SearchAdd} from "@/modules/userProfile/component";

const Friends = () => {
	const {setTypeFriend, typeFriend} = useProfileStore()


	const button = [
		{
			title: "All"
		},
		{
			title: "Request"
		},
		{
			title: "Add"
		}
	]

	const showContentFriend = useCallback(() => {
		if (typeFriend === "All") {
			return <AllFriend/>
		}

		if (typeFriend === "Request") {
			return <RequestFriend/>
		}
		return <><SearchAdd/></>

	}, [typeFriend])

	return <>
		<div>
			<div className={`flex gap-3 items-center justify-start`}>
				{button.map((e) =>
					(
						<button onClick={() => setTypeFriend(e.title)}
								className={cn(`px-4 py-2 hover:scale-105 text-black hover:border-b-2 hover:border-b-blue-600`
									, {"border-b-2 border-b-blue-600": typeFriend === e.title})}>{e.title}</button>
					))}
			</div>
			<AnimatePresence>
				<div
					className={`mt-4 py-4 rounded-lg border border-bodydark`}>
					{showContentFriend()}
				</div>
			</AnimatePresence>
		</div>
	</>
}

export default Friends