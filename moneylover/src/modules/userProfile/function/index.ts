import useRequest from "@/hooks/useRequest.ts";
import {post} from "@/libs/api.ts";
import {routePath} from "@/utils";
import {changePassword} from "@/model/interface.ts";
import {useUserStore} from "@/modules/authentication/store/user.ts";

const useProfileFunction = (logout: (s: string) => void) => {
	const {user} = useUserStore.getState().user
	const {mutate: changePassword} = useRequest({
		mutationFn: (values: changePassword) => {
			return post({
				url: "auth/changePassword",
				data: values
			})
		},

		onSuccess: () => {
			logout(routePath.login.path)
		}
	})

	const handleOk = (data: any) => {
		const passwordNew: changePassword = {
			email: user.email,
			...data
		}
		changePassword(passwordNew)
	}


	return {handleOk}
}

export default useProfileFunction