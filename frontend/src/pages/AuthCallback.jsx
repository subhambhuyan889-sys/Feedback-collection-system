import { useEffect, useState } from "react";

export default function AuthCallback() {
  const [message, setMessage] = useState("Signing you in with Google...");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");

    if (token) {
      localStorage.setItem("token", token);
      window.location.replace("/dashboard");
      return;
    }

    setHasError(Boolean(error));
    setMessage(error ? "Google login failed. Please try again." : "Completing Google login...");
  }, []);

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-6 text-white">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center text-slate-900 shadow-2xl">
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-slate-950 font-bold text-white">F</div>
        <h1 className="text-xl font-bold">FeedbackHub</h1>
        <p className="mt-2 text-sm text-slate-500">{message}</p>
        {hasError && (
          <a className="mt-6 inline-block rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white" href="/login">
            Back to login
          </a>
        )}
      </div>
    </main>
  );
}
