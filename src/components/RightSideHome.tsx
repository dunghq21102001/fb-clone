
const RightSideHome = () => {
  const lists = [
    { name: 'Nguyen Van An', url: 'https://i.pinimg.com/236x/cd/cb/0c/cdcb0cb30bc700c53f12eff840156b29.jpg' },
    { name: 'Nguyen Thi Ngoc', url: 'https://i.pinimg.com/236x/cd/cb/0c/cdcb0cb30bc700c53f12eff840156b29.jpg' },
    { name: 'Nguyen Tran Thanh', url: 'https://i.pinimg.com/236x/cd/cb/0c/cdcb0cb30bc700c53f12eff840156b29.jpg' },
    { name: 'Nguyen Ngoc', url: 'https://i.pinimg.com/236x/cd/cb/0c/cdcb0cb30bc700c53f12eff840156b29.jpg' },
    { name: 'Van An', url: 'https://i.pinimg.com/236x/cd/cb/0c/cdcb0cb30bc700c53f12eff840156b29.jpg' },
    { name: 'Tran Van An', url: 'https://i.pinimg.com/236x/cd/cb/0c/cdcb0cb30bc700c53f12eff840156b29.jpg' },
    { name: 'Thanh Van An', url: 'https://i.pinimg.com/236x/cd/cb/0c/cdcb0cb30bc700c53f12eff840156b29.jpg' },
  ]
  return (
    <div className="hidden md:block w-[23%]">
      <h5 className="text-[b0b3b8] text-[18px] mt-5">Contacts</h5>
      <div className="w-full py-2">
        <ul className="w-full">
          {lists.map(item => (
            <li key={item.name} className="flex items-center justify-start px-2 py-3 hover:bg-gray-700 cursor-pointer rounded-xl">
              <div className="w-[30px] h-[30px] overflow-hidden rounded-full">
                <img src={item.url} className="bg-cover object-cover w-full cursor-pointer" />
              </div>
              <span className="ml-3">{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default RightSideHome