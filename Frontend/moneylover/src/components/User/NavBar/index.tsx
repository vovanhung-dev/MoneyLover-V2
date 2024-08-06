import {ArrRight} from "@/assets";
import {Link, useLocation} from "react-router-dom";
import {routePathArray} from "@/utils";
import {memo} from "react"


const NavBar = () => {

	const navItem = routePathArray()

	const {pathname} = useLocation()

	const handleActiveNav = (route: string) => {
		const path = pathname.split("/")[1]
		const routeCurrent = route.split("/")[1]
		return routeCurrent === path
	}
	return <>
		<div className={`w-1/5 h-screen hidden lg:block`}>
			<div className={`bg-white border-2 border-bodydark2 px-8 py-12 rounded-2xl`}>
				<h1 className={`md:text-3xl text-nowrap text-bodydark2 font-satoshi`}>Money lover</h1>
			</div>
			<ul className={`px-4 bg-white rounded-2xl`}>
				{navItem.map((el) => (
					<Link to={el.path} key={el.name}
						  className={`${handleActiveNav(el.path) ? " border-r-2 border-r-bodydark2 font-bold text-black-2 scale-110" : "text-bodydark2 font-normal"} group cursor-pointer flex items-center py-5 px-4 duration-1000 mx-1 my-8 justify-between  gap-2`}>
						<img src={el.icons} alt=""
							 style={handleActiveNav(el.path) ? {filter: 'invert(1)'} : {}}
							 className={` w-6 h-6 object-contain`}/>
						<span>{el.name}</span>
						<div className={`w-7`}>
							<img src={ArrRight} alt="" className={` w-3 h-3 group-hover:w-4 group-hover:h-4 transition`}/>
						</div>
					</Link>
				))}
			</ul>
		</div>
	</>
}

export default memo(NavBar);