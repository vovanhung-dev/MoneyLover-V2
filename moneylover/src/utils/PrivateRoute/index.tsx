import {Navigate, useLocation} from 'react-router-dom';
import {routePath} from "@/utils";
import {useUserStore} from "@/modules/authentication/store/user.ts";

const PrivateRoute = (props: { children: React.ReactNode }): JSX.Element => {
	const {children} = props;
	const {user} = useUserStore.getState()
	const location = useLocation();

	return user?.user ? (
		<>{children}</>
	) : (
		<Navigate
			replace={true}
			to={routePath.login.path}
			state={{from: `${location.pathname}${location.search}`}}
		/>
	);
};
export default PrivateRoute;
