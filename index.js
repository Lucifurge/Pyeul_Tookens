document.addEventListener("DOMContentLoaded", () => {
    // Lock feature: Prompt for username and password
    const lockScreen = () => {
        const credentials = [
            { username: "mariz", password: "mariz2006" },
            { username: "lucifurge", password: "09100909" },
              { username: "james cruz", password: "spamshares" },
        // 36 blank entries for additional usernames and passwords
            ...Array(35).fill({ username: "", password: "" })
        ];

        Swal.fire({
            title: "Login Required",
            html: `
                <div class="mb-3">
                    <label for="lockUsername" class="form-label">Username</label>
                    <input type="text" id="lockUsername" class="form-control" placeholder="Enter Username">
                </div>
                <div class="mb-3">
                    <label for="lockPassword" class="form-label">Password</label>
                    <input type="password" id="lockPassword" class="form-control" placeholder="Enter Password">
                    <div class="mt-2">
                        <input type="checkbox" id="toggleLockPassword" class="form-check-input">
                        <label for="toggleLockPassword" class="form-check-label">Show Password</label>
                    </div>
                </div>
            `,
            confirmButtonText: "Login",
            allowOutsideClick: false,
            preConfirm: () => {
                const username = document.getElementById("lockUsername").value.trim();
                const password = document.getElementById("lockPassword").value.trim();

                const valid = credentials.some(
                    (cred) => cred.username === username && cred.password === password
                );

                if (valid) {
                    return true;
                } else {
                    Swal.showValidationMessage("Invalid username or password");
                    return false;
                }
            },
        });

        // Toggle password visibility
        document.addEventListener("change", (e) => {
            if (e.target && e.target.id === "toggleLockPassword") {
                const passwordField = document.getElementById("lockPassword");
                passwordField.type = e.target.checked ? "text" : "password";
            }
        });
    };

    lockScreen();

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
            const response = await fetch("https://pyeultookenapi-production.up.railway.app/get_token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
                mode: "cors",  // Ensure cross-origin request works
            });

            const data = await response.json();

            if (response.ok && data.token) {  // Fixed the token reference
                resultContainer.innerHTML = `
                    <strong>Token:</strong> <br>
                    <textarea id="tokenField" readonly style="width: 100%; height: 60px;">${data.token}</textarea>
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
