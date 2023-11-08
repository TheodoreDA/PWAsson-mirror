import { IoMdArrowBack } from "react-icons/io";
import { BiSolidCommentDetail } from "react-icons/bi";
import { FaHeart } from "react-icons/fa";
import './Post.css';
import { Link } from "react-router-dom";

function Comment(props) {
    return <li>
        <div>{ props.comment.user } <p className="time">{ props.comment.time }</p></div>
        <div>
            <p>{ props.comment.content }</p>
            <div className="social-sm"><FaHeart/> { props.comment.likesNbr }</div>
        </div>
    </li>;
}

function Post() {
    const comments = [
        { id: 1, user: "Mr Poulpe", time: "il y a 5 mins", content: "Je suis pas vraiment d'accord avec toi en vrai. Ma mère elle est plus belle", likesNbr: 14 },
        { id: 1, user: "Mr Propre", time: "il y a 55 mins", content: "Je suis une huître", likesNbr: 140 }
    ];
    const post = { id: 1, user: "Ashmoore", title: "Regardez ma chèvre, elle est trop belle", time: "il y a 1 heure", img: "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcQ_roUCfAO8PBWPLvOM-DrYsUboxcf3tgMobBtqKqviYGRIiwpy0AW5BNBfDOe4JbKcjMFT8zsgA5bQcFU", commentsNbr: comments.length, likesNbr: 1000 };
    const user = "Mr Poulpe";
    const commentsList = comments.map((comment, index) => <Comment key={ "comment-"+index } comment={comment}/>);

    return (
        <div className="Post">
            <div className="header">
                <div><Link to="/feed" className="return-cursor"><IoMdArrowBack/>Retour</Link></div>
                <h1>{ post.title }</h1>
                <Link to="/profile" className="username cursor-pointer">{ user }</Link>
            </div>
            <div className="body">
                <div className="post">
                    <div>
                        <p>{ post.user }</p>
                        <p className="time">{ post.time }</p>
                        <div className="social"><BiSolidCommentDetail/> { post.commentsNbr }</div>
                        <div className="social"><FaHeart/> { post.likesNbr }</div>
                    </div>
                    <img src={ post.img } alt={ post.title }/>
                </div>
                <ul>{ commentsList }</ul>
            </div>
        </div>
    );
}

export default Post;