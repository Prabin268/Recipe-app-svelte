export async function loginUser(email: string, password: string) {
	if (email === 'admin@test.com' && password === '123456') {
		return { id: 1, email };
	}

	throw new Error('Invalid credentials');
}