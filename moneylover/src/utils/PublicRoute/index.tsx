import {Navigate, useLocation} from 'react-router-dom';
import {useUserStore} from "@/modules/authentication/store/user.ts";
import {routePath} from "@/utils";

const PublicRoute = (props: { children: React.ReactNode }): JSX.Element => {
	const {children} = props;
	const {user} = useUserStore.getState()
	const location = useLocation();

	return !user?.user ? (
		<>{children}</>
	) : (
		<Navigate
			replace={true}
			to={routePath.dashboard.path}
			state={{from: `${location.pathname}${location.search}`}}
		/>
	);
};
export default PublicRoute;
