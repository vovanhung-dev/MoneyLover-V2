import {useChatStore} from "@/modules/chat/store/chatStore.ts";
import {Cancel, IInformation, IPen} from "@/assets";

interface props {
	name: string | undefined
}

const Header = ({name}: props) => {
	const {setIsOpenChat, isOpenChat, isChangeNameOpen, setIsChangeNameOpen, setIsInformationOpen, isInformationOpen} = useChatStore()

	return <>
		<div className={`w-full py-4 border-l bg-nav border-bodydark px-2 flex-between`}>
			<div className={`flex items-center gap-4`}>
				<span className={`font-bold text-3xl`}>{name ?? ""}</span>
				<div>
					<IPen func={() => setIsChangeNameOpen(!isChangeNameOpen)}
						  className={`rounded-full hover:scale-105 duration-200 p-2 cursor-pointer bg-gray-300 mt-1`}/>
				</div>
			</div>
			<div className={`flex gap-4 items-center`}>
				<IInformation func={() => setIsInformationOpen(!isInformationOpen)} className={`cursor-pointer`} color={"blue"} width={30}
							  height={30}/>
				<Cancel func={() => setIsOpenChat(!isOpenChat)}
						className={`rounded-full cursor-pointer p-2 font-bold text-2xl hover:bg-gray-300 hover:scale-110 transition duration-300`}/>
			</div>
		</div>
	</>
}

export default Header