const expressAsyncHandler = require("express-async-handler");
const Message = require("../model/message");
const { convertDate, capitalize } = require("./util");

const createMessage = expressAsyncHandler(async (req, res) => {
  const { title, message } = req.body;
  const { id } = req.user;
  const newMsg = { author: id, title, message };
  await Message.create(newMsg);
  res.redirect("/");
});

const getMessages = expressAsyncHandler(async () => {
  const messages = await Message.find().populate("author", { username: 1 });
  const modifiedDateMessages = messages.map((obj) => ({
    id: obj.id,
    title: obj.title,
    message: obj.message,
    author: capitalize(obj.author.username),
    timestamp: convertDate(obj.timestamp),
  }));
  return modifiedDateMessages;
});

const deleteMessage = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  await Message.deleteOne({ _id: id });
  res.redirect("/");
});

module.exports = { createMessage, getMessages, deleteMessage };
