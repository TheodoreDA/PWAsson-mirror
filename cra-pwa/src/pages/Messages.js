import { IoMdArrowBack, IoIosAdd } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import './Messages.css';
import { Link } from "react-router-dom";
import React from "react";
import axios from "axios";

class SideNav extends React.Component {
    selectedConv = 0;

    changeConversation(index) {
        this.setState(() => this.selectedConv = index);
        this.props.onSelected(index);
    }

    render() {
        return (
            <aside>
                <div><Link to="/feed" className="return-cursor"><IoMdArrowBack className="icon" />Retour</Link></div>
                <nav><ul>
                    {this.props.conversations.map((item, index) => <li key={"nav-item-" + index} onClick={() => this.changeConversation(index)} className={"cursor-pointer " + (this.selectedConv === index ? "selected" : "")}>
                        <div><p>{item.user}</p><p>{this.props.conversations[0].formattedDate}</p></div>
                        <p>{this.props.conversations[0].content}</p>
                    </li>)}
                </ul></nav>
                <button className="cursor-pointer"><IoIosAdd /><h3>Nouveau message</h3></button>
            </aside>
        );
    }

}

class Content extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.setState({ content: this.props.conversations[this.props.contentId] });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.contentId !== this.props.contentId) this.fetchContents();
    };

    fetchContents() {
        this.setState({ content: this.props.conversations[this.props.contentId] });
    }

    onSubmitMessage() {
        let newContent = { ...this.props.conversation.content };

        newContent.messages.push({ content: this.props.message, user: "Mr Poulpe" });
        this.setState({
            content: newContent,
            message: "",
        });
    }

    render() {
        return <div>
            <header>
                <div>
                    <Link to="/profile" className="username cursor-pointer">{"test"}</Link>
                    {/* {this.props.conversations[0].content != null ? <h1>{this.props.conversations[0].user}</h1> : <div />} */}
                </div>
            </header>
            <div className="messages-body">
                <ul>
                    {this.props.conversations.map((item, index) => <li key={"message-" + index} className={item.user === this.user ? "left-mess" : 'right-mess'}>{item.content}</li>)}
                </ul>
            </div>
            <div className="send-message">
                <input
                    placeholder="Mon message..."
                    value={this.props.conversations.map((item, index) => item.content)}
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
            chatUid: [],
            conversations: []
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
            const responseChat = await axios.get(`http://localhost:8080/chat/`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                }
            });
            let tmpChatArray = [];
            for (let i = 0; i < responseChat.data.length; i++) {
                let tmpChat = {};
                Object.assign(tmpChat,
                    {
                        chatUid: responseChat.data[i]?.uid
                    }
                );
                tmpChatArray.push(tmpChat);
                const responseMessage = await axios.get(`http://localhost:8080/message/${responseChat.data[i]?.uid}`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    }
                });
                let tmpMessageArray = [];
                for (let i = 0; i < responseMessage.data.length; i++) {
                    let tmpMessage = {};
                    Object.assign(tmpMessage,
                        {
                            authorUid: responseMessage.data[i]?.authorUid,
                            content: responseMessage.data[i]?.content,
                            sentAt: responseMessage.data[i]?.sentAt
                        })
                    const responseUser = await axios.get(`http://localhost:8080/user/${responseMessage.data[i]?.authorUid}`);
                    const author = responseUser.data?.username;
                    Object.assign(tmpMessage, { user: author});
                    const date = new Date(tmpMessage.sentAt);
                    const formattedDate = date.toLocaleString('en-US', options);
                    Object.assign(tmpMessage, { formattedDate: formattedDate});
                    tmpMessageArray.push(tmpMessage);
                }
                this.setState({ conversations: tmpMessageArray});
            }
            this.setState({ chatUid: tmpChatArray });
            console.log(this.state.conversations);
        } catch (error) {
            alert("an error occured");
        }
    }

    // conversations = [
    //     { userId: 1, userName: "Mr Propre", lastMessage: "Oui j'ai vu. Mais Lorem ipsum dolor sit amet", lastMessageTime: new Date(2023, 9, 5, 11, 0, 0) },
    //     { userId: 2, userName: "Ashmoore", lastMessage: "Salo", lastMessageTime: new Date(2008, 9, 5) },
    //     { userId: 3, userName: "Skeure", lastMessage: "Montpellier < Nantes", lastMessageTime: new Date(2007, 9, 5) },
    // ];

    selectedConv = 0;

    onConvSelected = (index) => this.setState(() => this.selectedConv = index);

    render() {

        return <div className="Messages">
            <SideNav conversations={this.state.conversations} onSelected={this.onConvSelected} />
            <Content chatUid={this.state.chatUid} conversations={this.state.conversations} contentId={this.selectedConv} />
        </div>
    }
}

export default Messages;