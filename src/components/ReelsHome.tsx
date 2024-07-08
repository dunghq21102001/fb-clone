import { db, doc, onSnapshot, collection, query, updateDoc } from "../firebase";
import '../assets/css/ReelsHome.css'
import { FiVideo } from "react-icons/fi";
import { HiPhotograph } from "react-icons/hi";
import { MdInsertEmoticon, MdModeEdit } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { AiFillLike } from "react-icons/ai";
import { BiLike } from "react-icons/bi";
import { IoChatbubble } from "react-icons/io5";
import { FaShare } from "react-icons/fa";
import { useEffect, useState } from "react";
import { LuSend } from "react-icons/lu";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addDoc, deleteDoc, orderBy, serverTimestamp } from "firebase/firestore";
import noti from '../common/noti'
const ReelsHome = () => {
    const navigate = useNavigate()
    const user = useSelector(state => state.user)
    const [posts, setPosts] = useState([])
    const [isShowComment, setIsShowComment] = useState(false)
    const [comments, setComments] = useState([])
    const [isShowCreate, setIsShowCreate] = useState(false)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [image, setImage] = useState('')
    const [editingPostId, setEditingPostId] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [visiblePosts, setVisiblePosts] = useState(3);


    useEffect(() => {
        if (user.username === '') return navigate('/login');

        const q = query(collection(db, 'posts'), orderBy('time', 'desc'));
        const unsubscribe = onSnapshot(q, (snapShot) => {
            const postsArray = [];
            snapShot.forEach((doc) => {
                const post = { ...doc.data(), docId: doc.id };
                postsArray.push(post);
            });

            setPosts(postsArray);
        });
        return () => unsubscribe();
    }, []);

    const handleLike = async (index) => {
        const post = posts[index];
        const docRef = doc(db, 'posts', post.docId);
        await updateDoc(docRef, {
            likes: post.likes + 1
        });
    };

    const handleComment = async () => {
        try {
            const docRef = doc(db, 'posts', editingPostId);
            const newCommentData = {
                authorId: user.id,
                authorName: user.fullname,
                image: user.image,
                comment: newComment,
            };
    
            await updateDoc(docRef, {
                comments: [...comments, newCommentData]
            });
    
            setComments([...comments, newCommentData]);
    
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment: ', error);
        }
    };

    const viewComments = (comments: unknown[], postId) => {
        // if (comments.length == 0) return
        setEditingPostId(postId)
        setIsShowComment(true)
        setComments(comments)

    }

    const closeComments = () => {
        setIsShowComment(false)
        setComments([])
    }

    const deletePost = async (docId) => {
        try {
            if (window.confirm("Are you sure you want to delete this post?")) {
                await deleteDoc(doc(db, "posts", docId));
                noti.error("Successfully deleted!");
            }
        } catch (error) {
            console.error("Error removing document: ", error);
        }
    };

    const showCreatePost = () => {
        setIsShowCreate(true)
        setEditingPostId(null)
    }
    const handleEdit = (post) => {
        setTitle(post.title);
        setContent(post.content);
        setImage(post.image);
        setIsShowCreate(true);
        setEditingPostId(post.docId);
    };
    const handlePost = async () => {
        if (!title) {
            noti.error('Please fill title');
            return;
        }
        try {
            if (editingPostId) {
                const docRef = doc(db, 'posts', editingPostId);
                await updateDoc(docRef, {
                    title: title,
                    content: content,
                    image: image
                });
                noti.success("Successfully updated!");
            } else {
                const docRef = await addDoc(collection(db, 'posts'), {
                    authorId: user.id,
                    authorName: user.fullname,
                    authorImage: user.image,
                    title: title,
                    content: content,
                    image: image,
                    likes: 0,
                    comments: [],
                    time: serverTimestamp()
                });
                noti.success("Successfully added!");
            }

            setIsShowCreate(false);
            setTitle('');
            setContent('');
            setImage('');
            setEditingPostId(null);
        } catch (error) {
            console.error('Error adding/updating document: ', error);
        }
    };

    const handleScroll = () => {
        const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;
        if (bottom) {
            setVisiblePosts(prev => prev + 3); 
        }
    };
    
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    return (
        <div className="w-full px-4 md:w-[76%] lg:w-[43%]">
            <div className="px-5 w-full">
                <div className="bg-[#242526] flex flex-col items-center rounded-lg p-4 mt-5">
                    <div className="w-full flex justify-between items-center">
                        <div className="w-[30px] h-[30px] overflow-hidden rounded-full flex items-center justify-center">
                            <img src={user?.image} className="bg-cover object-fill w-full cursor-pointer h-full" />
                        </div>
                        <div onClick={showCreatePost} className="bg-[#3a3b3c] flex items-center justify-start rounded-3xl px-3 py-3 w-[90%] cursor-pointer">
                            <span>What's on your mind, {user?.fullname}?</span>
                        </div>
                    </div>
                    <div className="line"></div>
                    <div className='w-full flex items-center justify-between'>
                        <div className='flex items-center'><FiVideo size={24} color='#f02849' className='mr-2' /> Live Video</div>
                        <div className='flex items-center'><HiPhotograph size={24} color='#45bd62' className='mr-2' /> Photo/Video</div>
                        <div className='flex items-center'><MdInsertEmoticon size={24} color='#f7b928' className='mr-2' /> Feeling/Activity</div>
                    </div>
                </div>
            </div>


            <div className='w-full px-5'>
                {posts.slice(0, visiblePosts).map((post, index) => (
                    <div key={index} className='box py-2 bg-[#242526] rounded-xl my-3'>
                        {/* header post */}
                        <div className='w-full flex items-center justify-between px-3'>
                            <div className='flex items-center justify-between'>
                                <div className="w-[50px] h-[50px] overflow-hidden rounded-full flex items-center justify-center">
                                    <img src={post?.authorImage} className="bg-cover object-fill h-full w-full cursor-pointer" />
                                </div>
                                <div className='ml-3 flex items-start flex-col'>
                                    <span>{post?.authorName}</span>
                                    <span>
                                        {post?.time ? (
                                            new Date(post?.time.seconds * 1000).toLocaleDateString("vi-VN")
                                        ) : (
                                            'Unknown date'
                                        )}
                                    </span>
                                </div>
                            </div>
                            {post?.authorId == user?.id ?
                                <div className="flex items-center justify-between">
                                    <button onClick={() => handleEdit(post)} className="mr-3">
                                        <MdModeEdit size={23} />
                                    </button>
                                    <button onClick={() => deletePost(post?.docId)}><IoMdClose size={30} /></button>
                                </div>
                                : null}
                        </div>
                        {/* body post */}
                        <div className="w-full my-2 px-3">
                            <p>{post?.title}</p>
                            <p>{post?.content}</p>
                        </div>
                        <div className='w-full my-4 flex items-center justify-center'>
                            <img src={post?.image}
                                className=''
                            />
                        </div>
                        {/* footer post */}
                        <div className='px-3 flex items-center justify-start'>
                            <div className='bg-[#0a7bfe] cursor-pointer rounded-full w-[25px] h-[25px] flex items-center justify-center'>
                                <AiFillLike color='#ffffff' size={15} />
                            </div> <span className='ml-3 text-[b0b3b8] text-[18px]'>{post?.likes}</span>
                        </div>
                        <div className='w-full flex items-center justify-center'>
                            <div className='line'></div>
                        </div>
                        <div className='w-full px-3 flex items-center justify-between'>
                            <button onClick={() => handleLike(index)} className='flex hover:bg-gray-700 px-5 w-[25%] py-1 rounded-md items-center justify-center'><BiLike size={25} className='mr-2' /> Like</button>
                            <button onClick={() => viewComments(post?.comments, post?.docId)} className='flex hover:bg-gray-700 px-5 w-[45%] py-1 rounded-md items-center justify-center'><IoChatbubble size={25} className='mr-2' /> Comment {post?.comments.length > 0 ? `(${post?.comments.length})`
                                : null}</button>
                            <button className='flex hover:bg-gray-700 px-5 w-[25%] py-1 rounded-md items-center justify-center'><FaShare size={25} className='mr-2' /> Share</button>
                        </div>
                    </div>
                ))}
            </div>


            {isShowComment
                ? <div className="fog">
                    <div className="relative w-[96%] md:w-[50%] max-h-[90vh] overflow-hidden bg-[#242526] rounded-xl px-4 pt-4 pb-[100px]">
                        <h4 className="text-center text-[24px] font-bold">Comments of post</h4>
                        <button onClick={closeComments} className="absolute right-1 top-3"><IoMdClose color="#ffffff" size={20} /></button>
                        <div className="w-full h-[400px] overflow-y-scroll">
                        {comments.map((comment, index) => (
                            <div key={index} className="w-full flex items-start justify-between my-2">
                                <div className="w-[5%]">
                                    <div className="w-[30px] h-[30px] overflow-hidden rounded-full flex items-center justify-center">
                                        <img src={comment?.image} className="bg-cover object-fill h-full w-full cursor-pointer" />
                                    </div>
                                </div>
                                <div className="w-[92%] flex flex-col items-start bg-[#3a3b3c] rounded-xl px-4 py-1">
                                    <span className="font-bold">{comment?.authorName}</span>
                                    <p>{comment?.comment}</p>
                                </div>
                            </div>
                        ))}
                        </div>
                        <div className="absolute bottom-0 w-full flex items-center justify-center left-0">
                            <div className="w-[95%] flex items-center justify-between mb-4 relative">
                                <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Comment something ..." className="bg-[#3a3b3c] focus:outline-none w-full px-2 py-3 resize-none rounded-xl"></textarea>
                                <button onClick={handleComment} className="absolute top-[50%] right-3 translate-y-[-50%]"><LuSend size={20} color="#1178f2" /></button>
                            </div>
                        </div>
                    </div>
                </div>
                : null}

            {isShowCreate
                ? <div className="fog">
                    <div className="relative w-[96%] md:w-[50%] max-h-[90vh] bg-[#242526] rounded-xl px-2 py-5">
                        <h4 className="text-center text-[24px] font-bold">Tạo bài viết</h4>
                        <button onClick={() => setIsShowCreate(false)} className="absolute right-3 top-3">
                            <IoMdClose color="#ffffff" size={20} />
                        </button>

                        <div className="w-full flex flex-col items-center">
                            <input value={title} type="text" className="w-[90%] my-1 focus:outline-none px-3 py-2 bg-[#3a3b3c] rounded-lg" placeholder={`What on your mind? ${user?.fullname}`} onChange={(e) => setTitle(e.target.value)} />
                            <textarea value={content} className="resize-none w-[90%] my-1 focus:outline-none px-3 py-2 bg-[#3a3b3c] rounded-lg" name="" id="" placeholder={`Write something here...`} onChange={(e) => setContent(e.target.value)}></textarea>
                            <input value={image} type="text" className="w-[90%] my-1 focus:outline-none px-3 py-2 bg-[#3a3b3c] rounded-lg" placeholder={`Image URL. Ex: https://image/123456789`} onChange={(e) => setImage(e.target.value)} />
                            <button onClick={handlePost} className="w-[90%] bg-[#0866ff] px-3 py-2 rounded-lg mt-1">Post</button>
                        </div>
                    </div>
                </div> : null}
        </div>
    )
}

export default ReelsHome