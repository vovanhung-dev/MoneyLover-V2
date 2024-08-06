interface props {
	name: string;
	comment: string;
}

const Comment: React.FC<props> = ({name, comment}) => {
	return (
		<div className="text-center p-4 lg:w-[326px] h-full lg:h-[324px] border-[1px] text-pretty flex-col flex-between gap-15 rounded-lg">
			<p className=" p-2">{comment}</p>
			<p className="font-bold text-xl mt-10 md:mt-0">{name}</p>
		</div>
	);
};

export default Comment;
