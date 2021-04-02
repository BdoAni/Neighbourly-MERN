import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {
    FormControl,
    InputLabel,
    OutlinedInput,
    Checkbox,
    Select,
    TextField
} from '@material-ui/core';

const styles = {
    paper: {
        width: "12rem", padding: "1rem", display: "inline-block", verticalAlign: 'text-top'
    },
    input: {
        marginBottom: "1rem"
    },
    button: {
        width: "50%"
    }
}

const useStyles = makeStyles({
    root: {
      minWidth: 275,
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
  });

const Chat = props => {
    const { id } = props;
    const classes = useStyles();
    // const bull = <span className={classes.bullet}>•</span>;
    const [socket] = useState(() => io(':8000'));
    const [message, setMessage] = useState('');
    const [typingStatus, setTypingStatus] = useState('');
    const [messages, setMessages] = useState([]);
    const [room, setRoom] = useState(id);
    const [user, setUser] = useState('');
    const [startChat, setStartChat] = useState(false);

    useEffect(() => {
        return () => socket.disconnect(true);
    }, [])
  
    socket.on('messageSent', data => {
      setMessages([...messages, data]);
      setTypingStatus('');
    })
  
    socket.on('clientTyping', data => {
      setTypingStatus(data.message);
    })
  
    const submitHandler = e => {
      e.preventDefault();
      
      socket.emit('sendMessage', { room, user, message });
      setMessages([...messages, { room, user, message }])
      setTypingStatus('');
      setMessage('');
    }
  
    const typingHandler = e => {
      setMessage(e.target.value);
      socket.emit('clientTyping', { room, message: `${user} is typing...`});
    }
  
    const joinRoom = () => {
        socket.emit('joinroom', room);
        setStartChat(true);
    }
    return (
        <>
        {startChat ? 
        <>
        <Card className={classes.root} variant="outlined">
            <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                {typingStatus}
                </Typography>
                <div>
                {
                    messages.map( (item, i) => 
                    <Typography variant="body2" component="p" key={i}>{item.user}: {item.message}</Typography>
                    )
                }
            </div>
                {/* {
                    messages.map( (item, i) => { 
                        <div key={i}>
                        <Typography className={classes.pos} color="textSecondary">
                        {item.username}:
                        </Typography>
                        <Typography variant="body2" component="p">{item.message}</Typography>
                        </div>
                    })
                } */}
            </CardContent>
        <CardActions>
        </CardActions>
        <div elevation={1} style={styles.paper}>
        </div>
    </Card>
        <form onSubmit={submitHandler}>
            <FormControl variant="outlined" onSubmit={ submitHandler} style={styles.input}>
                <TextField id="outlined-basic" label="Message" variant="outlined" type="text" name="message" onChange={typingHandler} value={message}/>
                <Button type="submit" variant="contained" color="primary">
                    Send
                </Button>
            </FormControl>
        </form>
        </>
        :
        <FormControl>
            <OutlinedInput type="text" name="user" onChange={e => setUser(e.target.value) } placeholder="username"/>
            <Button onClick={ joinRoom } variant="contained" color="primary">
                        Start Chat
            </Button>
        </FormControl>
        }
        {/* <input type="text" name="username" onChange={e => setUsername(e.target.value) } placeholder="username"/>
        <form onSubmit={ submitHandler }>
        <p>{typingStatus}</p>
                <input type="text" name="message" onChange={ typingHandler } value={ message }/>
                <input type="submit" value="Send"/>
            </form> */}
            {/* <div>
                {
                    messages.map( (item, i) => 
                        <p key={i}>{item.username}: {item.message}</p>
                    )
                }
            </div> */}
            {/* <div>
            <input type="text" name="user" onChange={e => setUser(e.target.value) } placeholder="username"/>
            <input type="text" name="room" placeholder="roomname" onChange={ e => setRoom(e.target.value) }/>
            <button onClick={ joinRoom }>Join Room</button>

            <form onSubmit={submitHandler}>
                <p>{typingStatus}</p>
                <input type="text" name="message" onChange={ typingHandler } value={message}/>
                <br/>
                <input type="submit" value="Submit"/>
            </form> 
        </div> */}
        </>
    );
}

export default Chat