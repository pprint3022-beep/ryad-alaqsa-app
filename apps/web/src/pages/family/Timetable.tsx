import TimetableBoard from '../../components/TimetableBoard'

export default function Timetable() {
  return (
    <TimetableBoard
      endpoint="/parent/timetable"
      titleKey="ttParentTitle"
      hintKey="ttTitle"
    />
  )
}
