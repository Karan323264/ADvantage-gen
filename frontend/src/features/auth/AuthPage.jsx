import { useState } from "react";
import PublicHeader from "../../components/layout/Header";
import SignupForm from "./SignUpForm.jsx";
import LoginForm from "./LoginForm";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div className="min-h-screen grid-background center-glow">

      <PublicHeader />

      <div className="pt-40 px-6 flex justify-center">
        <div className="w-full max-w-md">
          {isLogin ? (
            <LoginForm switchToSignup={() => setIsLogin(false)} />
          ) : (
            <SignupForm switchToLogin={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;