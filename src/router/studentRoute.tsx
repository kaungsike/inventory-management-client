import RequireStudent from "@/components/RequireStudent"
import StudentLayout from "@/layout/StudentLayout"
import ChangePasswordPage from "@/student/pages/ChangePasswordPage"
import ProfilePage from "@/student/pages/ProfilePage"

const studentRoute = [
  {
    element: <RequireStudent />,
    children: [
      {
        element: <StudentLayout />,
        children: [
          { path: "/student/profile", element: <ProfilePage /> },
          {
            path: "/student/change-password",
            element: <ChangePasswordPage />,
          },
        ],
      },
    ],
  },
]

export default studentRoute
