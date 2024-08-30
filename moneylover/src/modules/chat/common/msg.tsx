import {Message} from "@/modules/chat/function/chats.ts";
import cn from "@/utils/cn";
import dayjs from "dayjs";

interface props {
	msg: Message
	isYour: boolean
	lastMessagePerson: boolean
	firstMessPerson: boolean
	lengthMsg: number
}

const MsgBox = ({msg, isYour, lastMessagePerson, firstMessPerson, lengthMsg}: props) => {
	return <>
		<div>
			<div className={cn(`flex items-end h-full`, {"justify-end items-start": isYour})}>
				<div className={`flex flex-col h-full space-y-2 text-xs max-w-xs mx-2 order-2 items-start`}>
					<div className={cn(`relative flex flex-col gap-2`)}>
						{msg.files.length > 0 &&
                            <div className={`flex flex-col py-1 pl-6 gap-2`}>
								{msg.files.length > 0 && <>
									{msg.files.map((e) => (
										<img src={e} alt="" className={`object-fill w-full h-full rounded-lg`}/>
									))}
                                </>}
                            </div>
						}
						<div className={cn(`flex items-end group`, {" justify-end": isYour})}>
							<div className={cn(`flex justify-end items-end h-full`, {"hidden": isYour || !lastMessagePerson})}>
								<img src="#" alt="" className={cn(`size-6 rounded-full order-1`, {"flex": isYour})}/>
							</div>
							<div className={cn(`relative w-full`, {"flex justify-end": isYour, "ml-6": !isYour && !lastMessagePerson})}>
								<span
									className={cn(`p-4 rounded-full inline-block text-sm bg-gray-200 text-black`,
										{
											"bg-blue-500 text-white": isYour,
											"rounded-tr-sm": isYour && lastMessagePerson && lengthMsg > 1,
											"rounded-br-sm": (isYour && firstMessPerson && lengthMsg > 1) || (isYour && lengthMsg === 1),
											"rounded-e-[190rem]": isYour && !lastMessagePerson && !firstMessPerson,
											"rounded-s-[190rem]": !isYour && !lastMessagePerson && !firstMessPerson,
											"rounded-bl-sm": !isYour && firstMessPerson && lengthMsg > 1,
											"rounded-tl-sm": !isYour && lastMessagePerson && lengthMsg > 1,
											"hidden": !msg.text
										}
									)}>
							{msg?.text}
								</span>
							</div>
							<span
								className={cn(`group-hover:flex duration-300 hidden absolute top-5 min-w-fit text-nowrap p-2 rounded-lg bg-gray-200 shadow-3`
									, {
										"-left-42.5": isYour,
										"-right-42.5": !isYour
									}
								)}>{dayjs(msg.timer).format('MMMM D, YYYY, h:mm A')}</span>
						</div>
					</div>

				</div>
			</div>

		</div>
	</>
}

export default MsgBox