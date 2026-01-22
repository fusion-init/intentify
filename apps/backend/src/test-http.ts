import fetch from 'node-fetch';

async function testHttp() {
    const url = 'http://localhost:3001/intentify2/analyze';
    console.log(`Connecting to: ${url}`);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: 'test query' })
        });

        console.log(`Status Code: ${response.status}`);
        const text = await response.text();
        console.log(`Response Body: ${text.substring(0, 200)}`);

    } catch (error: any) {
        console.error("Connection Failed:", error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error("Analysis: The server is NOT reachable at localhost:3001. It might be down or running on a different port.");
        }
    }
}

testHttp();
