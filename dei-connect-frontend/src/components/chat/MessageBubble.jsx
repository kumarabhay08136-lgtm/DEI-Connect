import { classNames, formatMessageTime } from "../../utils/helpers";

export default function MessageBubble({ message, isOwn }) {
  return (
    <div className={classNames("flex mb-md", isOwn ? "justify-end" : "justify-start")}>
      <div
        className={classNames(
          "max-w-[75%] px-md py-sm rounded-2xl text-body-sm",
          isOwn
            ? "bg-primary text-white rounded-br-sm"
            : "bg-surface-container-low text-on-surface rounded-bl-sm"
        )}
      >
        <p className="whitespace-pre-line">{message.text}</p>
        <p className={classNames("text-[10px] mt-1", isOwn ? "text-white/60" : "text-outline")}>
          {formatMessageTime(message.time)}
        </p>
      </div>
    </div>
  );
}
