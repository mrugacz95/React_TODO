import React, {Component} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

class List extends Component {
    render() {
        if (this.props.tasks.length)
            return (
                <div className="container list">
                    {
                        this.props.tasks.filter((task) => this.props.showStatus === this.props.showState.ALL ?
                            true : ((this.props.showStatus === this.props.showState.IN_PROGRESS) ^ task.isDone ))
                            .map((task) => (
                                <Item task={task}/>
                            ))
                    }
                </div>
            );
        else
            return (<div className="container">Nothing to do :c</div>);
    }
}
class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
            text: this.props.task.text
        }

    }

    render() {
        if (this.state.isEditing) {
            return (
                <div className="flexContainer">
                    <input
                        value={this.state.text}
                        ref={(input) => {
                            this.nameInput = input
                        }}
                        onChange={(evt) => this.setState({text: evt.target.value})}
                        className="inputField list-group-item"/>
                    <input type="image" src={require('./edit.png')} onClick={(e) => {
                        this.setState({isEditing: false});
                        this.props.task.updateTask(this.state.text);
                    }} className="inputImage image"/>
                </div>
            );

        }
        else
            return (
                <div className={"list-group-item " + (this.props.task.isDone ? 'done' : '')}>
                    <div  onClick={() => {
                        this.props.task.setDone();
                        this.forceUpdate();
                    }}>
                    <div className="innerItem">
                        {this.props.task.isDone && <img src={require('./tick.png')} className="image"/>}
                        {this.props.task.text}
                    </div>
                    </div>
                    <img
                        src={require('./edit.png')}
                        onClick={(e) => {
                            this.setState({isEditing: true});
                        }}
                        className="image inputImage"/>
                </div>
            );
    }
}
class SelectableButton extends Component {
    render() {
        return (
            <button onClick={this.props.onClick}
                    className={(this.props.isSelected ? "btn-primary" : "btn-secondary") + " btn btn-sm"}>{this.props.text}</button>
        );
    }
}
class Task {
    isDone = false;

    constructor(text) {
        this.text = text;
        this.setDone = this.setDone.bind(this);
    }

    setDone() {
        this.isDone = !this.isDone;
    }

    updateTask(text) {
        this.text = text;
    }
}
class App extends Component {
    SHOW_STATE = {
        ALL: 1, DONE: 2, IN_PROGRESS: 3
    };

    constructor() {
        super();
        this.state = {
            tasks: [
                new Task('eldoelo'),
                new Task('ziomek')
            ],
            showStatus: this.SHOW_STATE.ALL,
            input: ''
        };
        this.insertTask = this.insertTask.bind(this);
        this.toggleShowOnlyEnabled = this.toggleShowOnlyEnabled.bind(this);
        this.removeDone = this.removeDone.bind(this);
    }

    insertTask() {
        let newTasks = this.state.tasks;
        newTasks.push(new Task(this.state.input));
        this.setState({tasks: newTasks});
    }

    toggleShowOnlyEnabled() {
        this.setState({showOnlyInProgress: !this.state.showOnlyInProgress}); //toggle
    }

    updateTask(task) {
        let stateCopy = Object.assign({}, this.state);
        stateCopy.items[task.text].upVotes += 1;
        this.setState(stateCopy);
    }

    removeDone() {
        this.setState({tasks: this.state.tasks.filter((task) => !task.isDone)});
        console.log(this.state.tasks)
    }

    render() {
        return (
            <div className="App container col-centered">
                <div className="row">
                    <div className="container App-header ">
                        <div>
                            <h2>TODOLIST</h2>
                        </div>
                        <label>New: </label>
                        <input onChange={(e) => {
                            this.setState({input: e.target.value})
                        }}/>
                        <button className="btn btn-sm btn-primary" onClick={this.insertTask}>
                            Add Item
                        </button>
                    </div>
                </div>
                <div className="row">
                    <List tasks={this.state.tasks} showStatus={this.state.showStatus} showState={this.SHOW_STATE}/>
                </div>
                <div className="col-centered">
                    <div className="buttonsDiv ">
                        <SelectableButton isSelected={this.state.showStatus === this.SHOW_STATE.ALL} text="ShowAll"
                                          onClick={() => this.setState({showStatus: this.SHOW_STATE.ALL})}/>
                        <SelectableButton isSelected={this.state.showStatus === this.SHOW_STATE.DONE}
                                          text="Show only done"
                                          onClick={() => this.setState({showStatus: this.SHOW_STATE.DONE})}/>
                        <SelectableButton isSelected={this.state.showStatus === this.SHOW_STATE.IN_PROGRESS}
                                          text="Show Only in progress"
                                          onClick={() => this.setState({showStatus: this.SHOW_STATE.IN_PROGRESS})}/>
                        <button onClick={this.removeDone} className="btn">Remove done</button>
                    </div>
                </div>
            </div>

        );
    }
}

export default App;
