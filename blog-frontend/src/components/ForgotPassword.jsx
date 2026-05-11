import { useForm } from "react-hook-form";
import { useState } from "react";
import { formCard, formTitle, formGroup, labelClass, inputClass, submitBtn, errorClass, mutedText } from "../styles/common";
import { toast } from "react-hot-toast";

function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data) => {
    try {
      // Call backend API to trigger password reset
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email })
      });
      const result = await response.json();
      if (response.ok) {
        toast.success("Password reset link sent to your email");
        setSubmitted(true);
      } else {
        toast.error(result.message || "Failed to send reset link");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className={formCard}>
        <h2 className={formTitle}>Forgot Password</h2>
        {submitted ? (
          <p className={mutedText}>If an account exists for that email, a reset link has been sent.</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={formGroup}>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className={inputClass}
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className={errorClass}>{errors.email.message}</p>}
            </div>
            <button type="submit" className={submitBtn}>
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
