import { useState } from "react";

export type ChatMessage = { sender: "user" | "support"; message: string; time: string };

export function useExamChat(addViolation?: (type: string) => void) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [open, setOpen] = useState(false);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    setMessages((m) => [
      ...m,
      { sender: "user", message: text, time: new Date().toISOString() },
      { sender: "support", message: "Support will contact you shortly.", time: new Date().toISOString() },
    ]);

    addViolation?.("CHAT_USED");
  };

  return { open, setOpen, messages, sendMessage };
}

export function ExamChat({ addViolation }: { addViolation: (type: string) => void }) {
  const { open, setOpen, messages, sendMessage } = useExamChat(addViolation);
  const [text, setText] = useState("");

  if (!open)
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg"
      >
        Chat Support
      </button>
    );

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white border rounded-lg shadow-xl">
      <div className="p-3 font-semibold bg-blue-600 text-white">Exam Support</div>
      <div className="p-2 h-40 overflow-y-auto text-sm">
        {messages.map((m, i) => (
          <div key={i} className="mb-1">
            <strong>{m.sender}:</strong> {m.message}
          </div>
        ))}
      </div>
      <div className="p-2 flex gap-2">
        <input
          className="flex-1 border px-2 py-1 rounded"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={() => {
            sendMessage(text);
            setText("");
          }}
          className="bg-blue-500 text-white px-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
