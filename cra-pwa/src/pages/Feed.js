import { IoIosChatbubbles } from "react-icons/io";
import { MdOutlineAddBox } from "react-icons/md";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { BiSolidCommentDetail, BiWifi, BiWifiOff } from "react-icons/bi";
import { FaHeart } from "react-icons/fa";
import './Feed.css';
import { Link } from "react-router-dom";


function ListItem(props) {
    const [clicked, setClicked] = useState(false);
    const [likeNumber, setLikeNumber] = useState(props.post.likesUid.length);
    const [commentsNumber, setCommentsNumber] = useState(0);

    useEffect(() => {
        setClicked(isLiked());

        const getCommentsNumber = async () => {
            const response = await axios.get(`http://localhost:8080/comment/${props.post.uid}`);
            setCommentsNumber(response.data.length);
        }
        getCommentsNumber();
    }, [])

    const isLiked = () => {
        const token = localStorage.getItem("token");
        const jwtToken = jwtDecode(token)
        const userId = jwtToken.uid;

        return props.post.likesUid.includes(userId);
    }

    async function handleClick(feedUid) {
        try {
            await axios.patch(`http://localhost:8080/publication/like_unlike/${feedUid}`, {}, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                }
            });
            setClicked(!clicked);
            if (clicked) {
                setLikeNumber(likeNumber - 1);
            } else {
                setLikeNumber(likeNumber + 1);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    return <li className="cursor-pointer" key={props.post.uid}>
        <p>{props.post.user}</p>
        <p>{props.post.title}</p>
        <img src={`data:image/png;base64,${props.post.image}`} alt="helloworld" />
        <p className="time">{props.post.description}</p>
        <div className="social">
            <p>{ likeNumber }</p>
            <div>
                <FaHeart style={{color: clicked ? 'red' : 'white'}} onClick={() => handleClick(props.post.uid)} /> {props.post.likes}
            </div>
            <Link to={"/post?id=" + props.post.uid} className="linkComment"><BiSolidCommentDetail /></Link>
            <p>{ commentsNumber }</p>
        </div>
    </li>;
}

function Feed() {
    const [postArray, setPostArray] = useState([]);
    const [username, setUsername] = useState();
    const [isFetching, setIsFetching] = useState(true);
    const token = localStorage.getItem("token");
    const jwtToken = jwtDecode(token)
    const userId = jwtToken.uid;

    useEffect(() => {
        async function fetchData() {
            try {
                if (localStorage.getItem("username")) {
                    const responseUsername = await axios.get(`http://localhost:8080/user/${userId}`);
                    setUsername(responseUsername.data?.username);
                    localStorage.setItem("username", responseUsername.data?.username);
                }
                const response = await axios.get(`http://localhost:8080/publication`);
                let tmpPostArray = [];
                for (let i = 0; i < response.data.length; i++) {
                    let tmp = {};
                    Object.assign(tmp,
                        {
                            uid: response.data[i]?.uid,
                            title: response.data[i]?.title,
                            description: response.data[i]?.description,
                            authorUid: response.data[i]?.authorUid,
                            pictureUid: response.data[i]?.pictureUid,
                            likesUid: response.data[i]?.likesUid
                        });
                    const responsePircture = await axios.get(`http://localhost:8080/publication/picture/${tmp.pictureUid}`);
                    const base64String = btoa(String.fromCharCode(...new Uint8Array(responsePircture.data?.data)));
                    Object.assign(tmp, { image: base64String });
                    const responseUser = await axios.get(`http://localhost:8080/user/${tmp.authorUid}`);
                    const author = responseUser.data?.username;
                    Object.assign(tmp, { user: author });
                    tmpPostArray.push(tmp);
                }
                setPostArray(tmpPostArray.reverse());

                setIsFetching(false);
            } catch (error) {
                alert("No feed to load");
            }
        }
        fetchData();
    }, [])

    const listItems = postArray.map((post) => <ListItem key={post.uid} post={post} />);

    return (
        <div className="Feed">
            <div className="header">
                <Link to="/messages"><IoIosChatbubbles className="icon cursor-pointer" /></Link>
                <div>
                    { navigator.onLine ? <span>En ligne <BiWifi /></span> : <span>Hors ligne <BiWifiOff /></span> }
                    <h1>Dernières publications</h1>
                </div>
                <Link to="/profile" className="username cursor-pointer">{localStorage.getItem("username") ? localStorage.getItem("username") : username}</Link>
            </div>
            <div className="body">
                <Link to="/newpost" className="new-post cursor-pointer"><MdOutlineAddBox /><h3>Nouveau post</h3></Link>
                {isFetching ? <p style={{marginTop: '5em'}}>Chargement de vos publications...</p> : <ul>{listItems}</ul>}
            </div>
        </div>
    );
}

export default Feed;