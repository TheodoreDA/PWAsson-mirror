import { IoIosChatbubbles } from "react-icons/io";
import { MdOutlineAddBox } from "react-icons/md";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { BiSolidCommentDetail } from "react-icons/bi";
import { FaHeart } from "react-icons/fa";
import './Feed.css';
import { Link } from "react-router-dom";

function ListItem(props) {
    return <li className="cursor-pointer">
        <p>{props.post.user}</p>
        <p>{props.post.title}</p>
        <img src={`data:image/png;base64,${props.post.image}`} alt="helloworld" />
        <p className="time">{props.post.description}</p>
        <div className="social">
            {/* <div><BiSolidCommentDetail /> {props.post.commentsNbr}</div> */}
            <div><FaHeart /> {props.post.likes}</div>
        </div>
    </li>;
}

function Feed() {
    const [postArray, setPostArray] = useState([]);
    const [username, setUsername] = useState();
    const token = localStorage.getItem("token");
    const jwtToken = jwtDecode(token)
    const userId = jwtToken.uid;

    useEffect(() => {
        async function fetchData() {
            const responseUsername = await axios.get(`http://localhost:8080/user/${userId}`);
            setUsername(responseUsername.data?.username);
            localStorage.setItem("username", responseUsername.data?.username);
            const response = await axios.get(`http://localhost:8080/publication`);
            let tmpPostArray = [];
            for (let i = 0; i < response.data.length; i++) {
                let tmp = {};
                Object.assign(tmp,
                    {
                        title: response.data[i]?.title,
                        description: response.data[i]?.description,
                        author: response.data[i]?.author,
                        pictureUid: response.data[i]?.pictureUid,
                        likes: response.data[i]?.likes,
                    });
                const responsePircture = await axios.get(`http://localhost:8080/publication/picture/${tmp.pictureUid}`);
                const base64String = btoa(String.fromCharCode(...new Uint8Array(responsePircture.data?.data)));
                console.log(responsePircture.data?.data);
                Object.assign(tmp, { image: base64String });
                const responseUser = await axios.get(`http://localhost:8080/user/${tmp.author}`);
                const author = responseUser.data?.username;
                Object.assign(tmp, { user: author });
                tmpPostArray.push(tmp);
            }
            setPostArray(tmpPostArray);
        }
        fetchData();
        console.log(postArray);
    }, [])

    const listItems = postArray.map((post) => <ListItem key={post.id} post={post} />);

    return (
        <div className="Feed">
            <div className="header">
                <Link to="/messages"><IoIosChatbubbles className="icon cursor-pointer" /></Link>
                <h1>Dernières publications</h1>
                <Link to="/profile" className="username cursor-pointer">{localStorage.getItem("username") ? localStorage.getItem("username") : username}</Link>
            </div>
            <div className="body">
                <Link to="/newpost" className="new-post cursor-pointer"><MdOutlineAddBox /><h3>Nouveau post</h3></Link>
                <ul>{listItems}</ul>
            </div>
        </div>
    );
}

export default Feed;