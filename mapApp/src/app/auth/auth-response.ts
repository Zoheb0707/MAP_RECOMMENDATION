export interface AuthResponse {
    user: {
        user_id: string,
        first_name: string,
        last_name: string,
        expires_in: number
    }
}
