import { Message } from "../models/messageModel.js"
import { Conversation } from "../models/conversationModel.js"
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id; 
    const receiverId = req.params.id;
    const { message } = req.body;
    // Validate the request body
    if (!senderId || !receiverId || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }
    let gotConversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId]}
    });
    if(!gotConversation) {
      gotConversation = await Conversation.create({
        participants: [senderId, receiverId]
      });
    }
    // Create a new message document in the database
    const newMessage = await Message.create({ sender: senderId, receiver: receiverId, message });
    if(newMessage) {
      // Add the new message to the conversation's messages array
      gotConversation.messages.push(newMessage._id);
      await gotConversation.save();
    }

    res.status(201).json({ message: "Message sent successfully", data: newMessage });
    // Catch any errors and return a 500 status code with the error message 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getMessage = async (req, res) => {
  try{
    const receiverId = req.params.id;
    const senderId = req.id
    const conversation = await Conversation.findOne({
      participants : { $all : [senderId, receiverId]}
    }).populate("messages")

    if(!conversation){
      return res.status(200).json({ messages: [] });
    }

    res.status(200).json({
      messages : conversation.messages
    })

    res.status(200).json({ messages : conversation.messages})
    console.log(conversation);
  } catch(error) {

  }
}
