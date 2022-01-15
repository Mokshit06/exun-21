import axios from 'axios';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();

  return (
    <form
      onSubmit={async e => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        await axios.post('/api/auth/login', {
          email: formData.get('email'),
          password: formData.get('password'),
        });

        router.push('/dashboard');
      }}
    >
      <label>
        <span>Email</span>
        <input type="email" name="email" />
      </label>
      <label>
        <span>Password</span>
        <input type="password" name="password" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}
