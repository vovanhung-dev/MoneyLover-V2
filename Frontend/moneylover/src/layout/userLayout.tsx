import {HeaderUser} from "@/components";
import React, {ReactNode} from "react";
import NavBar from "@/components/User/NavBar";
import LoadingComponent from "@/components/Loading";

const UserLayout: React.FC<{ children: ReactNode }> = ({children}) => {
	return <>
		<LoadingComponent/>
		<div className={`flex h-screen overflow-hidden bg-primary1`}>
			<NavBar/>
			<div className={`relative flex flex-col w-full overflow-y-auto overflow-x-hidden`}>
				<HeaderUser/>
				<div className={`mx-auto max-w-screen-2xl h-screen w-full p-4 md:p-6 2xl:p-10`}>
					{children}
				</div>
			</div>
		</div>
	</>
}

export default UserLayout