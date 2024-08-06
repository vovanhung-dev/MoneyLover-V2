import {twMerge} from "tailwind-merge";

interface props {
	img: string;
	tittle: string;
	detail: string;
	className: string;
}

const Card: React.FC<props> = ({img, tittle, detail, className}) => {
	return (
		<>
			<div
				className={twMerge(
					`flex flex-col-reverse md:flex-row sm:gap-y-[50px] md:gap-x-[100px] justify-between items-center  md:h-[50vh]`,
					className
				)}
			>
				<div>
					<img
						src={img}
						alt=""
						className="shadow-2xl rounded-lg lg:max-w-[500px] px-[50px] mt-[50px] md:p-0"
					/>
				</div>
				<div>
					<h3 className="text-4xl font-bold">{tittle}</h3>
					<p className="line-clamp-2 pt-2 font-normal ">{detail}</p>
				</div>
			</div>
		</>
	);
};

export default Card;
