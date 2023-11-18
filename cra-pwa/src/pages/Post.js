import { IoMdArrowBack } from "react-icons/io";
import { BiSolidCommentDetail } from "react-icons/bi";
import { IoSend } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import './Post.css';
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

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

function Post() {
    let { state } = useLocation()
    const [commentArray, setCommentArray] = useState([]);
    const [newComment, setNewComment] = useState("");
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
        fetchData();
    }, [])

    const post = { id: state.post.uid, user: state.post.user, title: state.post.title, img: state.post.image, commentsNbr: commentArray.length, likesNbr: state.post.likesUid.length };

    const commentsList = commentArray.map((comment, index) => <Comment key={"comment-" + index} comment={comment} onUpdateLike={onUpdateCommentLike} />);

    async function fetchData() {
        const response = await axios.get(`http://localhost:8080/comment/${state.post.uid}`);
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
        // TODO Doesn't work for some reason
        console.log("state.post.uid", state.post.uid);
        const res = await axios.patch(`http://localhost:8080/publication/like_unlike/${state.post.uid}`, null, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            }
        });
        console.log("res", res);
        fetchData();
    }

    async function onSubmitMessage() {
        setNewComment("");
        await axios.post(`http://localhost:8080/comment`, {
            publicationUid: state.post.uid,
            content: newComment
        }, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            }
        });
        fetchData();
    }

    return (
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
                            style={{ color: state.post.likesUid.includes(userInfo.uid) ? 'red' : 'white' }}
                            onClick={() => onUpdatePostLike()}
                        /> {post.likesNbr}</div>
                    </div>
                    <img src={`data:image/png;base64,${post.img}`} alt={post.title} />
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
    );
}

export default Post;