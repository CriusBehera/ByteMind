import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// 🔧 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCqpm7Q5vhOayObiPJQRsM6U4NzmGamKiM",
  authDomain: "bytemindclubdb.firebaseapp.com",
  projectId: "bytemindclubdb",
  storageBucket: "bytemindclubdb.firebasestorage.app",
  messagingSenderId: "487949050714",
  appId: "1:487949050714:web:337dac45b632dd78594963"
};

// 🚀 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 🔁 Auto-redirect if already logged in
const cachedUser = JSON.parse(localStorage.getItem("bytemindUser"));
if (cachedUser && cachedUser.email) {
  window.location.href = "/";
}

// 🔐 Email Sign-In with Verification Check + Resend
document.getElementById("emailLoginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;

      if (user.emailVerified) {
        const name = user.displayName || user.email;
        localStorage.setItem("bytemindUser", JSON.stringify({
          email: user.email,
          uid: user.uid,
          name: name
        }));
        window.location.href = "/";
      } else {
        alert("⚠️ Your email is not verified. Sending a new verification email...");
        await sendEmailVerification(user);
        await signOut(auth);
        alert("📩 Verification email sent to " + email + ". Please check your inbox. \n⚠️ If you have not recived the mail please wait at least 24hrs and then try again.");
      }
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
    });
});

// 🧠 Email Sign-Up with Verification + Name Storage
window.signUpEmail = () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      const name = prompt("Welcome to ByteMind! What's your name?");

      if (name) {
        await updateProfile(user, { displayName: name.trim() });
      }

      await sendEmailVerification(user);
      alert("✅ Account created! A verification email has been sent to " + email);

      await signOut(auth); // Block access until verified
      alert("Please verify your email before logging in. \n⚠️ If you have not recived the mail please wait at least 24hrs and then try again.");
    })
    .catch((error) => {
      alert("Sign-up failed: " + error.message);
    });
};

// 🌐 Google Sign-In (No verification required)
window.signInGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      const name = user.displayName || user.email;
      localStorage.setItem("bytemindUser", JSON.stringify({
        email: user.email,
        uid: user.uid,
        name: name
      }));
      window.location.href = "/";
    })
    .catch((error) => {
      alert("Google Sign-In failed: " + error.message);
    });
};

// 🔁 Forgot Password
window.resetPassword = () => {
  const email = document.getElementById("email").value.trim();
  if (!email) {
    alert("Please enter your email to receive a reset link.");
    return;
  }

  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("Password reset email sent to " + email);
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
};

// 🚪 Sign Out
window.signOut = () => {
  localStorage.removeItem("bytemindUser");
  alert("Signed out successfully.");
  window.location.href = "login.html";
};

// 🎛️ Dropdown Toggle
window.toggleDropdown = () => {
  const menu = document.getElementById("dropdownMenu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
};

// 🎯 Scroll to Form
window.scrollToForm = () => {
  document.getElementById("email").focus();
  window.scrollTo({
    top: document.getElementById("emailLoginForm").offsetTop,
    behavior: "smooth"
  });
};