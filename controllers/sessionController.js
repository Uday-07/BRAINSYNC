exports.getSessionPage = (req, res) => {
    const { time } = req.query;
    const sessionTime = time ? time.charAt(0).toUpperCase() + time.slice(1) : 'Meditation';
    res.render('session', { sessionTime });
};
