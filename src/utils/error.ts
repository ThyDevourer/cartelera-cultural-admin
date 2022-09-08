export class APIError extends Error {
  status: number

  constructor (message: string, status: number) {
    super(message)
    Object.setPrototypeOf(this, APIError.prototype)

    this.name = 'APIError'
    this.status = status
  }
}
