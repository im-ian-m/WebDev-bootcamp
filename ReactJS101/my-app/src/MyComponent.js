import React from 'react';

class MyComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            clicks: 0
        } 
    }
    clickMe() {
        this.setState({
            clicks: this.state.clicks + 1
        })
    }

    render() {
        return (
            <div>
            <h1 onClick={() => this.clickMe()}>Welcome to {this.props.appName}</h1>
            <span>The number of clicks is {this.state.clicks}</span>
            </div>
        )
    }
}

export default MyComponent;