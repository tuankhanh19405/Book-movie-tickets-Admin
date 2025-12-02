const StatCard = ({ title, value, icon: Icon, color, subText, subColor }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 h-full flex flex-col justify-between">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800 m-0">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
        <Icon className={color.replace('bg-', 'text-')} size={24} />
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      <span className={`${subColor} font-medium bg-opacity-10 px-2 py-0.5 rounded-full text-xs`}>
        {subText}
      </span>
      <span className="text-gray-400 ml-2 text-xs">so với tháng trước</span>
    </div>
  </div>
);
export default StatCard