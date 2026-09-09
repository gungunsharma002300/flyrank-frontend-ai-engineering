import { useState } from "react";

function validate({ name, email, message }) {
  const errors = {};
  if (!name.trim()) {
    errors.name = "Name is required.";
  }
  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!message.trim()) {
    errors.message = "Message is required.";
  } else if (message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters.";
  }
  return errors;
}

export default function FeedbackForm({ onSubmit }) {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
      onSubmit?.(values);
    }
  }

  if (submitted) {
    return <p role="status">Thanks — your feedback has been sent.</p>;
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="feedback-name">Name</label>
      <input
        id="feedback-name"
        name="name"
        value={values.name}
        onChange={handleChange}
        aria-invalid={Boolean(errors.name)}
        aria-describedby={errors.name ? "name-error" : undefined}
      />
      {errors.name && (
        <p id="name-error" role="alert">
          {errors.name}
        </p>
      )}

      <label htmlFor="feedback-email">Email</label>
      <input
        id="feedback-email"
        name="email"
        type="email"
        value={values.email}
        onChange={handleChange}
        aria-invalid={Boolean(errors.email)}
        aria-describedby={errors.email ? "email-error" : undefined}
      />
      {errors.email && (
        <p id="email-error" role="alert">
          {errors.email}
        </p>
      )}

      <label htmlFor="feedback-message">Message</label>
      <textarea
        id="feedback-message"
        name="message"
        value={values.message}
        onChange={handleChange}
        aria-invalid={Boolean(errors.message)}
        aria-describedby={errors.message ? "message-error" : undefined}
      />
      {errors.message && (
        <p id="message-error" role="alert">
          {errors.message}
        </p>
      )}

      <button type="submit">Send feedback</button>
    </form>
  );
}
