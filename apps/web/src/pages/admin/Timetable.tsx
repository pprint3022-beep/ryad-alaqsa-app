import TimetableBoard from '../../components/TimetableBoard'

export default function Timetable() {
  return (
    <TimetableBoard
      endpoint="/admin/timetable"
      titleKey="ttAdminTitle"
      hintKey="ttTitle"
      manage
    />
  )
}
