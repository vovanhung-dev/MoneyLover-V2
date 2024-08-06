import {Link} from "react-router-dom";

const PageNotFound = () => {
	return <>
		<div className={`mx-auto mt-50`}>
			<div className={`flex-center flex-col`}>
				<img src="" alt=""/>
				<span className={`text-4xl text-black`}>
				Page not found!!
			</span>
				<Link to={"/"} className={`text-blue-500 text-2xl`}>
					Back to home page
				</Link>
			</div>
		</div>
	</>
}

export default PageNotFound