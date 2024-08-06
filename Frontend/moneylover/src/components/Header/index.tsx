import {Link} from "react-router-dom";
import {Bars, Cancel} from "@/assets";
import {useState} from "react";
import {motion as m} from "framer-motion";
import {twMerge} from "tailwind-merge";
import {routePath} from "@/utils";


interface props {
	className: string;
}

const Header: React.FC<props> = ({className}) => {
	const linkTo = [
		{
			link: "",
			label: "About us",
		},
		{
			link: "",
			label: "Price",
		},
		{
			link: "",
			label: "Vietnamese",
		},
		{
			link: routePath.login.path,
			label: "Login",
		},
	];
	const [showNav, setShowNav] = useState(false);

	return (
		<div
			className={twMerge(
				` flex justify-end items-center h-[80px] fixed top-0 right-0 px-32 w-full z-[9999999] bg-white`,
				className
			)}
		>
			<div
				className="block md:hidden">
				<img
					src={showNav ? Cancel : Bars}
					alt=""
					onClick={() => setShowNav(!showNav)}
					className={`size-10 z-30 absolute top-[30px] right-[20px] transition-transform duration-300 cursor-pointer ease-in-out hover:scale-125`}
				/>
			</div>
			<m.div
				initial={{y: -100}}
				animate={{y: 0}}
				transition={{stiffness: 50, type: "tween"}}
				className="hidden md:flex justify-between gap-4 z-20 left-[10px] top-[10%] ">
				{linkTo?.map((el) => (
					<Link
						className={`text-lg font-medium hover:scale-110 py-1 rounded-md px-6 duration-500 hover:underline ${
							el.label === "Login" ? " bg-black text-white" : " "
						}`}
						key={el.label}
						to={el.link}
					>
						{el.label}
					</Link>
				))}
			</m.div>

			{showNav && (
				<m.div
					initial={{x: "50%", y: "50%"}}
					animate={{x: "-150%", y: "50%"}}
					transition={{duration: 0.25, ease: "easeOut"}}
					exit={{x: "50%"}}
					className="fixed right-[-100%] top-[-50%] px-5 pt-20 z-10 h-full w-2/3 shadow-2xl bg-white"
				>
					<div
						className=" md:justify-between gap-10 md:gap-x-6 z-20 flex flex-col md:flex-row left-[10px] top-[10%] ">
						{linkTo?.map((el) => (
							<Link
								className={`text-lg font-medium hover:scale-110 py-1 rounded-md px-6 duration-500 hover:underline ${
									el.label === "Login" ? " bg-black text-white" : " "
								}`}
								key={el.label}
								to={el.link}
							>
								{el.label}
							</Link>
						))}
					</div>
				</m.div>
			)}
		</div>
	);
};

export default Header;
