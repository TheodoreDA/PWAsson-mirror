import { IoMdArrowBack, IoIosAdd } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import './Messages.css';
import { Link } from "react-router-dom";
import React from "react";

class SideNav extends React.Component {
    selectedConv = 0;

    formatNumber(number, suffix) {
        const num = Math.round(number);
        return num === 1 ? num + suffix : num + suffix + 's';
    }

    beautifyTimeSpent(date) {
        const today = new Date();
        const oneMinute = 1000 * 60;
        const oneHour = oneMinute * 60;
        const oneDay = oneHour * 24;
        const oneMonth = oneDay * 30.4167;
        const oneYear = oneDay * 365;
        const timeDifference = today.getTime() - date.getTime();
        let suffix = "";

        if (timeDifference < oneMinute) suffix = this.formatNumber(timeDifference / 1000, " seconde");
        else if (timeDifference < oneHour) suffix = this.formatNumber(timeDifference / oneMinute, " minute");
        else if (timeDifference < oneDay) suffix = this.formatNumber(timeDifference / oneHour, " heure");
        else if (timeDifference < oneMonth) suffix = this.formatNumber(timeDifference / oneDay, " jour");
        else if (timeDifference < oneYear) suffix = Math.round(timeDifference / oneMonth) + " mois";
        else suffix = this.formatNumber(timeDifference / oneYear, " an");

        return "Il y a " + suffix;
    }

    changeConversation(index) {
        this.setState(() => this.selectedConv = index);
        this.props.onSelected(index);
    }

    render() {
        return (
            <aside>
                <div><Link to="/feed" className="return-cursor"><IoMdArrowBack className="icon"/>Retour</Link></div>
                <nav><ul>
                    { this.props.conversations.map((item, index) => <li key={ "nav-item-"+index } onClick={ () => this.changeConversation(index) } className={ "cursor-pointer " + (this.selectedConv === index ? "selected" : "") }>
                        <div><p>{ item.userName }</p><p>{ this.beautifyTimeSpent(item.lastMessageTime) }</p></div>
                        <p>{ item.lastMessage }</p>
                    </li>) }
                </ul></nav>
                <button className="cursor-pointer"><IoIosAdd/><h3>Nouveau message</h3></button>
            </aside>
        );
    }
    
}

class Content extends React.Component {
    user = "Mr Poulpe";

    constructor(props) {
        super(props);
        this.state = {
            conversations: [
                { id: 1, userName: "Mr Propre", messages: [
                    { content: "L'as tu vu la belle quenouille ?", user: "Mr Propre" },
                    { content: "Oui j'ai vu. Mais Lorem ipsum dolor sit amet", user: "Mr Poulpe" },
                ]},
                { id: 2, userName: "Ashmoore", messages: [
                    { content: "Hello ! Comment vas-tu ?", user: "Ashmoore" },
                    { content: "Salo", user: "Mr Poulpe" }
                ]},
                { id: 3, userName: "Skeure", messages: [
                    { content: "Montpellier < Nantes", user: "Skeure" }
                ]},
            ],
            content: null,
            message: "",
        };
    }

    componentDidMount() {
        this.setState({ content: this.state.conversations[this.props.contentId] });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.contentId !== this.props.contentId) this.fetchContents();
    };

    fetchContents() {
        this.setState({content: this.state.conversations[this.props.contentId]});
    }

    onSubmitMessage() {
        let newContent = { ...this.state.content };

        newContent.messages.push({ content: this.state.message, user: "Mr Poulpe" });
        this.setState({
            content: newContent,
            message: "",
        });
    }

    render() {
        return <div>
            <header>
                <h3 className="username cursor-pointer">{ this.user }</h3>
                { this.state.content != null ? <h1>{ this.state.content.userName }</h1> : <div/> }
            </header>
            <div className="messages-body">
                <ul>
                    { this.state.content?.messages.map((item, index) => <li key={ "message-"+index } className={ item.user === this.user ? "left-mess" : 'right-mess' }>{ item.content }</li>) }
                </ul>
            </div>
            <div className="send-message">
                <input
                    placeholder="Mon message..."
                    value={ this.state.message }
                    onChange={ e => this.setState({ message: e.target.value }) }
                    onKeyUp={ e => {
                        if (e.key === "Enter")
                            this.onSubmitMessage();
                    } }
                />
                <IoSend className="cursor-pointer" onClick={ () => this.onSubmitMessage() }/>
            </div>
        </div>
    }
}

class Messages extends React.Component {
    conversations = [
        { userId: 1, userName: "Mr Propre", lastMessage: "Oui j'ai vu. Mais Lorem ipsum dolor sit amet", lastMessageTime: new Date(2023, 9, 5, 11, 0, 0) },
        { userId: 2, userName: "Ashmoore", lastMessage: "Salo", lastMessageTime: new Date(2008, 9, 5) },
        { userId: 3, userName: "Skeure", lastMessage: "Montpellier < Nantes", lastMessageTime: new Date(2007, 9, 5) },
    ];
    selectedConv = 0;

    onConvSelected = (index) => this.setState(() => this.selectedConv = index);

    render() {
        return <div className="Messages">
            <SideNav conversations={ this.conversations } onSelected={ this.onConvSelected } />
            <Content contentId={ this.selectedConv }/>
        </div>
    }
}

export default Messages;