const express = require('express')
const Tracker = require('../models/tracker')
const auth = require('../middleware/auth')
const router = new express.Router()
const { trackerAllowedUpdates } = require('../utils/updates-utils')

// Create tracker
router.post('/trackers', auth, async (req, res) => {
    const bmi = req.body.weightInKg / Math.pow(req.body.heightInCm, 2)
    const weightGoal = `Between ${18.5 * Math.pow(req.body.heightInCm, 2)}KG to ${25 * Math.pow(req.body.heightInCm, 2)}KG`

    const tracker = new Tracker({
        ...req.body,
        bmi,
        weightGoal,
        owner: req.user._id
    })

    try {
        await tracker.save()
        res.status(201).send({ tracker, bmi, weightGoal })
    } catch (e) {
        res.status(400).send(e)
    }
})

// Get all trackers
router.get('/trackers', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.weightInKg) {
        match.weightInKg = req.query.weightInKg
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'trackers',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.trackers)
    } catch (e) {
        res.status(500).send(e)
    }
})

// Get tracker by ID
router.get('/trackers/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        
        const tracker = await Tracker.findOne({ _id, owner: req.user._id })

        if (!tracker) {
            return res.status(404).send({ error: 'Tracker was not found!' })
        }

        res.send(tracker)
    } catch (e) {
        res.status(500).send(e)
    }
})

// Update tracker
router.patch('/trackers/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = trackerAllowedUpdates
    const isValidOperation = updates.every((update) => allowedUpdates.includes((update)))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const tracker = await Tracker.findOne({ _id: req.params.id, owner: req.user._id })

        if (!tracker) {
            res.status(404).send({ error: 'Tracker was not found!' })
        }

        updates.forEach((update) => tracker[update] = req.body[update])
        await tracker.save()
        res.send(tracker)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Delete tracker
router.delete('/trackers/:id', auth, async (req, res) => {
    try {
        const tracker = await Tracker.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!tracker) {
            return res.status(404).send({ error: 'Tracker was not found!' })
        }

        res.send(tracker)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router