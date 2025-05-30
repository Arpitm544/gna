const { Performer } = require('../db/models/performer');
const User = require('../db/models/user');

class PerformerController {
    // Get all performers
    static async getAllPerformers(req, res) {
        try {
            const performers = await Performer.find().populate('userId', 'name');
            res.status(200).json(performers);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Get performers by category
    static async getPerformersByCategory(req, res) {
        try {
            const { category } = req.params;
            const performers = await Performer.find({ category })
                .populate('userId', 'name email phone');
            res.json(performers);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching performers', error: error.message });
        }
    }

    // Get performer by ID
    static async getPerformerById(req, res) {
        try {
            const performer = await Performer.findOne({userId: req.params.id})
                .populate('userId', 'name email phone');
            if (!performer) {
                return res.status(404).json({ message: 'Performer not found' });
            }
            res.json(performer);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching performer', error: error.message });
        }
    }

    // Create performer profile
    static async createProfile(req, res) {
    try {
        const { userId } = req.params;

        // Validate userId format
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required in URL' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Only allow if user is a performer
        if (user.type !== 1) {
            return res.status(403).json({ message: 'Only performers can create performer profiles' });
        }

        // Check if profile already exists
        const existingProfile = await Performer.findOne({ userId });
        if (existingProfile) {
            return res.status(400).json({ message: 'Performer profile already exists' });
        }

        const { category, subCategory, experience, pricing } = req.body;
        if (!category || !subCategory || experience === undefined || pricing === undefined) {
            return res.status(400).json({ 
                message: 'Category, subCategory, experience, and pricing are required' 
            });
        }

        // Create new performer profile
        const profile = new Performer({
            ...req.body,
            userId
        });

        await profile.save();
        await profile.populate('userId', 'name email phone');

        res.status(201).json({
            message: 'Profile created successfully',
            profile
        });

    } catch (error) {
        console.error('Error creating profile:', error);
        res.status(500).json({ message: 'Error creating profile', error: error.message });
    }
}


    // Update performer profile
    static async updateProfile(req, res) {
        try {
            if (!req.user || !req.user.userId) {
                return res.status(401).json({ message: 'User not authenticated' });
            }

            const profile = await Performer.findOneAndUpdate(
                { userId: req.user.userId },
                req.body,
                { new: true, runValidators: true }
            ).populate('userId', 'name email phone');

            if (!profile) {
                return res.status(404).json({ message: 'Profile not found' });
            }

            res.json({
                message: 'Profile updated successfully',
                profile: profile
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error updating profile', 
                error: error.message 
            });
        }
    }

    // Get own profile
    static async getOwnProfile(req, res) {
        try {
            if (!req.user || !req.user.userId) {
                return res.status(401).json({ message: 'User not authenticated' });
            }

            const performer = await Performer.findOne({ userId: req.user.userId })
                .populate('userId', 'name email phone');
                
            if (!performer) {
                return res.status(404).json({ message: 'Profile not found' });
            }
            
            res.json(performer);
        } catch (error) {
            res.status(500).json({ 
                message: 'Error fetching profile', 
                error: error.message 
            });
        }
    }
}

module.exports = PerformerController;