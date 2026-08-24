// lib/apiClient.js
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

async function apiClient(endpoint, options = {}) {
	const { method = 'GET', body, headers = {}, ...customConfig } = options

	const isFormData = body instanceof FormData

	const config = {
		method,
		...customConfig, // Spreads options like credentials, cache, signal, next, etc.
		headers: {
			// Auto-set JSON header only if body exists and is not FormData
			...(!isFormData &&
				body !== undefined && { 'Content-Type': 'application/json' }),
			...headers, // Safely merges custom headers without getting overwritten
		},
	}

	if (body !== undefined) {
		config.body = isFormData ? body : JSON.stringify(body)
	}

	const url = endpoint.startsWith('http')
		? endpoint
		: `${BASE_URL}${endpoint}`

	try {
		console.log(`****** fetch URL `, url)
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

	// Accepts body as 2nd parameter OR inside options.body
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
