import TimetableBoard from '../../components/TimetableBoard'

export default function Timetable() {
  return (
    <TimetableBoard
      endpoint="/student/timetable"
      titleKey="ttStudentTitle"
      hintKey="ttTitle"
    />
  )
}
