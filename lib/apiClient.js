const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

async function apiClient(endpoint, options = {}) {
	const { method = 'GET', body, headers = {}, ...customConfig } = options

	const isFormData = body instanceof FormData

	const config = {
		method,
		credentials: 'include', // CRITICAL: Allows browser client-side fetches to send HttpOnly cookies
		...customConfig,
		headers: {
			...(!isFormData &&
				body !== undefined && { 'Content-Type': 'application/json' }),
			...headers,
		},
	}

	if (body !== undefined) {
		config.body = isFormData ? body : JSON.stringify(body)
	}

	const url = endpoint.startsWith('http')
		? endpoint
		: `${BASE_URL}${endpoint}`

	try {
		const response = await fetch(url, config)
		const responseData = await response.json().catch(() => ({}))

		if (!response.ok) {
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
	get: (endpoint, options = {}) =>
		apiClient(endpoint, { ...options, method: 'GET' }),

	post: (endpoint, body, options = {}) =>
		apiClient(endpoint, {
			...options,
			body: body ?? options.body,
			method: 'POST',
		}),

	put: (endpoint, body, options = {}) =>
		apiClient(endpoint, {
			...options,
			body: body ?? options.body,
			method: 'PUT',
		}),

	patch: (endpoint, body, options = {}) =>
		apiClient(endpoint, {
			...options,
			body: body ?? options.body,
			method: 'PATCH',
		}),

	delete: (endpoint, options = {}) =>
		apiClient(endpoint, {
			...options,
			body: options.body,
			method: 'DELETE',
		}),
}
