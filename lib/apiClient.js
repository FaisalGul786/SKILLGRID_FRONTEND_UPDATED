/**
 * Placehoder for API call
 *
 **/

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

async function apiClient(
	endpoint,
	{ method = 'GET', body, headers = {}, ...customConfig } = {},
) {
	const config = {
		method,
		headers: {
			'Content-Type': 'application/json',
			...headers,
		},
		...customConfig,
	}

	if (body) {
		config.body = JSON.stringify(body)
	}

	try {
		const response = await fetch(`${BASE_URL}${endpoint}`, config)
		const responseData = await response.json().catch(() => ({}))

		if (!response.ok) {
			// Returns error object with status, message, and any extra properties sent by server
			return [
				{
					message:
						responseData.message ||
						`Request failed with status ${response.status}`,
					status: response.status,
					...responseData,
				},
				null,
			]
		}

		return [null, responseData]
	} catch (error) {
		// Catches network/connection errors
		return [
			{
				message: error.message || 'Network error occurred',
				status: 0,
			},
			null,
		]
	}
}

export const api = {
	get: (endpoint, options) =>
		apiClient(endpoint, { ...options, method: 'GET' }),
	post: (endpoint, body, options) =>
		apiClient(endpoint, { ...options, method: 'POST', body }),
	put: (endpoint, body, options) =>
		apiClient(endpoint, { ...options, method: 'PUT', body }),
	patch: (endpoint, body, options) =>
		apiClient(endpoint, { ...options, method: 'PATCH', body }),
	delete: (endpoint, options) =>
		apiClient(endpoint, { ...options, method: 'DELETE' }),
}
