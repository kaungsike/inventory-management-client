import { Outlet } from "react-router-dom"
import { useStudentSync } from "@/student/hooks/useStudentSync"
import Header from "../public/components/Header"
import Footer from "../public/components/Footer"
import { Banner } from "@/components/ui/banner"

export default function StudentLayout() {
  useStudentSync()

  return (
    <div className="flex min-h-screen flex-col">
      <Banner /> 
      <Header  />
      <main className="container mx-auto flex-1 px-4 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
