export const saveToken = (token: string) => {
	localStorage.setItem("accessToken", token)
}

export const saveRefreshToken = (token: string) => {
	localStorage.setItem("refreshToken", token)
}

export const saveUser = (user: string) => {
	localStorage.setItem("user", user)
}

export const getToken = () => {
	return localStorage.getItem("accessToken") || ""
}
export const getRefreshToken = () => {
	return localStorage.getItem("refreshToken")
}

export const delToken = () => {
	localStorage.removeItem("accessToken")
	localStorage.removeItem("refreshToken")
	localStorage.removeItem("user")
}
