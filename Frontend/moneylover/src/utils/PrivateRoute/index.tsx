import {Navigate, useLocation} from 'react-router-dom';
import {routePath} from "../index.ts";

const PrivateRoute = (props: { children: React.ReactNode }): JSX.Element => {
	const {children} = props;

	const user = localStorage.getItem("user")
	const location = useLocation();

	return user ? (
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
