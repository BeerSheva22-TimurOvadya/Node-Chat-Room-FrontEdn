type Message = {
    _id?: any,
    from: string,
    to: string,
    text: string,
    timestamp: Date,
    read?: boolean
}
export default Message;