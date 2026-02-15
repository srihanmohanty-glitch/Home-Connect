import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Communication from '../models/Communication';
import User from '../models/User';

// @desc    Create new communication
// @route   POST /api/communications
// @access  Private/Admin
const createCommunication = asyncHandler(async (req: Request, res: Response) => {
  const { title, content, attachedPdfs } = req.body;
  const user = (req as any).user; // From protect middleware

  if (!user) {
    res.status(401);
    throw new Error('Not authorized, user not found');
  }

  const communication = new Communication({
    title,
    content,
    author: user._id,
    attachedPdfs: attachedPdfs || [],
  });

  const createdCommunication = await communication.save();
  res.status(201).json(createdCommunication);
});

// @desc    Get all communications
// @route   GET /api/communications
// @access  Private
const getCommunications = asyncHandler(async (req: Request, res: Response) => {
  const communications = await Communication.find({})
    .populate('author', 'username')
    .populate('attachedPdfs', 'title fileName filePath'); // Include filePath
  res.json(communications);
});

// @desc    Get single communication by ID
// @route   GET /api/communications/:id
// @access  Private
const getCommunicationById = asyncHandler(async (req: Request, res: Response) => {
  const communication = await Communication.findById(req.params.id)
    .populate('author', 'username')
    .populate('attachedPdfs', 'title fileName filePath'); // Include filePath

  if (communication) {
    res.json(communication);
  } else {
    res.status(404);
    throw new Error('Communication not found');
  }
});

// @desc    Update communication
// @route   PUT /api/communications/:id
// @access  Private/Admin
const updateCommunication = asyncHandler(async (req: Request, res: Response) => {
  const { title, content, attachedPdfs } = req.body;

  const communication = await Communication.findById(req.params.id);

  if (communication) {
    communication.title = title || communication.title;
    communication.content = content || communication.content;
    communication.attachedPdfs = attachedPdfs || communication.attachedPdfs;

    const updatedCommunication = await communication.save();
    res.json(updatedCommunication);
  } else {
    res.status(404);
    throw new Error('Communication not found');
  }
});

// @desc    Delete communication
// @route   DELETE /api/communications/:id
// @access  Private/Admin
const deleteCommunication = asyncHandler(async (req: Request, res: Response) => {
  const communication = await Communication.findById(req.params.id);

  if (communication) {
    await communication.deleteOne();
    res.json({ message: 'Communication removed' });
  } else {
    res.status(404);
    throw new Error('Communication not found');
  }
});

export {
  createCommunication,
  getCommunications,
  getCommunicationById,
  updateCommunication,
  deleteCommunication,
};
