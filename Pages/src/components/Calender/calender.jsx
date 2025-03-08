import { useState, useEffect, useCallback } from "react"
import { Plus } from "lucide-react"
import EventCard from "../problem/EventCard";
import { useNavigate } from "react-router-dom";

const Calender = ({ days, dates, timeSlots, events, selectedDay, onDayClick }) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [currentTimePosition, setCurrentTimePosition] = useState(320) // Fixed position for demo

  const updateCurrentTime = useCallback(() => {
    setCurrentTime(new Date())

    // Calculate position based on current time
    // This is a simplified calculation for demo purposes
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const startHour = 8
    const slotHeight = 96 // Approximate height of each time slot in pixels

    if (hours >= startHour && hours < startHour + timeSlots.length) {
      const hoursSinceStart = hours - startHour + minutes / 60
      const position = hoursSinceStart * slotHeight
      setCurrentTimePosition(position)
    }
  }, [timeSlots.length])

  const navigate = useNavigate()
  const handleCreate = () => {
    console.log("Create event")
    navigate("/survey")
  }
  useEffect(() => {
    updateCurrentTime()
    const interval = setInterval(updateCurrentTime, 60000)
    return () => clearInterval(interval)
  }, [updateCurrentTime])

  return (
    <div>
      {/* Days of week */}
      <div className="grid grid-cols-7 mb-2 text-center">
        {days.map((day, index) => (
          <div key={index} className="text-lg text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-7 mb-8 text-center">
        {dates.map((date, index) => (
          <div
            key={index}
            className={`text-2xl font-medium cursor-pointer ${
              index === selectedDay ? "bg-orange-500 text-white rounded-2xl py-4 px-2" : "text-gray-800"
            }`}
            onClick={() => onDayClick(index)}
          >
            {date}
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative w-full">
        {timeSlots.map((slot, index) => (
          <div key={index} className="relative mb-16">
            <div className="text-gray-500 text-lg">{slot.time}</div>
            <div className="border-t border-dashed border-gray-300 w-full mt-4"></div>

            {/* Events */}
            {events
              .filter((event) => event.timePosition === index)
              .map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
          </div>
        ))}
 
        {/* Current time indicator */}
        <div className="absolute left-0 right-0 p-55 flex items-center" style={{ top: `${currentTimePosition}px` }}>
          {/* <div className="w-full h-0.5 bg-red-400"></div> */}
          <div className="bg-white border border-gray-300 rounded-full p-2 absolute left-1/2 transform -translate-x-1/2" onClick={handleCreate}>
            <Plus className="h-4 w-4 text-gray-400" />
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2 mt-8 text-gray-500">Click to create log</div>
        </div>
      </div>
    </div>
  )
}

export default Calender

