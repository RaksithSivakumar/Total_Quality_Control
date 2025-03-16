import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import EventCard from "../problem/EventCard";
import { useNavigate } from "react-router-dom";

const Calendar = ({ days, dates, timeSlots, events, selectedDay, onDayClick }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentTimePosition, setCurrentTimePosition] = useState(320);
  const navigate = useNavigate();

  const updateCurrentTime = useCallback(() => {
    setCurrentTime(new Date());

    // Calculate position based on current time
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const startHour = 8;
    const slotHeight = 96; // Approximate height of each time slot in pixels

    if (hours >= startHour && hours < startHour + timeSlots.length) {
      const hoursSinceStart = hours - startHour + minutes / 60;
      const position = hoursSinceStart * slotHeight;
      setCurrentTimePosition(position);
    }
  }, [timeSlots.length]);

  const handleCreate = () => {
    console.log("Create event");
    navigate("/survey");
  };

  useEffect(() => {
    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 40000);
    return () => clearInterval(interval);
  }, [updateCurrentTime]);

  return (
    <div className="bg-white rounded-lg">
      {/* Days of the week */}
      <div className="flex justify-between mb-4 overflow-x-auto pb-2">
        {days.map((day, index) => (
          <div
            key={index}
            className={`flex flex-col items-center min-w-[40px] cursor-pointer ${
              selectedDay === index ? "text-white" : "text-gray-500"
            }`}
            onClick={() => onDayClick(index)}
          >
            <div className="text-sm font-medium mb-1">{day}</div>
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full ${
                selectedDay === index ? "bg-orange-500" : "bg-gray-100"
              }`}
            >
              {dates[index]}
            </div>
          </div>
        ))}
      </div>

      {/* Time slots and events */}
      <div className="relative w-full mt-6">
        {timeSlots.map((slot, index) => (
          <div key={index} className="relative mb-16">
            <div className="flex">
              <div className="w-16 text-gray-500 text-sm">{slot.time}</div>
              <div className="flex-1 border-t border-dashed border-gray-300 relative pt-2">
                {/* Events */}
                {events
                  .filter((event) => event.timePosition === index)
                  .map((event) => (
                    <div
                      key={event.id}
                      className={`absolute left-0 right-0 p-2 rounded-lg ${
                        event.category === "Personal"
                          ? "bg-blue-100 border-l-4 border-blue-500"
                          : "bg-orange-100 border-l-4 border-orange-500"
                      }`}
                      style={{ top: "0px" }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-sm">{event.title}</h3>
                          <p className="text-xs text-gray-500">
                            {event.location} • {event.startTime} - {event.endTime}
                          </p>
                        </div>
                        {event.profileImage && (
                          <img
                            src={event.profileImage || "/placeholder.svg"}
                            alt="Profile"
                            className="w-6 h-6 rounded-full"
                          />
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}

        {/* Current time indicator with "Create" button */}
        <div className="absolute left-0 right-0 p-55 flex items-center" style={{ top: `${currentTimePosition}px` }}>
          <div className="w-16"></div> {/* Spacer to align with time labels */}
          <div className="flex-1 relative">
            <div className="w-full h-0.5 bg-red-400"></div>
            <div 
              className="bg-white border border-gray-300 rounded-full p-2 absolute left-1/2 transform -translate-x-1/2 -mt-3 shadow-sm hover:shadow-md cursor-pointer transition-shadow"
              onClick={handleCreate}
            >
              <Plus className="h-4 w-4 text-orange-500" />
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 mt-6 text-gray-500 text-xs font-medium">
              Create log
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Corrected name spelling from "Calender" to "Calendar"
export default Calendar;