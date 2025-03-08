import Avatar from "@mui/material/Avatar";

const Card = ({ title, status, description, date, author, imageUrl, onClick }) => {
  return (
    <div
      className="bg-[#F0F4F8] p-4 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick} // Trigger onClick when the card is clicked
      role="button" // Improve accessibility
      tabIndex={0} // Make the card focusable
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick(); // Trigger onClick on Enter or Space key press
        }
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-800">{title}</h3>
        <span
          className={`text-xs px-2 py-1 rounded ${
            status === "New"
              ? "bg-purple-100 text-purple-600"
              : status === "Rejected"
              ? "bg-red-100 text-red-600"
              : status === "Accepted"
              ? "bg-green-100 text-green-600"
              : status === "Need to verify"
              ? "bg-blue-100 text-purple-600"
              : "bg-gray-100 text-gray-600" // Default style for unknown status
          }`}
        >
          {status}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">{date}</span>
        <div className="flex items-center">
          <Avatar
            alt={author}
            src={imageUrl}
            sx={{ width: 24, height: 24 }} // Adjust size as needed
            className="mr-2"
          />
          <span className="text-xs text-gray-600">By: {author}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;