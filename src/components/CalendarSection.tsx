import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface Props {
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
}

export default function CalendarSection({
  selectedDate,
  setSelectedDate,
}: Props) {
  return (
    <div className="calendar-section">
      <h2>Calendar</h2>

      <Calendar
        onChange={(date) => setSelectedDate(date as Date)}
        value={selectedDate}
      />
    </div>
  );
}
