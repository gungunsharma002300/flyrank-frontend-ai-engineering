import ChatWindow from "./components/ChatWindow.jsx";
import FeedbackForm from "./components/FeedbackForm.jsx";

export default function App() {
  return (
    <main>
      <h1>Testing Pass demo</h1>
      <ChatWindow />
      <section aria-label="Feedback">
        <h2>Feedback</h2>
        <FeedbackForm />
      </section>
    </main>
  );
}
