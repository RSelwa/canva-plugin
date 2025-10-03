import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "utils/db";

export const Login = () => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement login logic here
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const creds = await signInWithEmailAndPassword(auth, email, password);

      // Handle successful login
      console.log("User signed in:", creds);
    } catch (error) {
      // Handle login error
      console.error("Login error", error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" name="email" required />
      <input type="password" placeholder="Password" name="password" required />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
