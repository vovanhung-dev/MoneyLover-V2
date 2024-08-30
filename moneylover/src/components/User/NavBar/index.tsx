import {ArrRight} from "@/assets";
import {Link, useLocation} from "react-router-dom";
import {routePrivate} from "@/utils";
import {motion as m} from "framer-motion";
import cn from "@/utils/cn";
import {useHeaderStore} from "@/store/HeaderStore.ts";


const NavBar = () => {

	const navItem = routePrivate()

	const {pathname} = useLocation()

	const {setFalseAll} = useHeaderStore()

	const handleActiveNav = (route: string) => {
		const path = pathname.split("/")[1]
		const routeCurrent = route.split("/")[1]
		return routeCurrent === path
	}
	return <>
		<m.div
			className={`w-1/5 bg-white h-screen hidden lg:block`}>
			<div className={`px-8  py-12 rounded-2xl`}>
				<h1 className={`md:text-4xl text-nowrap text-black font-satoshi`}>Money lover</h1>
			</div>
			<ul className={`px-2 mt-[50px] rounded-2xl`}>
				{navItem.map((el) => (
					<Link to={el.path} key={el.name}
						  onClick={setFalseAll}
						  className={cn(` "text-Text hover:scale-105 font-normal group rounded-lg cursor-pointer flex items-center py-5 px-4 duration-200 mx-1 my-8 justify-between gap-2`
							  , {
								  "text-white font-bold  bg-Primary": handleActiveNav(el.path),
								  "hover:bg-gray-200": !handleActiveNav(el.path)
							  })}>
						<span>
						<el.icons color={"#000"} width={"40px"} height={"40px"}/>
						</span>
						<span className={cn("")}>{el.name}</span>
						<div className={`w-7`}>
							<img src={ArrRight} alt="" className={` w-3 h-3 group-hover:w-4 group-hover:h-4 transition`}/>
						</div>
					</Link>
				))}
			</ul>
		</m.div>
	</>
}

export default NavBar;