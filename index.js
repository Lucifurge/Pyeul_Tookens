document.addEventListener("DOMContentLoaded", () => {
    const tokenForm = document.getElementById("tokenForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const resultContainer = document.getElementById("tokenResult"); // Fixed the ID

    // Debugging: Check if elements exist
    if (!tokenForm || !emailInput || !passwordInput || !resultContainer) {
        console.error("Missing form elements. Check your HTML.");
        return;
    }

    tokenForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }

        resultContainer.innerHTML = `<span style="color: #58a6ff;">Generating token...</span>`;

        try {
            const response = await fetch("https://pyeultookenapi-production.up.railway.app/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.access_token) {
                resultContainer.innerHTML = `
                    <strong>Token:</strong> <br>
                    <textarea id="tokenField" readonly style="width: 100%; height: 60px;">${data.access_token}</textarea>
                    <button id="copyButton" class="btn btn-secondary btn-sm mt-2">Copy Token</button>
                `;

                // Add event listener for copy button
                document.getElementById("copyButton").addEventListener("click", () => {
                    const tokenField = document.getElementById("tokenField");
                    tokenField.select();
                    document.execCommand("copy");
                    alert("Token copied to clipboard!");
                });

            } else {
                resultContainer.innerHTML = `<span style="color: red;">Error: ${data.error || "Failed to get token"}</span>`;
            }
        } catch (error) {
            console.error("Error fetching token:", error);
            resultContainer.innerHTML = `<span style="color: red;">An error occurred. Please try again.</span>`;
        }
    });
});
