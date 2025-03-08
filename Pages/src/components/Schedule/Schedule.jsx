import React from 'react';
import { Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Theme colors
const theme = {
  statusAccepted: '#26C351',
  statusRejected: '#FF4848',
};

export const ScheduleComponent = ({ schedules, dispatch }) => {
  const handleAccept = (schedule) => {
    dispatch({ type: 'ACCEPT_SCHEDULE', payload: schedule });
  };

  const handleReject = (schedule) => {
    dispatch({ type: 'REJECT_SCHEDULE', payload: schedule });
  };

  return (
    <div>
      {/* Today Schedules */}
      <div>Today schedules</div>
      {schedules.today.map((schedule, index) => (
        <div key={index}>
          <div>
            <span>Name: {schedule.name}</span>
            <span>Time: {schedule.time}</span>
            <span>Contact number: {schedule.contact}</span>
            <span>Venue: {schedule.venue}</span>
          </div>
          <div>
            <Button
              style={{ backgroundColor: theme.statusAccepted, color: 'white' }}
              onClick={() => handleAccept(schedule)}
            >
              Accept
            </Button>
            <Button
              style={{ backgroundColor: theme.statusRejected, color: 'white' }}
              onClick={() => handleReject(schedule)}
            >
              Reject
            </Button>
          </div>
        </div>
      ))}

      {/* Accepted Schedules */}
      <div>Accepted schedules</div>
      {schedules.accepted.map((schedule) => (
        <div key={schedule.name}>
          <div>
            <span>Name: {schedule.name}</span>
            <span>Time: {schedule.time}</span>
            <span>Contact number: {schedule.contact}</span>
            <span>Venue: {schedule.venue}</span>
          </div>
          <div>{schedule.date}</div>
          <CheckCircleIcon style={{ color: theme.statusAccepted }} />
        </div>
      ))}

      {/* Rejected Schedules */}
      <div>Rejected schedules</div>
      {schedules.rejected.map((schedule) => (
        <div key={schedule.name}>
          <div>
            <span>Name: {schedule.name}</span>
            <span>Time: {schedule.time}</span>
            <span>Contact number: {schedule.contact}</span>
            <span>Venue: {schedule.venue}</span>
          </div>
          <div>{schedule.date} ×</div>
        </div>
      ))}
    </div>
  );
};