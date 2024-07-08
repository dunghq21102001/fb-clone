import { FaUserFriends } from "react-icons/fa";
import { FaClockRotateLeft } from "react-icons/fa6";
import { BsSaveFill } from "react-icons/bs";
import { MdGroups, MdVideoCameraFront } from "react-icons/md";
import { useSelector } from "react-redux";

const LeftSideHome = () => {
    const auth = useSelector(state => state.user)
    const lists = [
        { name: 'Friends', icon: <FaUserFriends size={22} color="#1a81f4" /> },
        { name: 'Memories', icon: <FaClockRotateLeft size={22} color="#91c1ed" /> },
        { name: 'Saved', icon: <BsSaveFill size={22} color="#c83eb9" /> },
        { name: 'Groups', icon: <MdGroups size={22} color="#1a80f4" /> },
        { name: 'Videos', icon: <MdVideoCameraFront size={22} color="#30aad4" /> },
    ]
    return (
        <div className="hidden h-full overflow-y-scroll lg:block w-[23%] pl-5 py-2">
            <div className="h-full">
                <li className='hover:bg-gray-500 hover:rounded-xl cursor-pointer flex items-center justify-start mb-2 px-3 py-[10px]'>
                    <div className="w-[30px] h-[30px] overflow-hidden rounded-full flex items-center justify-center">
                        <img src={auth?.image} className="bg-cover object-fill h-full w-full cursor-pointer" />
                    </div> <span className="ml-3">{auth?.fullname}</span>
                </li>
                <ul>
                    {lists.map((item) => (
                        <li className='hover:bg-gray-500 hover:rounded-xl cursor-pointer flex items-center justify-start mb-2 px-3 py-[10px] text-[18px]' key={item.name}>
                            {item.icon} <span className="ml-5">{item.name}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default LeftSideHome