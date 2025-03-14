const ApprovalCard = ({ approval }) => {
  const { title, description, date, status } = approval

  const getStatusStyles = (status) => {
    switch (status) {
      case "accepted":
        return {
          bg: "bg-green-100",
          text: "text-green-600",
          label: "Accepted",
        }
      case "rejected":
        return {
          bg: "bg-red-100",
          text: "text-red-600",
          label: "Rejected",
        }
      case "inprogress":
        return {
          bg: "bg-purple-100",
          text: "text-purple-600",
          label: "Inprogress",
        }
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-600",
          label: "Unknown",
        }
    }
  }

  const statusStyles = getStatusStyles(status)

  return (
    <div className="bg-gray-100 p-4 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium">{title}</h3>
        <span className={`${statusStyles.bg} ${statusStyles.text} px-3 py-1 rounded-mb text-sm`}>
        {/* bg-[#F0F4F8] p-4 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow */}
          {statusStyles.label}
        </span>
      </div>
      <p className="text-gray-600 mb-2">{description}</p>
      <p className="text-gray-400 text-sm">{date}</p>
    </div>
  )
}

export default ApprovalCard

