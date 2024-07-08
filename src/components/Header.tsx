import { useState, useEffect } from "react"
import { AiFillHome } from "react-icons/ai";
import { MdVideoSettings, MdGroups } from "react-icons/md";
import { IoStorefrontSharp } from "react-icons/io5";
import { IoLogoGameControllerA } from "react-icons/io";
import { GiExitDoor } from "react-icons/gi";
import fbLogo from '../assets/images/Facebook_Logo_(2019).png'
import '../assets/css/Header.css'
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { add1, addUser } from "../slices/userSlice";
import noti from "../common/noti";
const Header = () => {
    const auth = useSelector(state => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [headerItems, setHeaderItems] = useState([
        { name: "Home", isActive: true, icon: <AiFillHome size={28} className="cursor-pointer" /> },
        { name: "Videos", isActive: false, icon: <MdVideoSettings size={28} className="cursor-pointer" /> },
        { name: "Market", isActive: false, icon: <IoStorefrontSharp size={28} className="cursor-pointer" /> },
        { name: "Group", isActive: false, icon: <MdGroups size={28} className="cursor-pointer" /> },
        { name: "Game", isActive: false, icon: <IoLogoGameControllerA size={28} className="cursor-pointer" /> },
    ])

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
    }, []);

    const toggle = () => { setIsOpen(!isOpen) };

    const logout = () => {
        const userData = {
            id: '',
            username: '',
            fullname: '',
            image: ''
        }
        dispatch(addUser(userData))
        localStorage.removeItem('auth')
        navigate('/login')
        setIsOpen(false)
        noti.success('Logout successfully!')
    }
    return (
        <div className="sticky top-0 left-0 w-full bg-[#242526] border-[2px] border-solid border-[#393a3b] flex justify-between p-2 max-h-[70px]">
            <div className="w-[20%]">
                <img src={fbLogo} onClick={() => navigate('/')} className="w-[50px] cursor-pointer" alt="home logo" />
            </div>
            <div className="hidden md:flex items-center justify-between w-[60%] lg:w-[35%]">
                {headerItems.map(item => (
                    <div className={`px-5 ${item.isActive ? 'bline-cus text-[#0866ff]' : 'text-[#b0b3b8]'}`} key={item.name} >
                        {item.icon}
                    </div>
                ))}
            </div>
            <div className="w-[20%] flex items-center justify-end">
                <div className="w-[50px] h-[50px] relative">
                    <div className="w-full h-full overflow-hidden rounded-full flex items-center justify-center">
                        <img onClick={toggle} alt="avt" src={auth.image} className="bg-cover h-full object-fill w-full cursor-pointer" />
                    </div>
                    {isOpen
                        ? <div className="absolute top-full bg-[#242526] py-2 br-cus rounded-2xl right-0 w-[200px] ">
                            <ul className="w-full">
                                <li onClick={logout} className="flex items-center justify-start hover:bg-[#646667] px-3 cursor-pointer">
                                    <div className="flex items-center justify-center w-[50px] h-[50px] rounded-full bg-[#3a3b3c]">
                                        <GiExitDoor size={28} color="#ffffff" />
                                    </div> <span className="ml-2 text-[#e4e6eb] text-[15px]">Logout</span>
                                </li>
                            </ul>
                        </div>
                        : null}
                </div>
            </div>
        </div>
    )
}

export default Header