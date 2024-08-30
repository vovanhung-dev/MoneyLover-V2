import {useUserStore} from "@/modules/authentication/store/user.ts";
import {User} from "@/model/interface.ts";

interface props {
	userCreator: User
}

const CreatorName = ({userCreator}: props) => {
	const {user} = useUserStore.getState().user
	if (user?.id === userCreator?.id) {
		return <><span className={`text-lg text-bodydark2 font-normal`}>
			 You
		</span></>
	}
	return <><span className={`text-lg text-bodydark2 font-normal`}> {userCreator?.username}</span></>
}

export default CreatorName