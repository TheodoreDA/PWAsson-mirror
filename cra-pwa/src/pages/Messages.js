import { IoMdArrowBack, IoIosAdd } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { BiWifi, BiWifiOff } from "react-icons/bi";
import './Messages.css';
import { Link } from "react-router-dom";
import React from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

class SideNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedConv: 0,
            isCreatingChat: false,
            value: "",
            fetchedUsers: [],
        };
        this.getUsers();
      }

    changeConversation(index) {
        this.setState({selectedConv: index});
        this.props.onSelected(index);
    }

    async getUsers() {
        axios.get(process.env.REACT_APP_API + `/user`).then(res => this.setState({ fetchedUsers: res.data }));
    }

    async onCreateNewChat() {
        this.setState({isCreatingChat: false, value: ""});
        const foundUser = this.state.fetchedUsers.find(u => u.username === this.state.value);
        if (!foundUser) {
            alert('Utilisateur introuvable');
            return;
        }
        await axios.post(process.env.REACT_APP_API + `/chat`, { usersUid: [foundUser.uid] }, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            }
        });
    }

    render() {
        return (
            <aside>
                <div>
                    <div><Link to="/feed" className="return-cursor"><IoMdArrowBack className="icon" />Retour</Link></div>
                    { navigator.onLine ? <span>En ligne <BiWifi /></span> : <span>Hors ligne <BiWifiOff /></span> }
                </div>
                <p style={{ marginLeft: '1em' }}>{ this.props.isLoading ? "Chargement de vos messages..." : null }</p>
                <nav><ul>
                    {this.props.conversations.map((item, index) => <li key={"nav-item-" + index} onClick={() => this.changeConversation(index)} className={"cursor-pointer " + (this.state.selectedConv === index ? "selected" : "")}>
                        <div><p>{item.otherUserName}</p><p>{item.messages[0]?.formattedDate}</p></div>
                        <p>{item.messages.length > 0 ? item.messages[0].content : "Aucun message"}</p>
                    </li>)}
                </ul></nav>
                <button className="cursor-pointer" onClick={ this.state.isCreatingChat === false ? () => this.setState({isCreatingChat: true}) : null }><IoIosAdd />
                    { this.state.isCreatingChat ? <input
                        placeholder="Utilisateur..."
                        value={this.state.value}
                        onChange={e => this.setState({ value: e.target.value })}
                        onKeyUp={e => {
                            if (e.key === "Enter")
                                this.onCreateNewChat();
                        }}
                    /> : <h3>Nouveau message</h3> }
                </button>
            </aside>
        );
    }

}

class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            user: jwtDecode(localStorage.getItem('token')),
            content: null,
        }
    }
    componentDidMount() {
        this.setState({ content: this.props.conversations[this.props.contentId] });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.contentId !== this.props.contentId
            || prevProps.conversations !== this.props.conversations) this.fetchContents();
    };

    fetchContents() {
        this.setState({ content: this.props.conversations[this.props.contentId] });
    }

    async onSubmitMessage() {
        await axios.post(process.env.REACT_APP_API + `/message`, {
            chatUid: this.state.content.uid,
            content: this.state.message
        }, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            }
        });
        this.setState({ message: "" });
        this.props.fetchData();
    }

    render() {
        return <div>
            <header>
                <div>
                    <Link to="/profile" className="username cursor-pointer">{this.state.content?.otherUserName}</Link>
                </div>
            </header>
            <div className="messages-body">
                <ul>
                    {this.state.content?.messages.map((item, index) => <li key={"message-" + index} className={item.authorUid === this.state.user.uid ? "left-mess" : 'right-mess'}>{item.content}</li>)}
                </ul>
            </div>
            <div className="send-message">
                <input
                    placeholder="Mon message..."
                    value={ this.state.message }
                    onChange={e => this.setState({ message: e.target.value })}
                    onKeyUp={e => {
                        if (e.key === "Enter")
                            this.onSubmitMessage();
                    }}
                />
                <IoSend className="cursor-pointer" onClick={() => this.onSubmitMessage()} />
            </div>
        </div>
    }
}

class Messages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            conversations: [],
            selectedConv: 0,
            me: jwtDecode(localStorage.getItem('token')),
            isLoading: true,
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    async fetchData() {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            // second: 'numeric',
            // timeZoneName: 'short'
        };

        try {

            const responseChat = await axios.get(process.env.REACT_APP_API + `/chat/`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                }
            });
            var chats = [];

            for (let i = 0; i < responseChat.data.length; i++) {
                const otherUserUid = responseChat.data[i].usersUid.find(u => u.uid !== this.state.me.uid);
                const chatMessages = await axios.get(process.env.REACT_APP_API + `/message/${responseChat.data[i]?.uid}`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    }
                });
                let tmpMessageArray = [];

                const otherUser = await axios.get(process.env.REACT_APP_API + `/user/${otherUserUid}`);
                for (let i = 0; i < chatMessages.data.length; i++) {
                    let tmpMessage = {
                        authorUid: chatMessages.data[i]?.authorUid,
                        content: chatMessages.data[i]?.content,
                        sentAt: chatMessages.data[i]?.sentAt
                    };

                    const author = otherUser.data?.username;
                    Object.assign(tmpMessage, { user: author});
                    
                    const date = new Date(tmpMessage.sentAt);
                    const formattedDate = date.toLocaleString('en-US', options);
                    Object.assign(tmpMessage, { formattedDate});

                    tmpMessageArray.push(tmpMessage);
                }
                chats.push({
                    uid: responseChat.data[i]?.uid,
                    otherUserUid: otherUserUid,
                    otherUserName: otherUser.data?.username,
                    messages: tmpMessageArray
                })
            }
            this.setState({ conversations: chats, isLoading: false });
        } catch (error) {
            console.log(error);
        }
    }

    onConvSelected = (index) => this.setState({selectedConv: index});

    render() {
        return (
            <div className="Messages">
                <SideNav isLoading={this.state.isLoading} conversations={this.state.conversations} onSelected={this.onConvSelected} />
                <Content conversations={this.state.conversations} contentId={this.state.selectedConv} fetchData={() => this.fetchData()} />
            </div>
        )
    }
}

export default Messages;