function Header({ username }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src="/placeholder.svg?height=50&width=50"
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover border-2 border-green-500"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-semibold">Hello, {username}</h1>
          <div className="flex items-center text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">1500 Points</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header

