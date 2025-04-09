const getAboutPage = (req, res) => {
    res.render("about", {
        title: "About WanderMind",
        description: "WanderMind is an AI-powered smart travel planner that helps you create personalized travel itineraries, find the best places to visit, and manage your trip seamlessly.",
        features: [
            "AI-Powered Itinerary",
            "Smart Budgeting",
            "Real-Time Weather & Alerts",
            "Interactive Maps",
            "Collaboration",
            "AI Travel Chatbot",
        ],
    });
};

module.exports = { getAboutPage };
