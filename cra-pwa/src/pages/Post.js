import { IoMdArrowBack } from "react-icons/io";
import { BiSolidCommentDetail } from "react-icons/bi";
import { FaHeart } from "react-icons/fa";
import './Post.css';
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function Comment(props) {
    return <li>
        <div>{props.comment.user} <p className="time">{props.comment.formattedDate}</p></div>
        <div>
            <p>{props.comment.content}</p>
            <div className="social-sm"><FaHeart /> {props.comment.likes}</div>
        </div>
    </li>;
}

function Post() {
    let { state } = useLocation()
    const [commentArray, setCommentArray] = useState([]);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        // second: 'numeric',
        // timeZoneName: 'short'
    };

    console.log(state.post);

    useEffect(() => {
        async function fetchData() {
            const response = await axios.get(`http://localhost:8080/comment/${state.post.uid}`);
            let tmpCommentArray = []
            for (let i = 0; i < response.data.length; i++) {
                let tmpComment = {}
                Object.assign(tmpComment,
                    {
                        uid: response.data[i]?.uid,
                        content: response.data[i]?.content,
                        author: response.data[i]?.author,
                        likes: response.data[i]?.likes,
                        createdAt: response.data[i]?.createdAt,
                    });
                const responseAuthor = await axios.get(`http://localhost:8080/user/${tmpComment.author}`)
                const user = responseAuthor.data?.username;
                Object.assign(tmpComment, { user: user });
                const date = new Date(tmpComment.createdAt);
                const formattedDate = date.toLocaleString('en-US', options);
                console.log(formattedDate);
                Object.assign(tmpComment, { formattedDate: formattedDate })
                tmpCommentArray.push(tmpComment)
            }
            setCommentArray(tmpCommentArray);
        }
        console.log(commentArray);
        fetchData();
    }, [])

    const post = { id: state.post.uid, user: state.post.user, title: state.post.title, img: state.post.image, commentsNbr: commentArray.length, likesNbr: state.post.likes };

    const commentsList = commentArray.map((comment, index) => <Comment key={"comment-" + index} comment={comment} />);

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
                        <div className="social"><FaHeart /> {post.likesNbr}</div>
                    </div>
                    <img src={`data:image/png;base64,${post.img}`} alt={post.title} />
                </div>
                <ul>{commentsList}</ul>
            </div>
        </div>
    );
}

export default Post;