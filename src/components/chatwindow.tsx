import * as React from "react";

const windowStyle : object = {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    borderTop: "1px solid #AAA",
    padding: 10
}

const textBoxStyle : object = {
    height: "100%",
    width: "80%",
    borderColor: "#AAA",
    resize: "none"
}

const buttonStyle : object = {
    height: "100%",
    width: "14%",
    marginLeft: 10,
    verticalAlign: "top",
    backgroundColor: "#425BBD",
    color: "#FFF",
    borderColor: "#FFF",
    borderRadius: 4

}

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
        return <div style={windowStyle}>
            <textarea style={textBoxStyle} 
                value={this.state.message} 
                onKeyDown={this.handleMessageOnKeydown.bind(this)}
                onChange={this.handleMessageOnChange.bind(this)}></textarea>
            <button style={buttonStyle} onClick={this.handleOnSend.bind(this)}>Send</button>
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