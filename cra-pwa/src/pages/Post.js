import { IoMdArrowBack } from "react-icons/io";
import { BiSolidCommentDetail } from "react-icons/bi";
import { IoSend } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import './Post.css';
import { Link, useLocation } from "react-router-dom";
import { BiWifi, BiWifiOff } from "react-icons/bi";
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function Comment(props) {
    const userInfo = jwtDecode(localStorage.getItem('token'));

    return <li>
        <div>{props.comment.user} <p className="time">{props.comment.formattedDate}</p></div>
        <div>
            <p>{props.comment.content}</p>
            <div className="social-sm"><FaHeart style={{ color: props.comment.likesUid.includes(userInfo.uid) ? 'red' : 'white' }} onClick={() => props.onUpdateLike(props.comment.uid)} /> {props.comment.likesUid.length}</div>
        </div>
    </li>;
}

function Publication() {
    let { state } = useLocation()
    const [commentArray, setCommentArray] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [post, setPost] = useState({});
    const [postImg, setPostImg] = useState(null);
    const [isLiked, setIsLiked] = useState(false);

    const urlSearchParams = new URLSearchParams(window.location.search);
    const postId = urlSearchParams.get('id');
    const navigate = useNavigate();

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        // second: 'numeric',
        // timeZoneName: 'short'
    };
    const userInfo = jwtDecode(localStorage.getItem('token'));

    useEffect(() => {
        const getPost = async () => {
            axios.get(`http://localhost:8080/publication/${postId}`).then((response) => {
                setPost({...response.data, likesNbr: response.data.likesUid.length});
                setIsLiked(response.data.likesUid.includes(userInfo.uid));
                fetchData();
            }).catch((error) => {
                navigate("/feed");
            });
        }
        getPost();        
    }, [])

    useEffect(() => {
        const getPostImg = async () => {
            if (!post.pictureUid) return;
            const responsePircture = await axios.get(`http://localhost:8080/publication/picture/${post.pictureUid}`);
            const base64String = btoa(String.fromCharCode(...new Uint8Array(responsePircture.data?.data)));
            setPostImg(base64String);
        }
        getPostImg();
    }, [post])

    useEffect(() => {
        setPost({...post, commentsNbr: commentArray.length})
    }, [commentArray])

    const commentsList = commentArray.map((comment, index) => <Comment key={"comment-" + index} comment={comment} onUpdateLike={onUpdateCommentLike} />);

    async function fetchData() {
        const response = await axios.get(`http://localhost:8080/comment/${postId}`);
        let tmpCommentArray = []
        for (let i = 0; i < response.data.length; i++) {
            let tmpComment = {}
            Object.assign(tmpComment,
                {
                    uid: response.data[i]?.uid,
                    content: response.data[i]?.content,
                    authorUid: response.data[i]?.authorUid,
                    likesUid: response.data[i]?.likesUid,
                    createdAt: response.data[i]?.createdAt,
                });
            const responseAuthor = await axios.get(`http://localhost:8080/user/${tmpComment.authorUid}`)
            const user = responseAuthor.data?.username;
            Object.assign(tmpComment, { user: user });
            const date = new Date(tmpComment.createdAt);
            const formattedDate = date.toLocaleString('en-US', options);
            Object.assign(tmpComment, { formattedDate: formattedDate })
            tmpCommentArray.push(tmpComment)
        }
        setCommentArray(tmpCommentArray);
    }

    async function onUpdateCommentLike(commentUid) {
        await axios.patch(`http://localhost:8080/comment/like_unlike/${commentUid}`, null, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            }
        });
        fetchData();
    }

    async function onUpdatePostLike() {
        await axios.patch(`http://localhost:8080/publication/like_unlike/${post.uid}`, null, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            }
        }).catch((error) => {
            console.log(error);
            return;
        });
        setIsLiked(!isLiked);
    }

    async function onSubmitMessage() {
        setNewComment("");
        await axios.post(`http://localhost:8080/comment`, {
            publicationUid: post.uid,
            content: newComment
        }, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            }
        });
        fetchData();
    }

    return (
        <>
        { post.likesUid ? 
            <>
                <div className="Post">
                    <div className="header">
                        <div><Link to="/feed" className="return-cursor"><IoMdArrowBack />Retour</Link></div>
                        <h1>{post.title}</h1>
                        <Link to="/profile" className="username cursor-pointer">{localStorage.getItem("username")}</Link>
                    </div>
                    <div className="body">
                        <div className="post">
                            <div>
                                <p>{post.user}</p>
                                {/* <p className="time">{post.time}</p> */}
                                <div className="social"><BiSolidCommentDetail /> {post.commentsNbr}</div>
                                <div className="social"><FaHeart
                                    style={{ color: isLiked ? 'red' : 'white' }}
                                    onClick={() => onUpdatePostLike()}
                                /> {post.likesNbr}</div>
                            </div>
                            <img src={`data:image/png;base64,${postImg}`} alt={post.title} />
                        </div>
                        <ul>{commentsList}</ul>
                        <div className="send-message">
                        <input
                            placeholder="Mon message..."
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            onKeyUp={e => {
                                if (e.key === "Enter")
                                    onSubmitMessage();
                            }}
                        />
                        <IoSend className="cursor-pointer" onClick={() => this.onSubmitMessage()} />
                    </div>
                </div>
            </div>
        </>
            : <>
            </>
        }
        </>

    );
}

export default Publication;