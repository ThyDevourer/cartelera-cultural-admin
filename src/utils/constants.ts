export const roles = ['normal', 'admin', 'super'] as const
/* eslint-disable-next-line */
export const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
export const imageBaseUrl = import.meta.env.VITE_IMG_BASE_URL ?? `${API_URL}/`
