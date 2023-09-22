import { IoIosChatbubbles } from "react-icons/io";
import { MdOutlineAddBox } from "react-icons/md";
import { BiSolidCommentDetail } from "react-icons/bi";
import { FaHeart } from "react-icons/fa";
import './Feed.css';

function ListItem(props) {
    return <li className="cursor-pointer">
        <p>{ props.post.user }</p>
        <p className="time">{ props.post.time }</p>
        <p>{ props.post.title }</p>
        <img src={props.post.img} alt={ props.post.title }/>
        <div className="social">
            <div><BiSolidCommentDetail/> { props.post.commentsNbr }</div>
            <div><FaHeart/> { props.post.likesNbr }</div>
        </div>
    </li>;
}

function Feed() {
    const posts = [
        { id: 1, user: "Ashmoore", title: "Regardez ma chèvre, elle est trop belle", time: "il y a 1 heure", img: "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcQ_roUCfAO8PBWPLvOM-DrYsUboxcf3tgMobBtqKqviYGRIiwpy0AW5BNBfDOe4JbKcjMFT8zsgA5bQcFU", commentsNbr: 1000, likesNbr: 1000 },
        { id: 2, user: "Skeuuuuuuuuure", title: "Regardez mon bison, elle est trop belle", time: "il y a 20 années", img: "https://images.unsplash.com/photo-1513735539099-cf6e5d559d82?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFub3JhbWF8ZW58MHx8MHx8fDA%3D&w=1000&q=80", commentsNbr: 1000, likesNbr: 1000 },
        { id: 3, user: "Arcyrr", title: "J'adore les castors", time: "il y a 21 années et 2 secondes", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSb0m10tc32EKEiEcwcVnEh-UavZhDTULwp2A&usqp=CAU", commentsNbr: "1M", likesNbr: "1M" }
    ];
    const user = "Mr Poulpe";
    const listItems = posts.map((post) => <ListItem key={post.id} post={post}/>);

    return (
        <div className="Feed">
            <div className="header">
                <IoIosChatbubbles className="icon cursor-pointer"/>
                <h1>Dernières publications</h1>
                <div className="username cursor-pointer">{ user }</div>
            </div>
            <div className="body">
                <div className="new-post"><div className="cursor-pointer"><MdOutlineAddBox/> <h3>Nouveau post</h3></div></div>
                <ul>{ listItems }</ul>
            </div>
        </div>
    );
}

export default Feed;