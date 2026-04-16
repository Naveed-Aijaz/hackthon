// Select Forms (Works on both pages)
const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');

// --- Helper: Show Error ---
function showError(input, message) {
    const formGroup = input.parentElement;
    const small = formGroup.querySelector('small');
    formGroup.className = 'input-group error';
    small.innerText = message;
}

// --- Helper: Show Success ---
function showSuccess(input) {
    const formGroup = input.parentElement;
    formGroup.className = 'input-group success';
}

// --- Helper: Validate Email ---
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// --- Helper: Modal Control ---
const modal = document.getElementById('successModal');
const modalMsg = document.getElementById('modalMsg');

function showModal(message) {
    modalMsg.innerText = message;
    modal.style.display = 'flex';
}

function closeModal() {
    modal.style.display = 'none';
}

// ============================
// SIGNUP LOGIC (Runs only on signup.html)
// ============================
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('signupName');
        const email = document.getElementById('signupEmail');
        const password = document.getElementById('signupPassword');

        let isValid = true;

        // Name Check
        if(name.value.trim() === '') {
            showError(name, 'Name is required');
            isValid = false;
        } else {
            showSuccess(name);
        }

        // Email Check
        if(email.value.trim() === '') {
            showError(email, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'Email is not valid');
            isValid = false;
        } else {
            showSuccess(email);
        }

        // Password Check
        if(password.value.trim() === '') {
            showError(password, 'Password is required');
            isValid = false;
        } else if (password.value.length < 6) {
            showError(password, 'Password must be at least 6 chars');
            isValid = false;
        } else {
            showSuccess(password);
        }

        if(isValid) {
            // Local Storage Logic
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Check if user already exists
            const userExists = users.find(u => u.email === email.value);
            
            if(userExists) {
                showError(email, 'User already exists');
            } else {
                users.push({
                    name: name.value,
                    email: email.value,
                    password: password.value
                });
                localStorage.setItem('users', JSON.stringify(users));
                showModal('Signup Successful! Redirecting to Login...');
                signupForm.reset();
                
                // Redirect to Login after 2 seconds
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            }
        }
    });
}

// ============================
// LOGIN LOGIC (Runs only on login.html)
// ============================
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail');
        const password = document.getElementById('loginPassword');

        let isValid = true;

        if(email.value.trim() === '') {
            showError(email, 'Email is required');
            isValid = false;
        }

        if(password.value.trim() === '') {
            showError(password, 'Password is required');
            isValid = false;
        }

        if(isValid) {
            // Local Storage Logic
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email.value && u.password === password.value);

            if(user) {
                showModal(`Welcome back, ${user.name}!`);
                loginForm.reset();
                // Optional: Redirect to Dashboard/Home
                // setTimeout(() => window.location.href = 'index.html', 1500);
            } else {
                showError(password, 'Invalid Email or Password');
            }
        }
    });
}