import { cookies } from 'next/headers'

export async function getAuthHeaders() {
	const cookieStore = await cookies()
	console.log(`******** cookie `, cookieStore)
	return {
		Cookie: cookieStore.toString(),
	}
}
