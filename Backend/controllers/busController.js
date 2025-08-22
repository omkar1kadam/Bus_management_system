const Bus = require('../models/Bus');
const Route = require('../models/Route');
const User = require('../models/User');

// ----- BUS APIs -----

// Add new bus
exports.addBus = async (req, res) => {
    try {
        const { busNumber, capacity, route, driverId } = req.body;

        let bus = await Bus.findOne({ busNumber });
        if (bus) return res.status(400).json({ message: 'Bus already exists' });

        bus = new Bus({ busNumber, capacity, route, driverId });
        await bus.save();

        res.status(201).json({ message: 'Bus added successfully', bus });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update bus
exports.updateBus = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const bus = await Bus.findById(id);
        if (!bus) return res.status(404).json({ message: 'Bus not found' });

        Object.assign(bus, updates);
        await bus.save();

        res.json({ message: 'Bus updated successfully', bus });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete bus
exports.deleteBus = async (req, res) => {
    try {
        const { id } = req.params;

        const bus = await Bus.findById(id);
        if (!bus) return res.status(404).json({ message: 'Bus not found' });

        await bus.remove();
        res.json({ message: 'Bus deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all buses
exports.getAllBuses = async (req, res) => {
    try {
        const buses = await Bus.find().populate('driverId', 'name email');
        res.json(buses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ----- ROUTE APIs -----

// Add route
exports.addRoute = async (req, res) => {
    try {
        const { name, stops, startTime, endTime } = req.body;

        let route = await Route.findOne({ name });
        if (route) return res.status(400).json({ message: 'Route already exists' });

        route = new Route({ name, stops, startTime, endTime });
        await route.save();

        res.status(201).json({ message: 'Route added successfully', route });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update route
exports.updateRoute = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const route = await Route.findById(id);
        if (!route) return res.status(404).json({ message: 'Route not found' });

        Object.assign(route, updates);
        await route.save();

        res.json({ message: 'Route updated successfully', route });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete route
exports.deleteRoute = async (req, res) => {
    try {
        const { id } = req.params;

        const route = await Route.findById(id);
        if (!route) return res.status(404).json({ message: 'Route not found' });

        await route.remove();
        res.json({ message: 'Route deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all routes
exports.getAllRoutes = async (req, res) => {
    try {
        const routes = await Route.find();
        res.json(routes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
