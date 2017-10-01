import * as React from "react";

const windowStyle : object = {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: "85%",
    borderTop: "1px solid #AAA",
    padding: 10
}

const textBoxStyle : object = {
    resize: "none",
    borderRadius: 4,
    border: "none",
    outline: "1px solid #AAA",
    width: "95%",
    height: "100%",
    fontSize: "1em"
}

const textBoxContainerStyle : object = {
    display: "inline-block",
    width: "80%",
    height: "100%"
}

const buttonContainerStyle : object = {
    display: "inline-block",
    width: "20%",
    height: "100%",
    verticalAlign: "top"
}

const buttonStyle : object = {
    verticalAlign: "top",
    backgroundColor: "#425BBD",
    color: "#FFF",
    border: "none",
    borderRadius: 4,
    width: "100%",
    height: "100%",
    fontSize: "1em"

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
            <div style={textBoxContainerStyle}>
                <textarea style={textBoxStyle} 
                    value={this.state.message} 
                    onKeyDown={this.handleMessageOnKeydown.bind(this)}
                    onChange={this.handleMessageOnChange.bind(this)}></textarea>
            </div>
            <div style={buttonContainerStyle}>
                <button style={buttonStyle} onClick={this.handleOnSend.bind(this)}>Send</button>
            </div>
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