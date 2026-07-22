import { Link } from "react-router-dom"

const Home = () => {
  return (
    <>
        <p>Welcome to the Home page!</p>
        <Link to="/login">Login</Link>
    </>
  )
}

export default Home