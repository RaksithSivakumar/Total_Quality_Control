import { Circle, Play } from "lucide-react"

const EventCard = ({ event }) => {
  const { title, category, location, startTime, endTime, hasPlayButton, profileImage } = event

  const getCategoryColor = (category) => {
    switch (category) {
      case "Personal":
        return {
          bg: "bg-blue-50",
          text: "text-blue-500",
          fill: "fill-blue-500",
        }
      case "QP":
        return {
          bg: "bg-purple-50",
          text: "text-purple-500",
          fill: "fill-purple-500",
        }
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-500",
          fill: "fill-gray-500",
        }
    }
  }

  const colors = getCategoryColor(category)

  return (
    <div className={`absolute left-1/4 right-10 p-4 rounded-xl ${colors.bg}`} style={{ top: "0" }}>
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          <div className="flex items-center mt-1">
            <Circle className={`h-2 w-2 mr-2 ${colors.text} ${colors.fill}`} />
            <span className={colors.text}>{category}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-gray-700">{location}</div>
          <div className="text-gray-500">
            {startTime}-{endTime}
          </div>
        </div>
      </div>

      {hasPlayButton && (
        <div className="flex items-center mt-2">
          {profileImage && (
            <img src={profileImage || "/placeholder.svg"} alt="Profile" className="w-8 h-8 rounded-full mr-auto" />
          )}
          <button className="ml-auto bg-purple-400 p-3 rounded-full">
            <Play className="h-5 w-5 text-white" />
          </button>
        </div>
      )}
    </div>
  )
}

export default EventCard

