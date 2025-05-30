const Client = require("../db/models/client");


exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find()
      .populate("userId", "-password")
      .populate("bookings");
    res.status(200).json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate("userId", "-password")
      .populate("bookings");
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }
    res.status(200).json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateClient = async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedClient) {
      return res.status(404).json({ error: "Client not found" });
    }
    res.status(200).json(updatedClient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.deleteClient = async (req, res) => {
  try {
    const deletedClient = await Client.findByIdAndDelete(req.params.id);
    if (!deletedClient) {
      return res.status(404).json({ error: "Client not found" });
    }
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
