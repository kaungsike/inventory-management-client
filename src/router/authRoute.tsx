import EmailVerifyPage from "@/auth/pages/EmailVerifyPage";
import LoginPage from "@/auth/pages/LoginPage";
import RegisterPage from "@/auth/pages/RegisterPage";
import AuthLayout from "@/layout/AuthLayout";


const authRoute = [
  {
    element:  <AuthLayout/>,
    children: [
      { path: "/login", element: <LoginPage/> },
      { path: "/register", element: <RegisterPage/> },
      { path: "/verify-email", element: <EmailVerifyPage/> }
    //   { path: "/ucsh-student-voting-admin", element: <AdminLoginPage/>}
    ],
  },
];

export default authRoute;