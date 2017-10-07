import * as React from "react";

interface IChatWindowState {message: string};
interface IChatWindowProps {onMessageSend: (message: string) => void};

export class ChatWindow extends React.Component<IChatWindowProps, IChatWindowState> {
    constructor(props: any) {
        super(props);

        this.state = {
            message: ""
        };
    }

    render() {
        return <div id="chat-container">
            <input type="text" placeholder="Type a message." 
                value={this.state.message} 
                onKeyDown={this.handleMessageOnKeydown.bind(this)}
                onChange={this.handleMessageOnChange.bind(this)}/>
            <div className="send-icon" onClick={this.handleOnSend.bind(this)}></div>
        </div>
    }

    private handleOnSend() {
        this.props.onMessageSend(this.state.message);

        this.setState({message: ""});
    }

    private handleMessageOnChange(event: any) {
        this.setState({message: event.target.value})
    }

    private handleMessageOnKeydown(event: any) {
        // If Enter was pressed, treat this as a send.
        if (event.keyCode == 13) {
            event.preventDefault();
            this.handleOnSend();
        }
    }
}