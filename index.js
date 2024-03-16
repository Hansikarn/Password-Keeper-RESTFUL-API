// Function to handle form submission
function handleFormSubmit(event) {
    event.preventDefault();

    const websiteInput = document.getElementById("website");
    const passwordInput = document.getElementById("password");

    const website = websiteInput.value.trim();
    const password = passwordInput.value.trim();

    if (!website || !password) {
        alert("Please enter both website and password.");
        return;
    }

    const userDetails = {
        website: website,
        password: password,
    };

    axios.post("https://crudcrud.com/api/8973f93f0fb44885ad5d96467487be17/password", userDetails) // corrected endpoint URL
        .then((response) => {
            const newUserDetails = response.data;
            alert("Password saved successfully");
            displayUserOnScreen(newUserDetails);
            updatePasswordCount(1); // Increment password count
            clearInputFields(); // Clear input fields after successful submission
        })
        .catch((error) => {
            console.error(error);
            alert("Some error occurred. Please try again.");
        });
}

// Function to display user on screen
function displayUserOnScreen(userDetails) {
    const passwordDisplay = document.getElementById("allpswd");
    const newLi = document.createElement("li");
    newLi.innerHTML = `${userDetails.website}-${userDetails.password} <button class="delete-btn">Delete</button> <button class="edit-btn">Edit</button>`;
    passwordDisplay.appendChild(newLi);

    const deleteBtn = newLi.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", function () {
        axios.delete(`https://crudcrud.com/api/8973f93f0fb44885ad5d96467487be17/password/${userDetails._id}`)
            .then(() => {
                newLi.remove();
                updatePasswordCount(-1); // Decrement password count
                alert("Password deleted successfully");
            })
            .catch((error) => {
                console.error(error);
                alert("Error deleting password");
            });
    });

    // Event listener for edit button
    const editBtn = newLi.querySelector(".edit-btn");
    editBtn.addEventListener("click", function () {
        document.getElementById("website").value = userDetails.website;
        document.getElementById("password").value = userDetails.password;
        newLi.remove(); // Remove the password entry from the list during editing
    });
}

// Function to update password count
let currentCount = 0; // Initialize current count

function updatePasswordCount(count) {
    currentCount += count; // Update current count
    const passwordCount = document.getElementById("passwordcount");
    passwordCount.innerHTML = `<li style="margin: 20px;">Total Passwords: ${currentCount}</li>`;
}

// Function to clear input fields
function clearInputFields() {
    document.getElementById("website").value = "";
    document.getElementById("password").value = "";
}

// Load passwords on page load
window.addEventListener("DOMContentLoaded", () => {
    axios.get("https://crudcrud.com/api/8973f93f0fb44885ad5d96467487be17/password")
        .then((response) => {
            const passwordCount = response.data.length;
            updatePasswordCount(passwordCount); // Update password count with initial count

            response.data.forEach((userDetails) => {
                displayUserOnScreen(userDetails);
            });
        })
        .catch((error) => {
            console.error(error);
            alert("Error in fetching passwords");
        });

    // Add event listener for form submission
    document.getElementById("passwords").addEventListener("submit", handleFormSubmit);

    // Search filter functionality
    document.getElementById("search").addEventListener("keyup", function (event) {
        const searchTerm = event.target.value.trim().toLowerCase();
        const listItems = document.querySelectorAll("#allpswd li");
        listItems.forEach((item) => {
            const titleText = item.textContent.trim().toLowerCase();
            if (titleText.includes(searchTerm)) {
                item.style.display = "flex";
            } else {
                item.style.display = "none";
            }
        });
    });
});
