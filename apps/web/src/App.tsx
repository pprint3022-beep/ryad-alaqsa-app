import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Logo from './components/Logo'
import ProtectedRoute from './components/ProtectedRoute'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from './store/auth'

const Approvals = lazy(() => import('./pages/admin/Approvals'))
const AdminCommunications = lazy(() => import('./pages/admin/Communications'))
const CardsCenter = lazy(() => import('./pages/admin/CardsCenter'))
const Community = lazy(() => import('./pages/admin/Community'))
const AdminCurriculum = lazy(() => import('./pages/admin/Curriculum'))
const AdminEngagement = lazy(() => import('./pages/admin/Engagement'))
const Experiments = lazy(() => import('./pages/admin/Experiments'))
const Governance = lazy(() => import('./pages/admin/Governance'))
const Knowledge = lazy(() => import('./pages/admin/Knowledge'))
const People = lazy(() => import('./pages/admin/People'))
const AdminReportCards = lazy(() => import('./pages/admin/ReportCards'))
const AdminTimetable = lazy(() => import('./pages/admin/Timetable'))
const Reports = lazy(() => import('./pages/admin/Reports'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const AssessmentBank = lazy(() => import('./pages/teacher/AssessmentBank'))
const Activities = lazy(() => import('./pages/family/Activities'))
const Amazigh = lazy(() => import('./pages/family/Amazigh'))
const FormativeAssessment = lazy(() => import('./pages/family/FormativeAssessment'))
const ParentTimetable = lazy(() => import('./pages/family/Timetable'))
const Children = lazy(() => import('./pages/family/Children'))
const Insights = lazy(() => import('./pages/family/Insights'))
const LearningPath = lazy(() => import('./pages/family/LearningPath'))
const Messages = lazy(() => import('./pages/family/Messages'))
const Portfolio = lazy(() => import('./pages/family/Portfolio'))
const PrivacyCenter = lazy(() => import('./pages/family/PrivacyCenter'))
const WeeklySummary = lazy(() => import('./pages/family/WeeklySummary'))
const FamilyReportCard = lazy(() => import('./pages/family/ReportCard'))
const StudentProfile = lazy(() => import('./pages/family/StudentProfile'))
const Talents = lazy(() => import('./pages/family/Talents'))
const Login = lazy(() => import('./pages/Login'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Alerts = lazy(() => import('./pages/teacher/Alerts'))
const Attendance = lazy(() => import('./pages/teacher/Attendance'))
const Cases = lazy(() => import('./pages/teacher/Cases'))
const Classes = lazy(() => import('./pages/teacher/Classes'))
const TeacherCommunications = lazy(() => import('./pages/teacher/Communications'))
const TeacherCurriculum = lazy(() => import('./pages/teacher/Curriculum'))
const TeacherEngagement = lazy(() => import('./pages/teacher/Engagement'))
const TeacherTimetable = lazy(() => import('./pages/teacher/Timetable'))
const StudentTimetable = lazy(() => import('./pages/student/Timetable'))
const FeedbackCards = lazy(() => import('./pages/teacher/FeedbackCards'))
const Grades = lazy(() => import('./pages/teacher/Grades'))
const Wellbeing = lazy(() => import('./pages/teacher/Wellbeing'))
const TeacherInterventionPlans = lazy(() => import('./pages/teacher/InterventionPlans'))
const TeacherThreads = lazy(() => import('./pages/teacher/Threads'))
const LessonEditor = lazy(() => import('./pages/teacher/LessonEditor'))
const LessonStudio = lazy(() => import('./pages/teacher/LessonStudio'))
const TeacherTraining = lazy(() => import('./pages/teacher/TeacherTraining'))
const GradesEntry = lazy(() => import('./pages/teacher/GradesEntry'))
const AdminInterventionPlans = lazy(() => import('./pages/admin/InterventionPlans'))
const LessonReview = lazy(() => import('./pages/admin/LessonReview'))
const GradeResults = lazy(() => import('./pages/admin/GradeResults'))

const ADMIN_ROLES = ['director', 'deputy', 'supervisor', 'clerk', 'admin'] as const

export default function App() {
  const { t } = useTranslation()
  const token = useAuthStore((state) => state.token)
  const hydrate = useAuthStore((state) => state.hydrate)

  useEffect(() => {
    if (token) {
      void hydrate()
    }
  }, [token, hydrate])

  return (
    <Suspense
      fallback={
        <div className="grid min-h-screen place-items-center bg-canvas text-content">
          <div className="flex flex-col items-center gap-3">
            <Logo size={56} />
            <p className="text-sm font-extrabold text-muted">{t('loading')}</p>
          </div>
        </div>
      }
    >
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />

          {/* Administration portal — leadership, supervisors and staff. */}
          <Route element={<ProtectedRoute roles={ADMIN_ROLES} portal="admin_portal" />}>
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/report-cards" element={<AdminReportCards />} />
            <Route path="/admin/timetable" element={<AdminTimetable />} />
            <Route path="/admin/cards-center" element={<CardsCenter />} />
            <Route path="/admin/experiments" element={<Experiments />} />
            <Route path="/admin/intervention-plans" element={<AdminInterventionPlans />} />
            <Route path="/admin/lesson-review" element={<LessonReview />} />
            <Route path="/admin/grade-results" element={<GradeResults />} />
            <Route path="/admin/engagement" element={<AdminEngagement />} />
            <Route path="/admin/curriculum" element={<AdminCurriculum />} />
            <Route path="/admin/approvals" element={<Approvals />} />
            <Route path="/admin/communications" element={<AdminCommunications />} />
            <Route path="/admin/people" element={<People />} />
            <Route path="/admin/community" element={<Community />} />
            <Route path="/admin/knowledge" element={<Knowledge />} />
            <Route path="/admin/governance" element={<Governance />} />
          </Route>

          {/* Teacher workspace — class-scoped data only. */}
          <Route element={<ProtectedRoute roles={['teacher']} />}>
            <Route path="/teacher/classes" element={<Classes />} />
            <Route path="/teacher/attendance" element={<Attendance />} />
            <Route path="/teacher/timetable" element={<TeacherTimetable />} />
            <Route path="/teacher/engagement" element={<TeacherEngagement />} />
            <Route path="/teacher/curriculum" element={<TeacherCurriculum />} />
            <Route path="/teacher/question-bank" element={<AssessmentBank />} />
            <Route path="/teacher/grades" element={<Grades />} />
            <Route path="/teacher/feedback-cards" element={<FeedbackCards />} />
            <Route path="/teacher/cases" element={<Cases />} />
            <Route path="/teacher/wellbeing" element={<Wellbeing />} />
            <Route path="/teacher/intervention-plans" element={<TeacherInterventionPlans />} />
            <Route path="/teacher/threads" element={<TeacherThreads />} />
            <Route path="/teacher/lesson-editor" element={<LessonEditor />} />
            <Route path="/teacher/lesson-studio" element={<LessonStudio />} />
            <Route path="/teacher/training" element={<TeacherTraining />} />
            <Route path="/teacher/grades-entry" element={<GradesEntry />} />
            <Route path="/teacher/communications" element={<TeacherCommunications />} />
            <Route path="/teacher/alerts" element={<Alerts />} />
          </Route>

          {/* Parent space — children scope. */}
          <Route element={<ProtectedRoute roles={['parent']} />}>
            <Route path="/parent/children" element={<Children />} />
            <Route path="/parent/report-card" element={<FamilyReportCard />} />
            <Route path="/parent/timetable" element={<ParentTimetable />} />
            <Route path="/parent/insights" element={<Insights />} />
            <Route path="/parent/talents" element={<Talents />} />
            <Route path="/parent/activities" element={<Activities />} />
            <Route path="/parent/messages" element={<Messages />} />
            <Route path="/parent/privacy-center" element={<PrivacyCenter />} />
            <Route path="/parent/weekly-summary" element={<WeeklySummary />} />
            <Route path="/parent/portfolio" element={<Portfolio />} />
          </Route>

          {/* Student space. */}
          <Route element={<ProtectedRoute roles={['student']} />}>
            <Route path="/student/path" element={<LearningPath />} />
            <Route path="/student/amazigh" element={<Amazigh />} />
            <Route path="/student/timetable" element={<StudentTimetable />} />
            <Route path="/student/assessments" element={<FormativeAssessment />} />
            <Route path="/student/report-card" element={<FamilyReportCard />} />
            <Route path="/student/insights" element={<Insights />} />
            <Route path="/student/portfolio" element={<Portfolio />} />
            <Route path="/student/profile" element={<StudentProfile />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
    </Suspense>
  )
}
