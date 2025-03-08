import { Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Header = ({ username }) => {
  const navigate = useNavigate()

  const handleCreate = () => {
      console.log("Create event")
      navigate("/survey")
    }

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl text-gray-600 font-normal">Welcome {username}. .</h1>
      <button className="flex items-center gap-2 text-gray-600" onClick={handleCreate}>
        Create log
        <div className="bg-orange-500 text-white p-2 rounded-md">
          <Plus className="h-5 w-5" />
        </div>
      </button>
    </div>
  )
}

export default Header

