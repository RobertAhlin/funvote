// Konstanter för Local Storage-nycklar och lösenord
const VOTING_KEY = 'voting_data';
const LOCK_KEY = 'voting_locked';
const USER_VOTED = 'user_voted';
const ADMIN_PASSWORD = 'hemligt123';

// Hämtar omröstningsdata från Local Storage
function getVotingData() {
  return JSON.parse(localStorage.getItem(VOTING_KEY)) || {
    options: ['Alternativ 1', 'Alternativ 2', 'Alternativ 3'],
    votes: [0, 0, 0],
  };
}

// Sparar omröstningsdata till Local Storage
function saveVotingData(data) {
  localStorage.setItem(VOTING_KEY, JSON.stringify(data));
}

// Kontrollera omröstningsstatus
function isVotingLocked() {
  return JSON.parse(localStorage.getItem(LOCK_KEY)) || false;
}

// Röstsidan
function renderVotingPage() {
  const container = document.getElementById('vote-options');
  const votingData = getVotingData();
  const userVoted = localStorage.getItem(USER_VOTED);

  if (isVotingLocked()) {
    document.getElementById('message').textContent = 'Omröstningen är låst.';
    return;
  }

  if (userVoted) {
    document.getElementById('message').textContent = 'Du har redan röstat!';
    return;
  }

  votingData.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.textContent = option;
    button.onclick = () => vote(index);
    container.appendChild(button);
  });
}

function vote(index) {
  const votingData = getVotingData();
  votingData.votes[index]++;
  saveVotingData(votingData);
  localStorage.setItem(USER_VOTED, true);
  alert('Tack för din röst!');
  location.reload();
}

let chartInstance; // Variabel för att lagra Chart-instansen

function renderResultsPage() {
  const ctx = document.getElementById('resultsChart').getContext('2d');

  // Funktion för att uppdatera diagrammet
  function updateChart() {
    const votingData = getVotingData(); // Hämta senaste data

    if (chartInstance) {
      // Uppdatera befintligt diagram utan animering
      chartInstance.data.labels = votingData.options;
      chartInstance.data.datasets[0].data = votingData.votes;
      chartInstance.update('none'); // Ingen animation vid uppdatering
    } else {
      // Skapa ett nytt diagram om det inte redan finns
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: votingData.options,
          datasets: [
            {
              label: 'Röster',
              data: votingData.votes,
              backgroundColor: ['#7D8EA3', '#A6B1C3', '#BCCCD8', '#CAD7E8', '#DCE6F4'], // Nedtonade färger
              borderColor: '#3A4A63', // Mörkare ramfärg för staplarna
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // Gör så att höjden kan styras av CSS
          animation: false, // Stänger av animation vid första renderingen
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: '#333', // Mörkgrå för att matcha temat
              },
              grid: {
                color: '#e0e0e0', // Ljusgrå rutnät
              },
            },
            x: {
              ticks: {
                color: '#333',
              },
              grid: {
                display: false, // Ta bort vertikala linjer
              },
            },
          },
        },
      });
    }
  }

  // Kör en gång direkt vid laddning
  updateChart();

  // Uppdatera data var 5:e sekund
  setInterval(updateChart, 5000);
}

// Administratörsgränssnittet
function renderAdminPage() {
  const status = document.getElementById('status');
  status.textContent = isVotingLocked()
    ? 'Omröstningen är låst'
    : 'Omröstningen är öppen';

  const votingData = getVotingData();
  const optionsList = document.getElementById('optionsList');
  optionsList.innerHTML = '';
  votingData.options.forEach((option, index) => {
    const li = document.createElement('li');
    li.textContent = option;

    // Lägg till redigera-knapp
    const editButton = document.createElement('button');
    editButton.textContent = 'Redigera';
    editButton.onclick = () => editOption(index);

    // Lägg till ta bort-knapp
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Ta bort';
    deleteButton.onclick = () => deleteOption(index);

    li.appendChild(editButton);
    li.appendChild(deleteButton);
    optionsList.appendChild(li);
  });
}

function resetVotes() {
  const votingData = getVotingData();
  votingData.votes = new Array(votingData.options.length).fill(0); // Nollställ röster
  saveVotingData(votingData);
  localStorage.removeItem(USER_VOTED); // Tillåt användare att rösta igen
  alert('Röster har nollställts och användare kan rösta igen!');
}

function toggleVoting() {
  const locked = isVotingLocked();
  localStorage.setItem(LOCK_KEY, !locked);
  alert(locked ? 'Omröstningen är nu öppen!' : 'Omröstningen är nu låst!');
  location.reload();
}

function addOption() {
  const newOption = document.getElementById('newOption').value;
  if (!newOption) return;
  const votingData = getVotingData();
  votingData.options.push(newOption);
  votingData.votes.push(0);
  saveVotingData(votingData);
  alert('Nytt alternativ tillagt!');
  location.reload();
}

function editOption(index) {
  const votingData = getVotingData();
  const newOption = prompt(`Ange nytt namn för alternativ "${votingData.options[index]}":`);
  if (newOption) {
    votingData.options[index] = newOption; // Uppdatera alternativets namn
    saveVotingData(votingData);
    alert('Alternativet har uppdaterats!');
    renderAdminPage(); // Uppdatera listan på adminsidan
  }
}

function deleteOption(index) {
  const votingData = getVotingData();
  const confirmed = confirm(`Vill du verkligen ta bort alternativ "${votingData.options[index]}"?`);
  if (confirmed) {
    votingData.options.splice(index, 1); // Ta bort alternativet
    votingData.votes.splice(index, 1); // Ta bort dess röstdata
    saveVotingData(votingData);
    alert('Alternativet har tagits bort!');
    renderAdminPage(); // Uppdatera listan på adminsidan
  }
}

// Admin-inloggning
function checkAdminAccess() {
  const isAuthenticated = localStorage.getItem('admin_authenticated');
  if (isAuthenticated) {
    showAdminSection();
  }
}

function authenticate() {
  const passwordInput = document.getElementById('adminPassword').value;
  const loginMessage = document.getElementById('loginMessage');

  if (passwordInput === ADMIN_PASSWORD) {
    localStorage.setItem('admin_authenticated', true);
    showAdminSection();
  } else {
    loginMessage.textContent = 'Fel lösenord, försök igen.';
    loginMessage.style.color = 'red';
  }
}

function showAdminSection() {
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('admin-section').style.display = 'block';
  renderAdminPage();
}

function logoutAdmin() {
  localStorage.removeItem('admin_authenticated');
  location.reload();
}