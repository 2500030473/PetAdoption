
import React, { useState, useEffect } from "react";

const initialPets = [
  {
    id: 1,
    name: "Bruno",
    type: "Dog",
    breed: "Labrador",
    age: "2 Years",
    gender: "Male",
    location: "Vijayawada",
    health: "Vaccinated",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600",
    description: "Friendly and playful dog looking for a loving home."
  },
  {
    id: 2,
    name: "Luna",
    type: "Cat",
    breed: "Persian",
    age: "1 Year",
    gender: "Female",
    location: "Guntur",
    health: "Healthy",
    image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600",
    description: "Cute and calm cat who loves people."
  },
  {
    id: 3,
    name: "Max",
    type: "Dog",
    breed: "Golden Retriever",
    age: "3 Years",
    gender: "Male",
    location: "Vijayawada",
    health: "Vaccinated",
    image: "https://images.unsplash.com/photo-1551717743-49959800b1f6?w=600",
    description: "An active and loving dog looking for a forever home."
  }
];

export default function App() {
  const [page, setPage] = useState("home");
  const [role, setRole] = useState("");
  const [user, setUser] = useState(null);

  const [users, setUsers] = useState(
    () => JSON.parse(localStorage.getItem("users")) || []
  );

  const [pets, setPets] = useState(
    () => JSON.parse(localStorage.getItem("pets")) || initialPets
  );

  const [applications, setApplications] = useState(
    () => JSON.parse(localStorage.getItem("applications")) || []
  );

  const [selectedPet, setSelectedPet] = useState(null);
  const [search, setSearch] = useState("");
  const [loginType, setLoginType] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("pets", JSON.stringify(pets));
  }, [pets]);

  useEffect(() => {
    localStorage.setItem("applications", JSON.stringify(applications));
  }, [applications]);

  const navigate = (destination) => {
    setPage(destination);
    setMessage("");
  };

  const notify = (text) => {
    setMessage(text);
  };

  // REGISTER
  const registerUser = (e) => {
    e.preventDefault();

    const data = new FormData(e.target);

    const name = data.get("name").trim();
    const email = data.get("email").trim().toLowerCase();
    const password = data.get("password");
    const selectedRole = data.get("role");

    if (users.some((u) => u.email === email)) {
      notify("Email already registered. Please login.");
      return;
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      role: selectedRole
    };

    setUsers((old) => [...old, newUser]);

    setLoginType(selectedRole);
    e.target.reset();

    notify("Registration successful! Please login.");
    navigate("login");
  };

  // LOGIN
  const loginUser = (e) => {
    e.preventDefault();

    const data = new FormData(e.target);

    const email = data.get("email").trim().toLowerCase();
    const password = data.get("password");

    const foundUser = users.find(
      (u) =>
        u.email === email &&
        u.password === password &&
        u.role === loginType
    );

    if (!foundUser) {
      notify("Invalid email, password or user role.");
      return;
    }

    setUser(foundUser);
    setRole(foundUser.role);

    notify("Login successful!");

    navigate(foundUser.role === "owner" ? "owner" : "pets");
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    setRole("");
    navigate("home");
  };

  // ADD PET
  const addPet = (e) => {
    e.preventDefault();

    const data = new FormData(e.target);

    const newPet = {
      id: Date.now(),
      ownerEmail: user.email,
      name: data.get("name"),
      type: data.get("type"),
      breed: data.get("breed"),
      age: data.get("age"),
      gender: data.get("gender"),
      location: data.get("location"),
      health: data.get("health"),
      image:
        data.get("image") ||
        "https://placehold.co/600x400?text=Pet",
      description: data.get("description")
    };

    setPets((old) => [...old, newPet]);

    e.target.reset();

    notify("Pet added successfully!");
    navigate("owner");
  };

  // ADOPTION APPLICATION
  const submitApplication = (e) => {
    e.preventDefault();

    if (!user || role !== "adopter") {
      notify("Please login as an adopter.");
      navigate("login");
      return;
    }

    const data = new FormData(e.target);

    const newApplication = {
      id: Date.now(),
      applicant: data.get("name"),
      email: user.email,
      phone: data.get("phone"),
      address: data.get("address"),
      reason: data.get("reason"),
      petName: selectedPet.name,
      petId: selectedPet.id,
      ownerEmail: selectedPet.ownerEmail || "",
      status: "Pending"
    };

    setApplications((old) => [...old, newApplication]);

    e.target.reset();

    notify("Application submitted successfully!");
    navigate("adopter");
  };

  // APPROVE OR REJECT
  const updateStatus = (id, status) => {
    setApplications((old) =>
      old.map((app) =>
        app.id === id ? { ...app, status } : app
      )
    );

    notify(`Application ${status.toLowerCase()} successfully!`);
  };

  // SEARCH PETS
  const filteredPets = pets.filter((pet) =>
    `${pet.name} ${pet.type} ${pet.breed} ${pet.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const ownerApplications = applications.filter(
    (app) => app.ownerEmail === user?.email
  );

  const adopterApplications = applications.filter(
    (app) => app.email === user?.email
  );

  const ownerPets = pets.filter(
    (pet) => pet.ownerEmail === user?.email
  );

  return (
    <div style={styles.app}>

      {/* NAVIGATION */}
      <nav style={styles.navbar}>
        <h2 style={styles.logo} onClick={() => navigate("home")}>
          🐾 PetAdopt
        </h2>

        <div style={styles.navLinks}>
          <button style={styles.navButton} onClick={() => navigate("home")}>
            Home
          </button>

          <button style={styles.navButton} onClick={() => navigate("pets")}>
            Browse Pets
          </button>

          <button style={styles.navButton} onClick={() => navigate("about")}>
            About Us
          </button>

          {role === "owner" && (
            <button style={styles.navButton} onClick={() => navigate("owner")}>
              Dashboard
            </button>
          )}

          {role === "adopter" && (
            <button style={styles.navButton} onClick={() => navigate("adopter")}>
              My Applications
            </button>
          )}

          {!user ? (
            <>
              <button
                style={styles.navButton}
                onClick={() => {
                  setLoginType("owner");
                  navigate("login");
                }}
              >
                Owner Login
              </button>

              <button
                style={styles.navButton}
                onClick={() => {
                  setLoginType("adopter");
                  navigate("login");
                }}
              >
                Adopter Login
              </button>

              <button
                style={styles.navButton}
                onClick={() => navigate("register")}
              >
                Register
              </button>
            </>
          ) : (
            <>
              <span style={{ color: "white" }}>
                Hi, {user.name}
              </span>

              <button style={styles.navButton} onClick={logout}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* NOTIFICATION */}
      {message && (
        <div style={styles.message}>
          {message}
          <button onClick={() => setMessage("")}>✕</button>
        </div>
      )}

      {/* HOME */}
      {page === "home" && (
        <section style={styles.hero}>
          <h1 style={styles.heroTitle}>
            Find Your Perfect Companion ❤️
          </h1>

          <p style={styles.heroText}>
            Give a loving pet a safe and happy forever home.
          </p>

          <button
            style={styles.mainButton}
            onClick={() => navigate("pets")}
          >
            Browse Pets
          </button>

          <h2>Welcome to PetAdopt 🐾</h2>

          <p>Choose how you want to continue.</p>

          <div style={styles.row}>
            <button
              style={styles.mainButton}
              onClick={() => {
                setLoginType("owner");
                navigate("login");
              }}
            >
              Owner Login
            </button>

            <button
              style={styles.mainButton}
              onClick={() => {
                setLoginType("adopter");
                navigate("login");
              }}
            >
              Adopter Login
            </button>
          </div>

          <button
            style={styles.outlineButton}
            onClick={() => navigate("register")}
          >
            Create New Account
          </button>
        </section>
      )}

      {/* REGISTRATION */}
      {page === "register" && (
        <section style={styles.section}>
          <h1>Create Your Account</h1>

          <form style={styles.form} onSubmit={registerUser}>
            <input
              style={styles.input}
              name="name"
              placeholder="Full Name"
              required
            />

            <input
              style={styles.input}
              name="email"
              type="email"
              placeholder="Email Address"
              required
            />

            <input
              style={styles.input}
              name="password"
              type="password"
              placeholder="Create Password"
              minLength="6"
              required
            />

            <select
  style={styles.input}
  name="role"
  required
  value={loginType}
  onChange={(e) => setLoginType(e.target.value)}
>
  <option value="">Select Account Type</option>
  <option value="owner">Pet Owner / Shelter</option>
  <option value="adopter">Adopter / Applicant</option>
</select>

            <button style={styles.mainButton} type="submit">
              Register
            </button>

            <p>
              Already registered?
              <button
                type="button"
                style={styles.textButton}
                onClick={() => navigate("login")}
              >
                Login Here
              </button>
            </p>
          </form>
        </section>
      )}

      {/* LOGIN */}
      {page === "login" && (
        <section style={styles.section}>
          <h1>
            {loginType === "owner" ? "Owner Login" : "Adopter Login"}
          </h1>

          <form style={styles.form} onSubmit={loginUser}>
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="Enter Email Address"
              required
            />

            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="Enter Password"
              required
            />

            <button style={styles.mainButton} type="submit">
              Login
            </button>

            <p>
              Don't have an account?
              <button
                type="button"
                style={styles.textButton}
                onClick={() => navigate("register")}
              >
                Register
              </button>
            </p>

            <button
              type="button"
              style={styles.outlineButton}
              onClick={() => navigate("home")}
            >
              Back to Home
            </button>
          </form>
        </section>
      )}

      {/* BROWSE PETS */}
      {page === "pets" && (
        <section style={styles.section}>
          <h1>Available Pets 🐶🐱</h1>

          <input
            style={styles.input}
            placeholder="Search by name, breed or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div style={styles.petGrid}>
            {filteredPets.map((pet) => (
              <div style={styles.card} key={pet.id}>
                <img
                  src={pet.image}
                  alt={pet.name}
                  style={styles.petImage}
                />

                <h2>{pet.name}</h2>
                <p>Breed: {pet.breed}</p>
                <p>Age: {pet.age}</p>
                <p>Location: {pet.location}</p>

                <button
                  style={styles.mainButton}
                  onClick={() => {
                    setSelectedPet(pet);
                    navigate("details");
                  }}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>

          {filteredPets.length === 0 && <p>No pets found.</p>}
        </section>
      )}

      {/* PET DETAILS */}
      {page === "details" && selectedPet && (
        <section style={styles.section}>
          <div style={styles.detailsCard}>
            <img
              src={selectedPet.image}
              alt={selectedPet.name}
              style={styles.detailsImage}
            />

            <h1>{selectedPet.name}</h1>
            <p>Type: {selectedPet.type}</p>
            <p>Breed: {selectedPet.breed}</p>
            <p>Age: {selectedPet.age}</p>
            <p>Gender: {selectedPet.gender}</p>
            <p>Location: {selectedPet.location}</p>
            <p>Health: {selectedPet.health}</p>
            <p>{selectedPet.description}</p>

            <button
              style={styles.mainButton}
              onClick={() => {
                if (!user) {
                  setLoginType("adopter");
                  notify("Please login as an adopter to apply.");
                  navigate("login");
                  return;
                }

                if (role !== "adopter") {
                  notify("Only adopters can apply.");
                  return;
                }

                navigate("adopt");
              }}
            >
              Adopt Me ❤️
            </button>
          </div>
        </section>
      )}

      {/* ADOPTION FORM */}
      {page === "adopt" && selectedPet && (
        <section style={styles.section}>
          <h1>Adoption Application</h1>
          <h3>Selected Pet: {selectedPet.name}</h3>

          <form style={styles.form} onSubmit={submitApplication}>
            <input
              style={styles.input}
              name="name"
              placeholder="Full Name"
              defaultValue={user?.name || ""}
              required
            />

            <input
              style={styles.input}
              name="phone"
              type="tel"
              placeholder="Phone Number"
              required
            />

            <input
              style={styles.input}
              name="address"
              placeholder="Address"
              required
            />

            <textarea
              style={styles.input}
              name="reason"
              placeholder="Why do you want to adopt this pet?"
              required
            />

            <button style={styles.mainButton} type="submit">
              Submit Adoption Application
            </button>
          </form>
        </section>
      )}

      {/* ADD PET */}
      {page === "addpet" && role === "owner" && (
        <section style={styles.section}>
          <h1>Add New Pet 🐾</h1>

          <form style={styles.form} onSubmit={addPet}>
            <input
              style={styles.input}
              name="name"
              placeholder="Pet Name"
              required
            />

            <select
              style={styles.input}
              name="type"
              required
              defaultValue=""
            >
              <option value="" disabled>Select Pet Type</option>
              <option>Dog</option>
              <option>Cat</option>
              <option>Other</option>
            </select>

            <input
              style={styles.input}
              name="breed"
              placeholder="Breed"
              required
            />

            <input
              style={styles.input}
              name="age"
              placeholder="Age"
              required
            />

            <select
              style={styles.input}
              name="gender"
              required
              defaultValue=""
            >
              <option value="" disabled>Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>

            <input
              style={styles.input}
              name="location"
              placeholder="Location"
              required
            />

            <input
              style={styles.input}
              name="health"
              placeholder="Health / Vaccination Details"
              required
            />

            <input
              style={styles.input}
              name="image"
              placeholder="Pet Image URL (optional)"
            />

            <textarea
              style={styles.input}
              name="description"
              placeholder="Pet Description"
              required
            />

            <button style={styles.mainButton} type="submit">
              Publish Pet
            </button>
          </form>
        </section>
      )}

      {/* OWNER DASHBOARD */}
      {page === "owner" && role === "owner" && user && (
        <section style={styles.section}>
          <h1>Welcome, {user.name} 🏠</h1>
          <h2>Owner Dashboard</h2>

          <button
            style={styles.mainButton}
            onClick={() => navigate("addpet")}
          >
            + Add New Pet
          </button>

          <h2>My Listed Pets</h2>

          <div style={styles.petGrid}>
            {ownerPets.map((pet) => (
              <div style={styles.card} key={pet.id}>
                <img src={pet.image} alt={pet.name} style={styles.petImage} />
                <h3>{pet.name}</h3>
                <p>{pet.breed}</p>
                <p>{pet.health}</p>
              </div>
            ))}
          </div>

          <h2>Received Applications</h2>

          {ownerApplications.length === 0 && (
            <p>No applications received yet.</p>
          )}

          {ownerApplications.map((app) => (
            <div style={styles.applicationCard} key={app.id}>
              <h3>Applicant: {app.applicant}</h3>
              <p>Pet: {app.petName}</p>
              <p>Email: {app.email}</p>
              <p>Phone: {app.phone}</p>
              <p>Address: {app.address}</p>
              <p>Reason: {app.reason}</p>
              <p>Status: <strong>{app.status}</strong></p>

              {app.status === "Pending" && (
                <div style={styles.row}>
                  <button
                    style={styles.approveButton}
                    onClick={() => updateStatus(app.id, "Approved")}
                  >
                    Approve
                  </button>

                  <button
                    style={styles.rejectButton}
                    onClick={() => updateStatus(app.id, "Rejected")}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* ADOPTER DASHBOARD */}
      {page === "adopter" && role === "adopter" && user && (
        <section style={styles.section}>
          <h1>Welcome, {user.name} ❤️</h1>
          <h2>My Adoption Applications</h2>

          {adopterApplications.length === 0 && (
            <p>You have not submitted any applications yet.</p>
          )}

          {adopterApplications.map((app) => (
            <div style={styles.applicationCard} key={app.id}>
              <h3>Pet: {app.petName}</h3>
              <p>Applicant: {app.applicant}</p>
              <p>Application ID: {app.id}</p>
              <p>Status: <strong>{app.status}</strong></p>
            </div>
          ))}

          <button
            style={styles.mainButton}
            onClick={() => navigate("pets")}
          >
            Browse More Pets
          </button>
        </section>
      )}

      {/* ABOUT */}
      {page === "about" && (
        <section style={styles.section}>
          <h1>About PetAdopt 🐾</h1>
          <p>
            PetAdopt connects pet owners and shelters with
            people who want to adopt pets.
          </p>
          <p>
            Users can browse pets, view health information,
            submit applications, and track adoption status.
          </p>
          <h2>Our Mission</h2>
          <p>
            Every pet deserves a safe, happy and loving home.
          </p>
        </section>
      )}

      {/* FOOTER */}
      <footer style={styles.footer}>
        <h2>🐾 PetAdopt</h2>
        <p>Every Pet Deserves a Loving Home ❤️</p>
        <p>© 2026 Pet Adoption Platform</p>
      </footer>

    </div>
  );
}

// INLINE CSS STYLES

const styles = {
  app: {
    fontFamily: "Arial, sans-serif",
    background: "#f5f8f4",
    minHeight: "100vh",
    color: "#333"
  },

  navbar: {
    background: "#236b45",
    color: "white",
    padding: "18px 4%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px"
  },

  logo: {
    cursor: "pointer",
    margin: 0
  },

  navLinks: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "8px"
  },

  navButton: {
    background: "transparent",
    border: "none",
    color: "white",
    padding: "10px",
    cursor: "pointer",
    fontSize: "14px"
  },

  hero: {
    textAlign: "center",
    padding: "90px 20px",
    background: "#e1f2e5",
    minHeight: "480px"
  },

  heroTitle: {
    fontSize: "40px",
    color: "#236b45"
  },

  heroText: {
    fontSize: "18px",
    marginBottom: "25px"
  },

  section: {
    padding: "45px 6%",
    textAlign: "center",
    minHeight: "65vh"
  },

  mainButton: {
    background: "#2c8854",
    color: "white",
    padding: "12px 22px",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    margin: "10px"
  },

  outlineButton: {
    background: "white",
    color: "#236b45",
    border: "1px solid #236b45",
    padding: "12px 22px",
    borderRadius: "7px",
    cursor: "pointer",
    margin: "10px"
  },

  textButton: {
    color: "#236b45",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "8px"
  },

  row: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "10px",
    margin: "20px"
  },

  input: {
    display: "block",
    width: "100%",
    maxWidth: "450px",
    padding: "13px",
    margin: "12px auto",
    border: "1px solid #ccc",
    borderRadius: "6px",
    boxSizing: "border-box",
    fontSize: "15px"
  },

  form: {
    maxWidth: "500px",
    margin: "25px auto",
    padding: "25px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 3px 12px #00000015"
  },

  petGrid: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "25px",
    marginTop: "30px"
  },

  card: {
    background: "white",
    width: "280px",
    padding: "18px",
    borderRadius: "12px",
    boxShadow: "0 3px 12px #00000015"
  },

  petImage: {
    width: "100%",
    height: "190px",
    objectFit: "cover",
    borderRadius: "10px"
  },

  detailsCard: {
    background: "white",
    maxWidth: "600px",
    margin: "auto",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 3px 12px #00000015"
  },

  detailsImage: {
    width: "100%",
    maxHeight: "350px",
    objectFit: "cover",
    borderRadius: "12px"
  },

  applicationCard: {
    background: "white",
    maxWidth: "650px",
    padding: "22px",
    margin: "20px auto",
    textAlign: "left",
    borderRadius: "10px",
    boxShadow: "0 3px 12px #00000015"
  },

  approveButton: {
    background: "#238b45",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer"
  },

  rejectButton: {
    background: "#d94a4a",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer"
  },

  message: {
    background: "#d8f5df",
    color: "#176534",
    padding: "15px",
    textAlign: "center",
    fontWeight: "bold"
  },

  footer: {
    background: "#204b35",
    color: "white",
    textAlign: "center",
    padding: "25px"
  }
};
