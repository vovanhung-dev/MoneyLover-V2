import create from "zustand";

interface CategoryStore {
	openModal: boolean
	setOpenModal: (r: boolean) => void
}

export const openCategoryForm = create<CategoryStore>(set => ({
	openModal: false,
	setOpenModal: (open: boolean) => {
		set({openModal: open});
	},
}));