import {Input} from "antd";
import React, {useState} from "react";
import {renameGroup} from "@/modules/chat/function/chats.ts";
import {useChatStore} from "@/modules/chat/store/chatStore.ts";

interface props {
	nameGroup: string | undefined
	groupId: string
	cancel: () => void
}

const ChangeNameGroup = ({nameGroup, cancel, groupId}: props) => {
	const [textInput, setTextInput] = useState<string | undefined>(nameGroup)
	const {fetchGroups} = useChatStore()

	const changeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTextInput(e.target.value)
	}

	const rename = async () => {
		await renameGroup(groupId, textInput)
		await fetchGroups()
		cancel()
	}

	return <>
		<div className={`w-2/4 rounded-3xl z-999999 absolute bg-white top-50 p-6 `}>
			<div className={`text-center font-bold text-3xl border-b border-b-bodydark2 py-2 mb-2`}>Change chat name</div>
			<span className={`text-md `}>Changing the name of a group chat changes it for everyone.</span>
			<div className={`relative my-2`}>
				<div className={`absolute z-10 text-sm left-2 top-1 flex-between w-[98%]`}>
					<label className={``}>Chat name</label>
					<span>{textInput?.length || 0}/100</span>
				</div>
				<Input onKeyDown={async (e) => {
					if (e.key == "Enter") {
						await rename()
					}
				}} value={textInput} className={`py-6 px-2 font-bold text-xl focus:ring-2 focus:ring-blue-400`} onChange={changeInput}/>
			</div>
			<div className={`flex justify-end gap-4 text-lg`}>
				<button onClick={cancel} className={`text-blue-400  py-2 px-6 rounded-lg hover:bg-gray-300 font-semibold`}>Cancel</button>
				<button onClick={rename} className={`py-2 px-6 rounded-lg bg-blue-500 text-white disabled:bg-gray-400 disabled:text-bodydark1`}
						disabled={textInput?.trim() === nameGroup?.trim() || !textInput?.trim()}>Save
				</button>
			</div>
		</div>
	</>
}
export default ChangeNameGroup