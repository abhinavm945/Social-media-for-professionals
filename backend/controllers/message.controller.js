//message controller

import { Converstation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.id;
    const { message } = req.body;

    let conversation = await Converstation.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    // establish the converstaion if not started yet
    if (!conversation) {
      conversation = await Converstation.create({
        participants: [senderId, receiverId],
      });
    }
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });
    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }
    await Promise.all([conversation.save(), newMessage.save()]);
    //implement socket io for real time data transfer

    return res.status(201).json({
      message: "message send successfully",
      success: true,
      newMessage,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.id;
    const converstaion = await Converstation.find({
      participants: { $all: [senderId, receiverId] },
    });
    if (!converstaion) {
      return res.status(200).json({
        success: true,
        messages: [],
      });
    }

    return res.status(200).json({
      success: true,
      messages: converstaion.messages,
    });
  } catch (error) {
    console.log(error);
  }
};
