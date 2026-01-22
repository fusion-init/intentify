import fetch from 'node-fetch';

async function checkHealth() {
    const url = 'http://localhost:3001/intentify/health';
    console.log(`Checking Health: ${url}`);

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            console.log("✅ Backend is UP and Healthy!");
            console.log(JSON.stringify(data, null, 2));
        } else {
            console.log(`❌ Backend reachable but returned status: ${response.status}`);
        }
    } catch (error: any) {
        if (error.code === 'ECONNREFUSED') {
            console.error("❌ Backend still unreachable on port 3001. Did you verify the .env password and restart the server?");
        } else {
            console.error(`❌ Connection Error: ${error.message}`);
        }
    }
}

checkHealth();
