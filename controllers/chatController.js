const fetch = require('node-fetch');
require('dotenv').config();

const chatController = async (req, res) => {
    const { stressLevel, meditationTime } = req.body;

    if (!stressLevel || !meditationTime) {
        return res.render('index', {
            response: '❌ Please fill in all fields.',
            user: req.session.user || null,
        });
    }

    if (isNaN(stressLevel) || stressLevel < 1 || stressLevel > 10) {
        return res.render('index', {
            response: '⚠️ Please enter a valid stress level between 1 and 10.',
            user: req.session.user || null,
        });
    }

    const apiKey = process.env.RAPIDAPI_KEY;
    if (!apiKey) {
        return res.render('index', {
            response: '🚨 Server configuration issue. Please try again later.',
            user: req.session.user || null,
        });
    }

    const url = 'https://chatgpt4-ai-chatbot.p.rapidapi.com/ask';
    const query = `Give me meditation tips for a person feeling ${stressLevel}/10 stressed in the ${meditationTime}, and provide a week-long meditation plan with exactly 7 days.`;

    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'chatgpt4-ai-chatbot.p.rapidapi.com',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            console.error(`🚨 API Error: ${response.status} - ${response.statusText}`);
            return res.render('index', {
                response: '⚠️ Failed to get a response from the AI. Please try again later.',
                user: req.session.user || null,
            });
        }

        const result = await response.json();
        console.log("🔹 API Response:", result);

        let responseMessage = result.response || result.result || "⚠️ No response from the AI.";

        // Extract meditation plan
        const planLines = responseMessage.split('\n').filter(line => line.startsWith('Day '));

        // Format into table rows (limit to 7 days)
        const formattedPlan = planLines.slice(0, 7).map(day => {
            const parts = day.split(':');
            return `<tr><td class="font-semibold">${parts[0]}</td><td>${parts.slice(1).join(':')}</td></tr>`;
        }).join('');

        res.render('result', {
            stressLevel,
            meditationTime,
            meditationPlan: formattedPlan
        });

    } catch (error) {
        console.error("❌ Fetch Error:", error);
        res.render('index', {
            response: '🚨 Error processing your request. Please try again later.',
            user: req.session.user || null,
        });
    }
};

module.exports = { chatController };
