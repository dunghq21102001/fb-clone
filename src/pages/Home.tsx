import LeftSideHome from "../components/LeftSideHome"
import ReelsHome from "../components/ReelsHome"
import RightSideHome from "../components/RightSideHome"

function Home() {
  return (
    <div className="w-full h-full flex items-start justify-between">
      <LeftSideHome />
      <ReelsHome />
      <RightSideHome />
    </div>
  )
}

export default Home