const API_URL = "https://gist.githubusercontent.com/PIYUSH-123tari/c27da6ef5606e331e8316bb3498d8d65/raw/b0bb91dc28a0f018e5d6c5921e942594de4f3bcd/db.json";

const dateBar = document.getElementById("dateBar");
const container = document.getElementById("showtimesContainer");
const bookedSeatsBtn = document.getElementById('bookedSeatsBtn');

const activeDates = ["June 17 Tue", "June 18 Wed", "June 19 Thur"];
const allDates = ["June 17 Tue", "June 18 Wed", "June 19 Thur", "June 20 Fri", "June 21 Sat", "June 22 Sun"];

// ------------------- BOOKED SEATS BUTTON -------------------
bookedSeatsBtn.addEventListener('click', () => {
  const userId = localStorage.getItem('LoggedInUser');
  if (!userId) {
    alert('❌ Please login first to view your bookings');
    window.location.href = '../form.html';
    return;
  }
  window.location.href = './bookedseatDisplay/booked.html';
});

// ------------------- LOAD API DATA -------------------
async function loadShowtimes() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    console.log("Fetched Data:", data);

    renderDateBar(data);
    showMovies(data, activeDates[0]);  // default first date
  } catch (err) {
    container.innerHTML = <p style="color:red;">❌ Error loading data: ${err.message}</p>;
  }
}

// ------------------- DATE BAR -------------------
function renderDateBar(data) {
  dateBar.innerHTML = "";

  allDates.forEach(d => {
    const btn = document.createElement("button");
    btn.className = "date-btn";

    const parts = d.split(" ");
    btn.innerHTML = parts.join("<br>");

    if (!activeDates.includes(d)) {
      btn.classList.add("disabled");
      btn.disabled = true;
    } else if (d === activeDates[0]) {
      btn.classList.add("active");
    }

    btn.addEventListener("click", () => {
      document.querySelectorAll(".date-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      showMovies(data, d);
    });

    dateBar.appendChild(btn);
  });
}

// ------------------- SHOW MOVIES (UPDATED FOR NEW JSON) -------------------
function showMovies(data, date) {
  container.innerHTML = "";

  if (!data.showtimes[date]) {
    container.innerHTML = "<p>No shows available.</p>";
    return;
  }

  const shows = data.showtimes[date][0]; // IMPORTANT FIX ✔

  for (const movie in shows) {
    const card = document.createElement("div");
    card.className = "showtime-card";

    const title = document.createElement("div");
    title.className = "movie-title";
    title.textContent = movie;
    card.appendChild(title);

    const theatres = shows[movie];

    for (const theatre in theatres) {
      const theatreEl = document.createElement("div");
      theatreEl.className = "theatre";
      theatreEl.textContent = theatre;

      const timesDiv = document.createElement("div");

      theatres[theatre].forEach(time => {
        const timeBtn = document.createElement("button");
        timeBtn.className = "time-btn";
        timeBtn.textContent = time;

        timeBtn.dataset.movie = movie;
        timeBtn.dataset.cinema = theatre;
        timeBtn.dataset.date = date;

        timeBtn.addEventListener('click', () => handleTimeClick(timeBtn));
        timesDiv.appendChild(timeBtn);
      });

      card.appendChild(theatreEl);
      card.appendChild(timesDiv);
    }

    container.appendChild(card);
  }
}

// ------------------- TIME BUTTON HANDLER -------------------
function handleTimeClick(button) {
  const isSelected = button.classList.contains('selected');

  if (isSelected) {
    clearSelectionState();
    return;
  }

  clearSelectionState();
  button.classList.add('selected');

  document.querySelectorAll('.time-btn').forEach(b => {
    if (b !== button) b.classList.add('disabled');
  });

  document.querySelectorAll('.date-btn').forEach(db => {
    db.classList.add('disabled');
    db.disabled = true;
  });

  const activeDateBtn = [...document.querySelectorAll('.date-btn')]
    .find(x => x.classList.contains('active'));

  if (activeDateBtn) {
    activeDateBtn.classList.remove('disabled');
    activeDateBtn.disabled = false;
  }

  let card = button.closest('.showtime-card');

  document.querySelectorAll('.choose-seat').forEach(el => el.remove());

  const choose = document.createElement('button');
  choose.className = 'choose-seat';
  choose.textContent = 'Choose Seat';

  choose.addEventListener('click', () => {
    localStorage.setItem('movie name', button.dataset.movie);
    localStorage.setItem('cinema name', button.dataset.cinema);
    localStorage.setItem('showtiming', button.textContent);
    localStorage.setItem('date', button.dataset.date);

    window.location.href = './seats/seats.html';
  });

  card.appendChild(choose);
}

// ------------------- CLEAR STATE -------------------
function clearSelectionState() {
  document.querySelectorAll('.time-btn').forEach(b => {
    b.classList.remove('selected');
    b.classList.remove('disabled');
    b.disabled = false;
  });

  document.querySelectorAll('.date-btn').forEach(db => {
    db.classList.remove('disabled');
    db.disabled = false;
  });

  document.querySelectorAll('.choose-seat').forEach(el => el.remove());
}

// ------------------- INITIAL LOAD -------------------
loadShowtimes();
