// using built-in fetch

// Using built-in fetch if Node version supports it (Node 20 does)
// If not, I'll use http.

async function testRegister() {
    const payload = {
        name: "parva patel",
        email: "parva972008@gmail.com",
        password: "password123",
        role: "junior",
        college: "svnit",
        department: "Mechanical",
        year: "3 rd year",
        mobile: "6351068503",
        interests: ["finance", "coding"],
        goals: "student"
    };

    try {
        console.log("Sending request to http://localhost:5000/api/auth/register");
        const res = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Response:", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

testRegister();
