import { format } from "date-fns";

type MessageContent = {
  author: string;
  message: string;
  time: Date;
};

const SendMsgBubble = ({ author, message, time }: MessageContent) => {
  const handleDateFormat = () => {
    //   // Create a new Date object
    const currentDate = new Date(time);

    // Define the desired format
    const dateFormat = "MMM d 'at' h:mma";

    // Format the date
    return format(currentDate, dateFormat);
  };

  const formattedDate = handleDateFormat();

  const firstNameInitial = author.charAt(0).toUpperCase();

  return (
    <div className="chat chat-end ">
      <div className="chat-image  ">
        <div className="avatar placeholder pr-1 ">
          <div className="bg-neutral text-neutral-content rounded-full w-10 ">
            <span className="text-lg">{firstNameInitial}</span>
          </div>
        </div>
      </div>
      <div className="chat-header">{author}</div>
      <div
        className="chat-bubble chat-bubble-primary max-w-xs"
        style={{ overflowWrap: "break-word" }}
      >
        {message}
      </div>
      <div className="chat-footer opacity-50">
        <time className="text-xs">{formattedDate}</time>
      </div>
    </div>
  );
};

export default SendMsgBubble;
