import TimetableBoard from '../../components/TimetableBoard'

export default function Timetable() {
  return (
    <TimetableBoard
      endpoint="/teacher/timetable"
      titleKey="ttTeacherTitle"
      hintKey="ttTitle"
    />
  )
}
